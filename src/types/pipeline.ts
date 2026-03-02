export type Industry = 'hvac' | 'plumber' | 'roofer' | 'electrician' | 'auto' | 'pest' | 'landscaping';

export type Stage = 'lead' | 'contacted' | 'discovery' | 'proposal' | 'closed';

export interface Prospect {
  id: number;
  businessName: string;
  industry: Industry;
  city: string;
  state: string;
  phone: string;
  website: string;
  stage: Stage;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProspectFormData {
  businessName: string;
  industry: Industry;
  city: string;
  state: string;
  phone: string;
  website: string;
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
