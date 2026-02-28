export type Industry = 'hvac' | 'plumber' | 'roofer' | 'electrician' | 'auto' | 'pest' | 'landscaping';
export type Stage = 'lead' | 'contacted' | 'discovery' | 'proposal' | 'closed' | 'lost';

export interface Prospect {
  id: string;
  businessName: string;
  city: string;
  state: string;
  industry: Industry;
  phone?: string;
  website?: string;
  googleReviews?: number;
  stage: Stage;
  nextAction?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface StageCounts {
  lead: number;
  contacted: number;
  discovery: number;
  proposal: number;
  closed: number;
  lost: number;
}

export interface PipelineData {
  prospects: Prospect[];
  stageCounts: StageCounts;
  lastUpdated: string;
}

export const STAGE_CONFIG: Record<Stage, { label: string; color: string; bgColor: string; borderColor: string }> = {
  lead: {
    label: 'Lead',
    color: 'text-purple-300',
    bgColor: 'bg-purple-500/20',
    borderColor: 'border-purple-500/50',
  },
  contacted: {
    label: 'Contacted',
    color: 'text-cyan-300',
    bgColor: 'bg-cyan-500/20',
    borderColor: 'border-cyan-500/50',
  },
  discovery: {
    label: 'Discovery',
    color: 'text-pink-300',
    bgColor: 'bg-pink-500/20',
    borderColor: 'border-pink-500/50',
  },
  proposal: {
    label: 'Proposal',
    color: 'text-yellow-300',
    bgColor: 'bg-yellow-500/20',
    borderColor: 'border-yellow-500/50',
  },
  closed: {
    label: 'Closed',
    color: 'text-green-300',
    bgColor: 'bg-green-500/20',
    borderColor: 'border-green-500/50',
  },
  lost: {
    label: 'Lost',
    color: 'text-gray-400',
    bgColor: 'bg-gray-500/20',
    borderColor: 'border-gray-500/50',
  },
};

export const INDUSTRY_EMOJI: Record<Industry, string> = {
  hvac: '❄️',
  plumber: '🔧',
  roofer: '🏠',
  electrician: '⚡',
  auto: '🚗',
  pest: '🐛',
  landscaping: '🌳',
};
