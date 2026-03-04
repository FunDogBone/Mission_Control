export type Industry = 'hvac' | 'plumber' | 'roofer' | 'electrician' | 'auto' | 'pest' | 'landscaping';

export type Stage = 'lead' | 'contacted' | 'discovery' | 'proposal' | 'closed' | 'lost';

export interface Prospect {
  id: number | string;
  businessName: string;
  industry: Industry;
  city: string;
  state?: string;
  phone?: string;
  website?: string;
  stage: Stage;
  notes?: string;
  nextAction?: string;
  googleReviews?: number;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ProspectFormData {
  businessName: string;
  industry: Industry;
  city: string;
  state?: string;
  phone?: string;
  website?: string;
  stage: Stage;
  notes: string;
}

export interface AddProspectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (formData: ProspectFormData) => Promise<void> | void;
}

export const INDUSTRIES: { value: Industry; label: string; emoji: string }[] = [
  { value: 'hvac', label: 'HVAC', emoji: '❄️' },
  { value: 'plumber', label: 'Plumber', emoji: '🔧' },
  { value: 'roofer', label: 'Roofer', emoji: '🏠' },
  { value: 'electrician', label: 'Electrician', emoji: '⚡' },
  { value: 'auto', label: 'Auto Repair', emoji: '🚗' },
  { value: 'pest', label: 'Pest Control', emoji: '🐛' },
  { value: 'landscaping', label: 'Landscaping', emoji: '🌳' },
];

export const STAGES: { value: Stage; label: string; color: string }[] = [
  { value: 'lead', label: 'Lead', color: 'purple' },
  { value: 'contacted', label: 'Contacted', color: 'cyan' },
  { value: 'discovery', label: 'Discovery', color: 'pink' },
  { value: 'proposal', label: 'Proposal', color: 'yellow' },
  { value: 'closed', label: 'Closed', color: 'green' },
];

export const STAGE_CONFIG: Record<Stage, { label: string; bgColor: string; borderColor: string; textColor: string; emoji: string }> = {
  lead:      { label: 'Lead',      bgColor: 'bg-purple-900/30', borderColor: 'border-purple-500/50', textColor: 'text-purple-300', emoji: '🎯' },
  contacted: { label: 'Contacted', bgColor: 'bg-cyan-900/30',   borderColor: 'border-cyan-500/50',   textColor: 'text-cyan-300',   emoji: '📞' },
  discovery: { label: 'Discovery', bgColor: 'bg-pink-900/30',   borderColor: 'border-pink-500/50',   textColor: 'text-pink-300',   emoji: '🔍' },
  proposal:  { label: 'Proposal',  bgColor: 'bg-yellow-900/30', borderColor: 'border-yellow-500/50', textColor: 'text-yellow-300', emoji: '📋' },
  closed:    { label: 'Closed',    bgColor: 'bg-green-900/30',  borderColor: 'border-green-500/50',  textColor: 'text-green-300',  emoji: '✅' },
  lost:      { label: 'Lost',      bgColor: 'bg-red-900/30',    borderColor: 'border-red-500/50',    textColor: 'text-red-300',    emoji: '❌' },
};

export type StageCounts = Record<Stage, number>;

export const INDUSTRY_EMOJI: Record<Industry, string> = {
  hvac: '❄️',
  plumber: '🔧',
  roofer: '🏠',
  electrician: '⚡',
  auto: '🚗',
  pest: '🐛',
  landscaping: '🌳',
};

export interface PipelineData {
  prospects: Prospect[];
  stageCounts: StageCounts;
  lastUpdated?: string;
}
