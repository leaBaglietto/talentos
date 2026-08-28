import { useState, useEffect } from 'react';
import { supabase } from '@/lib/supabase';
import { Candidate, CandidateStatus, CandidateRole, CandidateProject, CandidateNote, CandidateRating } from '@/lib/types';

export function useCandidates() {
  const [candidates, setCandidates] = useState<Candidate[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCandidates = async () => {
    setLoading(true);
    const [candRes, ratingsRes] = await Promise.all([
      supabase.from('candidates').select('*').order('created_at', { ascending: false }),
      supabase.from('candidate_ratings').select('*').order('created_at', { ascending: false }),
    ]);
    
    if (candRes.error) {
      setError(candRes.error.message);
    } else {
      const rawCandidates = candRes.data || [];
      const allRatings: CandidateRating[] = ratingsRes.data || [];

      // Group ratings by candidate_id
      const ratingsByCandidate = allRatings.reduce((acc: Record<string, CandidateRating[]>, r) => {
        if (!acc[r.candidate_id]) acc[r.candidate_id] = [];
        acc[r.candidate_id].push(r);
        return acc;
      }, {});

      const enrichedCandidates: Candidate[] = rawCandidates.map(c => {
        const candidateRatings = ratingsByCandidate[c.id] || [];
        let avgRating: number | null = c.rating;
        if (candidateRatings.length > 0) {
          const sum = candidateRatings.reduce((total, r) => total + r.rating, 0);
          avgRating = Math.round((sum / candidateRatings.length) * 10) / 10;
        }
        return {
          ...c,
          rating: avgRating,
          ratings: candidateRatings,
        };
      });

      setCandidates(enrichedCandidates);
    }
    setLoading(false);
  };

  const updateStatus = async (id: string, status: CandidateStatus) => {
    const { error } = await supabase.from('candidates').update({ status }).eq('id', id);
    if (!error) {
      setCandidates(prev => prev.map(c => c.id === id ? { ...c, status } : c));
    }
    return { error };
  };

  const updateRating = async (
    candidateId: string,
    rating: number | null,
    adminEmail?: string | null,
    adminId?: string | null
  ) => {
    const safeAdminEmail = adminEmail || 'admin';

    // 1. Try to upsert or delete in candidate_ratings table
    try {
      if (rating === null) {
        await supabase
          .from('candidate_ratings')
          .delete()
          .eq('candidate_id', candidateId)
          .eq('admin_email', safeAdminEmail);
      } else {
        await supabase
          .from('candidate_ratings')
          .upsert(
            {
              candidate_id: candidateId,
              admin_id: adminId || null,
              admin_email: safeAdminEmail,
              rating: rating,
            },
            { onConflict: 'candidate_id, admin_email' }
          );
      }
    } catch {
      // Ignore if table candidate_ratings is not created yet
    }

    // 2. Compute updated ratings array and calculate average rating
    let calculatedAvg: number | null = null;
    let newRatingsList: CandidateRating[] = [];

    setCandidates(prev =>
      prev.map(c => {
        if (c.id !== candidateId) return c;

        const currentRatings = c.ratings || [];
        if (rating === null) {
          newRatingsList = currentRatings.filter(r => r.admin_email !== safeAdminEmail);
        } else {
          const existingIndex = currentRatings.findIndex(r => r.admin_email === safeAdminEmail);
          const ratingEntry: CandidateRating = {
            id: existingIndex >= 0 ? currentRatings[existingIndex].id : `rating-${Date.now()}`,
            candidate_id: candidateId,
            admin_id: adminId,
            admin_email: safeAdminEmail,
            rating: rating,
            created_at: new Date().toISOString(),
          };

          if (existingIndex >= 0) {
            newRatingsList = currentRatings.map((r, idx) => idx === existingIndex ? ratingEntry : r);
          } else {
            newRatingsList = [ratingEntry, ...currentRatings];
          }
        }

        if (newRatingsList.length > 0) {
          const sum = newRatingsList.reduce((acc, curr) => acc + curr.rating, 0);
          calculatedAvg = Math.round((sum / newRatingsList.length) * 10) / 10;
        } else {
          calculatedAvg = null;
        }

        return {
          ...c,
          rating: calculatedAvg,
          ratings: newRatingsList,
          rating_admin_email: safeAdminEmail,
        };
      })
    );

    // 3. Update candidates table with the calculated average and last admin
    const updatePayload: Record<string, any> = { rating: calculatedAvg !== null ? Math.round(calculatedAvg) : null };
    if (safeAdminEmail) updatePayload.rating_admin_email = safeAdminEmail;
    if (adminId) updatePayload.rating_admin_id = adminId;

    let { error } = await supabase.from('candidates').update(updatePayload).eq('id', candidateId);

    if (error && (error.message?.includes('rating_admin') || error.code === '42703' || error.message?.includes('schema cache'))) {
      const fallback = await supabase.from('candidates').update({ rating: calculatedAvg !== null ? Math.round(calculatedAvg) : null }).eq('id', candidateId);
      error = fallback.error;
    }

    return { error };
  };

  const getRatings = async (candidateId: string) => {
    const { data, error } = await supabase
      .from('candidate_ratings')
      .select('*')
      .eq('candidate_id', candidateId)
      .order('created_at', { ascending: false });
    return { data: (data as CandidateRating[]) || [], error };
  };

  const getProjects = async (candidateId: string) => {
    const { data, error } = await supabase
      .from('candidate_projects')
      .select('*')
      .eq('candidate_id', candidateId)
      .order('created_at', { ascending: false });
    return { data: (data as CandidateProject[]) || [], error };
  };

  const addProject = async (candidateId: string, projectName: string, adminId: string) => {
    const { data, error } = await supabase
      .from('candidate_projects')
      .insert({ candidate_id: candidateId, project_name: projectName, admin_id: adminId })
      .select()
      .single();
    return { data: data as CandidateProject, error };
  };

  const getNotes = async (candidateId: string) => {
    const { data, error } = await supabase
      .from('candidate_notes')
      .select('*')
      .eq('candidate_id', candidateId)
      .order('created_at', { ascending: false });
    return { data: (data as CandidateNote[]) || [], error };
  };

  const addNote = async (candidateId: string, adminId: string, adminEmail: string, note: string) => {
    const { data, error } = await supabase
      .from('candidate_notes')
      .insert({ candidate_id: candidateId, admin_id: adminId, admin_email: adminEmail, note })
      .select()
      .single();
    return { data: data as CandidateNote, error };
  };

  const counts = {
    pending: candidates.filter(c => c.status === 'pending').length,
    accepted: candidates.filter(c => c.status === 'accepted').length,
    rejected: candidates.filter(c => c.status === 'rejected').length,
  };

  const getFilteredCandidates = (status: CandidateStatus, roleFilter: string | null) => {
    let filtered = candidates.filter(c => c.status === status);
    if (roleFilter && roleFilter !== 'Todos') {
      filtered = filtered.filter(c => c.roles.includes(roleFilter as CandidateRole));
    }
    return filtered;
  };

  useEffect(() => {
    fetchCandidates();
  }, []);

  return {
    candidates,
    loading,
    error,
    counts,
    fetchCandidates,
    updateStatus,
    updateRating,
    getRatings,
    getProjects,
    addProject,
    getNotes,
    addNote,
    getFilteredCandidates,
  };
}
