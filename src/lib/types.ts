export type CandidateStatus = 'pending' | 'accepted' | 'rejected'

export type CandidateRole = 
  | 'Director de Arte'
  | 'Diseñador gráfico'
  | 'Edición de video'
  | 'Redactor'

export const CANDIDATE_ROLES: CandidateRole[] = [
  'Director de Arte',
  'Diseñador gráfico',
  'Edición de video',
  'Redactor',
]

export interface CandidateRating {
  id: string
  candidate_id: string
  admin_id?: string | null
  admin_email: string
  rating: number
  created_at: string
}

export interface Candidate {
  id: string
  full_name: string
  email: string
  phone: string
  photo_url: string
  roles: CandidateRole[]
  experience_years: number
  work_history: string
  portfolio_url: string
  status: CandidateStatus
  rating: number | null
  rating_admin_email?: string | null
  rating_admin_id?: string | null
  ratings?: CandidateRating[]
  created_at: string
}

export interface CandidateProject {
  id: string
  candidate_id: string
  project_name: string
  admin_id: string
  created_at: string
}

export interface CandidateNote {
  id: string
  candidate_id: string
  admin_id: string
  admin_email: string
  note: string
  created_at: string
}

export interface CandidateInsert {
  full_name: string
  email: string
  phone: string
  photo_url: string
  roles: string[]
  experience_years: number
  work_history: string
  portfolio_url: string
}

export const formatAdminName = (emailOrName?: string | null): string => {
  if (!emailOrName) return 'Admin';
  if (emailOrName.includes('@')) {
    const userPart = emailOrName.split('@')[0];
    return userPart
      .split(/[._-]/)
      .map(s => s.charAt(0).toUpperCase() + s.slice(1).toLowerCase())
      .join(' ');
  }
  return emailOrName;
};

