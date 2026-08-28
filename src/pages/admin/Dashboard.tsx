import React, { useState, useEffect } from 'react';
import { AdminLayout } from '@/components/layout/AdminLayout';
import { useCandidates } from '@/hooks/useCandidates';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Modal } from '@/components/ui/Modal';
import { Spinner } from '@/components/ui/Spinner';
import { RatingBadge } from '@/components/ui/RatingBadge';
import { RatingSelector } from '@/components/ui/RatingSelector';
import { RatingQuickPopover } from '@/components/ui/RatingQuickPopover';
import { Candidate, CandidateStatus, CANDIDATE_ROLES, CandidateProject, CandidateNote, CandidateRating, formatAdminName } from '@/lib/types';
import { Filter, Mail, Phone, ExternalLink, Inbox, Briefcase, Calendar, Plus, Star } from 'lucide-react';

export default function Dashboard() {
  const {
    loading,
    counts,
    updateStatus,
    updateRating,
    getRatings,
    getProjects,
    addProject,
    getNotes,
    addNote,
    getFilteredCandidates
  } = useCandidates();
  
  const { user } = useAuth();

  const [activeView, setActiveView] = useState<CandidateStatus>('pending');
  const [roleFilter, setRoleFilter] = useState<string | null>(null);
  
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [showPendingModal, setShowPendingModal] = useState(false);
  const [showAcceptedModal, setShowAcceptedModal] = useState(false);
  const [ratingPopoverId, setRatingPopoverId] = useState<string | null>(null);

  const displayedCandidates = getFilteredCandidates(activeView, roleFilter);

  const openPendingModal = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setShowPendingModal(true);
  };

  const openAcceptedModal = (candidate: Candidate) => {
    setSelectedCandidate(candidate);
    setShowAcceptedModal(true);
  };

  const handleStatusChange = async (id: string, status: CandidateStatus) => {
    await updateStatus(id, status);
    setShowPendingModal(false);
  };

  const formatDate = (isoString: string) => {
    if (!isoString) return '';
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return `${d.getDate()}/${d.getMonth() + 1}/${d.getFullYear()}`;
  };

  return (
    <AdminLayout activeView={activeView} onViewChange={setActiveView} counts={counts}>
      
      {/* Role Filters */}
      <div style={{ marginBottom: 32 }}>
        <div className="flex items-center flex-wrap" style={{ gap: 10 }}>
          <div className="flex items-center text-neutral-400" style={{ gap: 8, marginRight: 8 }}>
            <Filter size={16} className="text-[#FF6B00]" />
            <span className="font-bold uppercase tracking-wider text-neutral-300" style={{ fontSize: 13 }}>Filtrar:</span>
          </div>
          <button
            onClick={() => setRoleFilter(null)}
            className={`rounded-full font-bold transition-all cursor-pointer outline-none ${
              !roleFilter || roleFilter === 'Todos'
                ? 'bg-[#FF6B00] border border-[#FF6B00] text-white shadow-lg shadow-orange-600/25'
                : 'bg-white/5 border border-white/10 text-neutral-300 hover:border-[#FF6B00] hover:text-white'
            }`}
            style={{ padding: '8px 20px', fontSize: 13 }}
          >
            Todos
          </button>
          {CANDIDATE_ROLES.map(role => (
            <button
              key={role}
              onClick={() => setRoleFilter(role)}
              className={`rounded-full font-bold transition-all cursor-pointer outline-none ${
                roleFilter === role
                  ? 'bg-[#FF6B00] border border-[#FF6B00] text-white shadow-lg shadow-orange-600/25'
                  : 'bg-white/5 border border-white/10 text-neutral-300 hover:border-[#FF6B00] hover:text-white'
              }`}
              style={{ padding: '8px 20px', fontSize: 13 }}
            >
              {role}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="flex justify-center items-center py-24">
          <Spinner size="lg" />
        </div>
      ) : displayedCandidates.length === 0 ? (
        <div className="flex flex-col items-center justify-center text-neutral-400 border border-white/5 rounded-[32px] bg-white/[0.02]" style={{ padding: '80px 24px' }}>
          <div className="w-16 h-16 rounded-full bg-white/5 flex items-center justify-center text-[#FF6B00]" style={{ marginBottom: 16 }}>
            <Inbox size={32} />
          </div>
          <p className="font-semibold text-neutral-200" style={{ fontSize: 16 }}>No hay postulaciones en esta categoría</p>
          <p className="text-neutral-500" style={{ fontSize: 12, marginTop: 4 }}>Los candidatos registrados aparecerán listados aquí.</p>
        </div>
      ) : (
        <div>
          {/* Table Headers matching specification */}
          {activeView === 'accepted' ? (
            <div className="hidden lg:grid grid-cols-12 text-white font-bold select-none" style={{ gap: 24, padding: '0 32px', fontSize: 14, marginBottom: 16 }}>
              <div className="col-span-3">Nombre</div>
              <div className="col-span-2">Se anoto el...</div>
              <div className="col-span-2">Se especializado en</div>
              <div className="col-span-1">Experiencia</div>
              <div className="col-span-2">Valoración</div>
              <div className="col-span-2 text-right"></div>
            </div>
          ) : (
            <div className="hidden lg:grid grid-cols-12 text-white font-bold select-none" style={{ gap: 24, padding: '0 32px', fontSize: 14, marginBottom: 16 }}>
              <div className="col-span-4">Nombre</div>
              <div className="col-span-2">Se anoto el...</div>
              <div className="col-span-3">Se especializado en</div>
              <div className="col-span-1">Experiencia</div>
              <div className="col-span-2 text-right"></div>
            </div>
          )}

          {/* Candidates List of Cards */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {displayedCandidates.map(candidate => (
              <div
                key={candidate.id}
                className="w-full border-[1.5px] border-[#FF6B00] bg-[#1E140E]/90 hover:bg-[#251912] transition-all duration-200 shadow-xl relative group"
                style={{ borderRadius: 36, padding: '24px 32px' }}
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 items-center" style={{ gap: 24 }}>
                  
                  {/* Column 1: Avatar + Name + Email */}
                  <div className={`${activeView === 'accepted' ? 'lg:col-span-3' : 'lg:col-span-4'} flex items-center`} style={{ gap: 20 }}>
                    {candidate.photo_url ? (
                      <img
                        src={candidate.photo_url}
                        alt={candidate.full_name}
                        className="rounded-full object-cover border border-white/10 flex-shrink-0 shadow-lg"
                        style={{ width: 72, height: 72 }}
                      />
                    ) : (
                      <div className="rounded-full bg-white/5 border border-[#FF6B00]/40 flex items-center justify-center font-bold text-[#FF6B00] flex-shrink-0 shadow-lg" style={{ width: 72, height: 72, fontSize: 24 }}>
                        {candidate.full_name.charAt(0)}
                      </div>
                    )}
                    <div style={{ minWidth: 0 }}>
                      <h3 className="font-bold text-white tracking-tight truncate" style={{ fontSize: 20 }}>
                        {candidate.full_name}
                      </h3>
                      <p className="text-neutral-400 font-normal truncate" style={{ fontSize: 13, marginTop: 2 }}>
                        {candidate.email}
                      </p>
                    </div>
                  </div>

                  {/* Column 2: Date */}
                  <div className="lg:col-span-2 flex flex-col justify-center">
                    <span className="lg:hidden text-neutral-400 font-semibold uppercase tracking-wider" style={{ fontSize: 11, marginBottom: 4 }}>
                      Se anoto el...
                    </span>
                    <span className="font-bold text-white" style={{ fontSize: 16 }}>
                      {formatDate(candidate.created_at)}
                    </span>
                  </div>

                  {/* Column 3: Specialties (Vertical List) */}
                  <div className={`${activeView === 'accepted' ? 'lg:col-span-2' : 'lg:col-span-3'} flex flex-col justify-center`}>
                    <span className="lg:hidden text-neutral-400 font-semibold uppercase tracking-wider" style={{ fontSize: 11, marginBottom: 4 }}>
                      Se especializado en
                    </span>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {candidate.roles.length > 0 ? (
                        candidate.roles.map(r => (
                          <span key={r} className="font-bold text-white" style={{ fontSize: 14, lineHeight: 1.4 }}>
                            {r}
                          </span>
                        ))
                      ) : (
                        <span className="text-neutral-400 italic" style={{ fontSize: 14 }}>Sin especialidad</span>
                      )}
                    </div>
                  </div>

                  {/* Column 4: Experience */}
                  <div className="lg:col-span-1 flex flex-col justify-center">
                    <span className="lg:hidden text-neutral-400 font-semibold uppercase tracking-wider" style={{ fontSize: 11, marginBottom: 4 }}>
                      Experiencia
                    </span>
                    <span className="font-bold text-white" style={{ fontSize: 16, whiteSpace: 'nowrap' }}>
                      {candidate.experience_years} años
                    </span>
                  </div>

                  {/* Column 5: Valoración (Only in Accepted View) */}
                  {activeView === 'accepted' && (
                    <div className="lg:col-span-2 relative flex flex-col justify-center">
                      <span className="lg:hidden text-neutral-400 font-semibold uppercase tracking-wider" style={{ fontSize: 11, marginBottom: 4 }}>
                        Valoración
                      </span>
                      
                      <div className="flex items-center gap-2">
                        {candidate.rating !== null ? (
                          <RatingBadge
                            rating={candidate.rating}
                            adminEmail={candidate.rating_admin_email}
                            ratingsCount={candidate.ratings?.length || (candidate.rating !== null ? 1 : 0)}
                            showAdmin={true}
                            interactive={true}
                            onClick={() => setRatingPopoverId(ratingPopoverId === candidate.id ? null : candidate.id)}
                          />
                        ) : (
                          <button
                            type="button"
                            onClick={() => setRatingPopoverId(ratingPopoverId === candidate.id ? null : candidate.id)}
                            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white/5 border border-dashed border-[#FF6B00]/60 text-neutral-300 hover:bg-[#FF6B00]/15 hover:border-[#FF6B00] hover:text-white transition-all text-xs font-semibold cursor-pointer"
                            title="Asignar valoración"
                          >
                            <Star size={13} className="text-[#FF6B00]" />
                            <span>+ Calificar</span>
                          </button>
                        )}
                      </div>

                      {/* Quick Rating Popover directly on card */}
                      <RatingQuickPopover
                        candidateId={candidate.id}
                        candidateName={candidate.full_name}
                        averageRating={candidate.rating}
                        ratings={candidate.ratings || []}
                        activeAdminEmail={user?.email}
                        isOpen={ratingPopoverId === candidate.id}
                        onClose={() => setRatingPopoverId(null)}
                        onSaveRating={async (newRating) => {
                          await updateRating(candidate.id, newRating, user?.email, user?.id);
                        }}
                      />
                    </div>
                  )}

                  {/* Column 6: Action Button */}
                  <div className="lg:col-span-2 flex items-center justify-start lg:justify-end" style={{ gap: 8, paddingTop: 0 }}>
                    {activeView === 'pending' && (
                      <button
                        onClick={() => openPendingModal(candidate)}
                        className="lg:w-auto bg-[#FF6B00] hover:bg-[#FF7A1A] text-white font-bold rounded-full shadow-lg shadow-orange-600/25 transition-all cursor-pointer hover:scale-105 active:scale-95 text-center"
                        style={{ padding: '12px 32px', fontSize: 15, whiteSpace: 'nowrap' }}
                      >
                        Ver perfil
                      </button>
                    )}

                    {activeView === 'accepted' && (
                      <button
                        onClick={() => openAcceptedModal(candidate)}
                        className="lg:w-auto bg-[#FF6B00] hover:bg-[#FF7A1A] text-white font-bold rounded-full shadow-lg shadow-orange-600/25 transition-all cursor-pointer hover:scale-105 active:scale-95 text-center"
                        style={{ padding: '12px 32px', fontSize: 15, whiteSpace: 'nowrap' }}
                      >
                        Ver perfil
                      </button>
                    )}

                    {activeView === 'rejected' && (
                      <div className="flex items-center w-full lg:w-auto" style={{ gap: 8 }}>
                        <button
                          onClick={() => openPendingModal(candidate)}
                          className="flex-1 lg:flex-none bg-[#FF6B00] hover:bg-[#FF7A1A] text-white font-bold rounded-full shadow-lg transition-all cursor-pointer"
                          style={{ padding: '10px 24px', fontSize: 14 }}
                        >
                          Ver perfil
                        </button>
                        <button
                          onClick={() => handleStatusChange(candidate.id, 'pending')}
                          className="flex-1 lg:flex-none bg-white/10 hover:bg-white/20 text-white font-semibold rounded-full transition-all cursor-pointer"
                          title="Restaurar a pendientes"
                          style={{ padding: '10px 20px', fontSize: 14 }}
                        >
                          Restaurar
                        </button>
                      </div>
                    )}
                  </div>

                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Pending / Contact Card Modal */}
      {selectedCandidate && (
        <Modal
          isOpen={showPendingModal}
          onClose={() => setShowPendingModal(false)}
          title="Ficha del Candidato"
          size="lg"
        >
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            
            {/* Header / Avatar & Core info */}
            <div className="flex flex-col sm:flex-row items-center sm:items-start rounded-2xl bg-dark-700/30 border border-white/5" style={{ gap: 20, padding: 20 }}>
              <div className="flex-shrink-0 relative">
                {selectedCandidate.photo_url ? (
                  <img
                    src={selectedCandidate.photo_url}
                    alt={selectedCandidate.full_name}
                    className="rounded-full object-cover border-2 border-orange-500 shadow-xl shadow-orange-500/20"
                    style={{ width: 96, height: 96 }}
                  />
                ) : (
                  <div className="rounded-full bg-orange-500/10 border-2 border-orange-500 flex items-center justify-center font-bold text-orange-400" style={{ width: 96, height: 96, fontSize: 28 }}>
                    {selectedCandidate.full_name.charAt(0)}
                  </div>
                )}
              </div>
              
              <div className="flex-1 text-center sm:text-left">
                <h3 className="font-bold text-white tracking-tight" style={{ fontSize: 22 }}>{selectedCandidate.full_name}</h3>
                <p className="text-dark-300 flex items-center justify-center sm:justify-start" style={{ fontSize: 12, marginTop: 6, gap: 6 }}>
                  <Calendar size={13} className="text-orange-500" />
                  Postulado el {formatDate(selectedCandidate.created_at)}
                </p>

                <div className="flex flex-wrap justify-center sm:justify-start" style={{ gap: 6, marginTop: 12 }}>
                  {selectedCandidate.roles.map(r => (
                    <Badge key={r} variant="orange" size="md">{r}</Badge>
                  ))}
                </div>
              </div>
            </div>

            {/* Contact details Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2" style={{ gap: 12 }}>
              <a
                href={`mailto:${selectedCandidate.email}`}
                className="flex items-center rounded-2xl bg-dark-700/40 border border-white/10 hover:border-orange-500/50 transition-colors group"
                style={{ gap: 12, padding: 14 }}
              >
                <div className="rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors" style={{ width: 36, height: 36, flexShrink: 0 }}>
                  <Mail size={16} />
                </div>
                <div className="truncate text-dark-100 group-hover:text-white transition-colors font-medium" style={{ fontSize: 13 }}>
                  {selectedCandidate.email}
                </div>
              </a>

              <a
                href={`tel:${selectedCandidate.phone}`}
                className="flex items-center rounded-2xl bg-dark-700/40 border border-white/10 hover:border-orange-500/50 transition-colors group"
                style={{ gap: 12, padding: 14 }}
              >
                <div className="rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors" style={{ width: 36, height: 36, flexShrink: 0 }}>
                  <Phone size={16} />
                </div>
                <div className="truncate text-dark-100 group-hover:text-white transition-colors font-medium" style={{ fontSize: 13 }}>
                  {selectedCandidate.phone}
                </div>
              </a>

              {selectedCandidate.portfolio_url && (
                <a
                  href={selectedCandidate.portfolio_url}
                  target="_blank"
                  rel="noreferrer"
                  className="sm:col-span-2 flex items-center rounded-2xl bg-dark-700/40 border border-white/10 hover:border-orange-500/50 transition-colors group"
                  style={{ gap: 12, padding: 14 }}
                >
                  <div className="rounded-full bg-orange-500/10 flex items-center justify-center text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-colors" style={{ width: 36, height: 36, flexShrink: 0 }}>
                    <ExternalLink size={16} />
                  </div>
                  <div className="truncate text-orange-400 group-hover:text-orange-300 font-medium" style={{ fontSize: 13 }}>
                    {selectedCandidate.portfolio_url}
                  </div>
                </a>
              )}
            </div>

            {/* Experience & Work history */}
            <div className="rounded-2xl bg-dark-700/30 border border-white/5" style={{ padding: 20 }}>
              <div className="flex items-center justify-between" style={{ marginBottom: 12 }}>
                <div className="uppercase tracking-wider text-dark-300 font-semibold flex items-center" style={{ fontSize: 12, gap: 6 }}>
                  <Briefcase size={14} className="text-orange-500" />
                  Experiencia Laboral
                </div>
                <span className="font-bold text-orange-400 bg-orange-500/10 border border-orange-500/30 rounded-full" style={{ fontSize: 12, padding: '4px 12px' }}>
                  {selectedCandidate.experience_years} años de exp.
                </span>
              </div>
              
              <div className="bg-dark-900/80 rounded-2xl text-dark-100 border border-orange-500/30 leading-relaxed" style={{ padding: 16, fontSize: 13, whiteSpace: 'pre-line' }}>
                {selectedCandidate.work_history || 'Sin historial de trabajo proporcionado.'}
              </div>
            </div>

            {/* Action buttons footer */}
            <div className="flex flex-wrap items-center justify-end border-t border-white/10" style={{ gap: 12, paddingTop: 16, paddingBottom: 8 }}>
              <button
                type="button"
                className="rounded-full font-semibold bg-red-500/10 text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-all cursor-pointer"
                style={{ padding: '12px 24px', fontSize: 13 }}
                onClick={() => handleStatusChange(selectedCandidate.id, 'rejected')}
              >
                Rechazar
              </button>
              
              <button
                type="button"
                className="rounded-full font-bold bg-emerald-500 hover:bg-emerald-600 text-white shadow-lg shadow-emerald-500/25 transition-all cursor-pointer"
                style={{ padding: '12px 24px', fontSize: 13 }}
                onClick={() => handleStatusChange(selectedCandidate.id, 'accepted')}
              >
                Aceptar
              </button>

              <button
                type="button"
                className="rounded-full font-bold bg-orange-500 hover:bg-orange-600 text-white shadow-xl shadow-orange-500/25 transition-all cursor-pointer"
                style={{ padding: '12px 24px', fontSize: 13 }}
                onClick={() => {
                  const subject = encodeURIComponent(`Entrevista Joy Agency - ${selectedCandidate.full_name}`);
                  const body = encodeURIComponent(`Hola ${selectedCandidate.full_name.split(' ')[0]},\n\nQueremos coordinar una entrevista con vos para conocerte mejor y sumarte a la red de talentos de Joy Agency.\n\n¡Saludos!`);
                  window.open(`https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(selectedCandidate.email)}&su=${subject}&body=${body}`, '_blank');
                }}
              >
                Concretar entrevista
              </button>
            </div>
          </div>
        </Modal>
      )}

      {/* Accepted Modal */}
      {selectedCandidate && user && (
        <AcceptedModalContent 
          candidate={selectedCandidate}
          isOpen={showAcceptedModal}
          onClose={() => setShowAcceptedModal(false)}
          updateRating={updateRating}
          getRatings={getRatings}
          getProjects={getProjects}
          addProject={addProject}
          getNotes={getNotes}
          addNote={addNote}
          user={user}
        />
      )}
    </AdminLayout>
  );
}

// Subcomponent to manage Accepted Modal state cleanly
function AcceptedModalContent({ candidate, isOpen, onClose, updateRating, getRatings, getProjects, addProject, getNotes, addNote, user }: any) {
  const [projects, setProjects] = useState<CandidateProject[]>([]);
  const [notes, setNotes] = useState<CandidateNote[]>([]);
  const [candidateRatings, setCandidateRatings] = useState<CandidateRating[]>(candidate.ratings || []);
  const [newProject, setNewProject] = useState('');
  const [newNote, setNewNote] = useState('');
  const [loadingProjects, setLoadingProjects] = useState(false);
  const [loadingNotes, setLoadingNotes] = useState(false);

  // Find current admin rating
  const myRating = candidateRatings.find(
    r => r.admin_email && user.email && r.admin_email.toLowerCase() === user.email.toLowerCase()
  )?.rating ?? null;

  // Compute average
  const avgRating = candidateRatings.length > 0
    ? Math.round((candidateRatings.reduce((t, r) => t + r.rating, 0) / candidateRatings.length) * 10) / 10
    : candidate.rating;

  useEffect(() => {
    if (isOpen) {
      loadData();
      setCandidateRatings(candidate.ratings || []);
    }
  }, [isOpen, candidate.id]);

  const loadData = async () => {
    setLoadingProjects(true);
    setLoadingNotes(true);
    const [projRes, noteRes, ratingRes] = await Promise.all([
      getProjects(candidate.id),
      getNotes(candidate.id),
      getRatings ? getRatings(candidate.id) : Promise.resolve({ data: [] })
    ]);
    setProjects(projRes.data);
    setNotes(noteRes.data);
    if (ratingRes && ratingRes.data) {
      setCandidateRatings(ratingRes.data);
    }
    setLoadingProjects(false);
    setLoadingNotes(false);
  };

  const handleRatingChange = async (val: number | null) => {
    await updateRating(candidate.id, val, user.email, user.id);
    if (getRatings) {
      const ratingRes = await getRatings(candidate.id);
      if (ratingRes.data) {
        setCandidateRatings(ratingRes.data);
      }
    }
  };

  const handleAddProject = async () => {
    if (!newProject.trim()) return;
    const res = await addProject(candidate.id, newProject, user.id);
    if (!res.error && res.data) {
      setProjects([res.data, ...projects]);
      setNewProject('');
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;
    const res = await addNote(candidate.id, user.id, user.email, newNote);
    if (!res.error && res.data) {
      setNotes([res.data, ...notes]);
      setNewNote('');
    }
  };

  const formatDate = (isoString: string) => new Date(isoString).toLocaleDateString('es-AR');

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`Perfil: ${candidate.full_name}`} size="xl">
      <div
        className="grid grid-cols-1 lg:grid-cols-3"
        style={{ gap: 32 }}
      >
        
        {/* Left Column: Basic Info & Rating */}
        <div className="lg:col-span-1" style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
          <div className="flex items-center rounded-2xl bg-dark-700/30 border border-white/5" style={{ gap: 16, padding: 14 }}>
            {candidate.photo_url ? (
              <img src={candidate.photo_url} alt={candidate.full_name} className="rounded-full object-cover border-2 border-orange-500 shadow-md shadow-orange-500/20" style={{ width: 64, height: 64 }} />
            ) : (
              <div className="rounded-full bg-orange-500/10 border-2 border-orange-500 flex items-center justify-center font-bold text-orange-400" style={{ width: 64, height: 64, fontSize: 20 }}>
                {candidate.full_name.charAt(0)}
              </div>
            )}
            <div>
              <h3 className="font-bold text-white" style={{ fontSize: 16 }}>{candidate.full_name}</h3>
              <div className="text-orange-400" style={{ fontSize: 12, marginTop: 2 }}>{candidate.experience_years} años de exp.</div>
            </div>
          </div>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            <div className="uppercase tracking-wider text-dark-300 font-semibold" style={{ fontSize: 12 }}>Contacto</div>
            <div className="rounded-2xl bg-dark-700/40 border border-white/10 text-dark-100 flex items-center" style={{ padding: 12, fontSize: 12, gap: 10 }}>
              <Mail size={15} className="text-orange-500" style={{ flexShrink: 0 }} />
              <span className="truncate">{candidate.email}</span>
            </div>
            <div className="rounded-2xl bg-dark-700/40 border border-white/10 text-dark-100 flex items-center" style={{ padding: 12, fontSize: 12, gap: 10 }}>
              <Phone size={15} className="text-orange-500" style={{ flexShrink: 0 }} />
              <span>{candidate.phone}</span>
            </div>
            {candidate.portfolio_url && (
              <a
                href={candidate.portfolio_url}
                target="_blank"
                rel="noreferrer"
                className="rounded-2xl bg-dark-700/40 border border-white/10 text-orange-400 flex items-center hover:border-orange-500/50 transition-colors"
                style={{ padding: 12, fontSize: 12, gap: 10 }}
              >
                <ExternalLink size={15} className="text-orange-500" style={{ flexShrink: 0 }} />
                <span className="truncate">Ver Portfolio</span>
              </a>
            )}
          </div>
          
          {/* Valoración Card with Average, Active User Selector, and Multi-admin breakdown */}
          <div className="rounded-2xl bg-dark-700/30 border border-white/5" style={{ padding: 16 }}>
            <div className="flex items-center justify-between mb-3 pb-2.5 border-b border-white/5">
              <div>
                <span className="text-[11px] uppercase tracking-wider text-dark-300 font-bold block">Promedio</span>
                <div className="flex items-baseline gap-1 mt-0.5">
                  <span className="text-xl font-bold text-white">
                    {avgRating !== null ? avgRating : '-'}
                  </span>
                  {avgRating !== null && <span className="text-xs text-dark-300 font-semibold">/10</span>}
                </div>
              </div>
              <span className="text-xs text-dark-300 font-medium">
                {candidateRatings.length} {candidateRatings.length === 1 ? 'administrador' : 'administradores'}
              </span>
            </div>

            {/* Current user rating selector */}
            <div className="mb-3">
              <RatingSelector
                value={myRating}
                adminEmail={user.email}
                label="Tu calificación"
                onChange={(val) => handleRatingChange(val)}
                onRemove={myRating !== null ? () => handleRatingChange(null) : undefined}
              />
            </div>

            {/* Breakdown of other/all admin ratings */}
            {candidateRatings.length > 0 && (
              <div className="border-t border-white/5 pt-3">
                <span className="text-[11px] uppercase tracking-wider text-dark-300 font-bold block mb-2">
                  Votos de administradores
                </span>
                <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                  {candidateRatings.map(r => {
                    const isMe = user.email && r.admin_email.toLowerCase() === user.email.toLowerCase();
                    return (
                      <div
                        key={r.id || r.admin_email}
                        className={`flex items-center justify-between p-2 rounded-xl text-xs ${
                          isMe ? 'bg-[#FF6B00]/10 border border-[#FF6B00]/30' : 'bg-dark-900/60 border border-white/5'
                        }`}
                      >
                        <div className="min-w-0 pr-2">
                          <p className="font-bold text-white truncate flex items-center gap-1">
                            <span>{formatAdminName(r.admin_email)}</span>
                            {isMe && (
                              <span className="text-[10px] bg-[#FF6B00] text-white px-1.5 py-0.2 rounded-full font-bold">
                                Tú
                              </span>
                            )}
                          </p>
                          <p className="text-[10px] text-dark-300 truncate">{r.admin_email}</p>
                        </div>
                        <span className="font-bold text-orange-400 bg-orange-500/15 border border-orange-500/30 px-2 py-0.5 rounded-lg flex-shrink-0">
                          {r.rating}/10
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Right Column: Projects & Notes */}
        <div className="lg:col-span-2" style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          
          {/* Projects */}
          <div className="rounded-3xl bg-dark-700/30 border border-white/5" style={{ padding: 20 }}>
            <h4 className="font-bold text-white uppercase tracking-wider flex items-center" style={{ fontSize: 13, gap: 8, marginBottom: 16 }}>
              <Briefcase size={16} className="text-orange-500" />
              Proyectos trabajados
            </h4>
            
            <div className="flex" style={{ gap: 8, marginBottom: 16 }}>
              <input
                type="text"
                placeholder="Nombre del proyecto..."
                className="flex-1 bg-transparent border border-orange-500 rounded-full text-white placeholder-dark-300 outline-none focus:outline-none focus:ring-0"
                style={{ padding: '10px 16px', fontSize: 13 }}
                value={newProject}
                onChange={e => setNewProject(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleAddProject()}
              />
              <Button onClick={handleAddProject} size="sm" className="rounded-full shadow-md shadow-orange-500/20" style={{ padding: '10px 20px', fontSize: 12, fontWeight: 700 }}>
                <Plus size={14} style={{ marginRight: 4 }} />
                Agregar
              </Button>
            </div>
            
            {loadingProjects ? <Spinner size="sm" /> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {projects.map(p => (
                  <div key={p.id} className="bg-dark-900/70 border border-white/10 rounded-2xl flex justify-between items-center" style={{ padding: 14 }}>
                    <span className="text-white font-medium" style={{ fontSize: 13 }}>{p.project_name}</span>
                    <span className="text-dark-300" style={{ fontSize: 11 }}>{formatDate(p.created_at)}</span>
                  </div>
                ))}
                {projects.length === 0 && <p className="text-dark-300 italic" style={{ fontSize: 12, padding: '8px 0' }}>No hay proyectos registrados.</p>}
              </div>
            )}
          </div>
          
          {/* Notes */}
          <div className="rounded-3xl bg-dark-700/30 border border-white/5" style={{ padding: 20 }}>
            <h4 className="font-bold text-white uppercase tracking-wider" style={{ fontSize: 13, marginBottom: 16 }}>
              Observaciones & Notas internas
            </h4>
            
            <div>
              <textarea
                placeholder="Agregar una nota..."
                className="w-full bg-transparent border border-orange-500 rounded-2xl text-white placeholder-dark-300 outline-none focus:outline-none focus:ring-0 resize-y"
                style={{ padding: 14, fontSize: 13, minHeight: 85, marginBottom: 12 }}
                value={newNote}
                onChange={e => setNewNote(e.target.value)}
              />
              <div className="flex justify-end">
                <Button onClick={handleAddNote} size="sm" className="rounded-full shadow-md shadow-orange-500/20" style={{ padding: '8px 20px', fontSize: 12, fontWeight: 700 }}>
                  Guardar nota
                </Button>
              </div>
            </div>
            
            {loadingNotes ? <Spinner size="sm" /> : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginTop: 12 }}>
                {notes.map(n => (
                  <div key={n.id} className="bg-dark-900/70 border border-white/10 rounded-2xl" style={{ padding: 16 }}>
                    <p className="text-dark-100 leading-relaxed" style={{ fontSize: 13, whiteSpace: 'pre-line', marginBottom: 12 }}>{n.note}</p>
                    <div className="flex justify-between items-center text-dark-300 border-t border-white/5" style={{ fontSize: 11, paddingTop: 8 }}>
                      <span className="text-orange-400 font-medium">{n.admin_email}</span>
                      <span>{formatDate(n.created_at)}</span>
                    </div>
                  </div>
                ))}
                {notes.length === 0 && <p className="text-dark-300 italic" style={{ fontSize: 12, padding: '8px 0' }}>No hay notas registradas.</p>}
              </div>
            )}
          </div>
          
        </div>
      </div>
    </Modal>
  );
}
