'use client';

import { Prospect, Stage } from '@/types/pipeline';
import { ProspectRow } from './ProspectRow';

interface RecentProspectsTableProps {
  prospects: Prospect[];
  onStageChange: (prospectId: string, newStage: Stage) => void;
  onAddNote: (prospectId: string, note: string) => void;
  maxRows?: number;
}

export function RecentProspectsTable({
  prospects,
  onStageChange,
  onAddNote,
  maxRows = 10,
}: RecentProspectsTableProps) {
  // Sort by updatedAt descending and take maxRows
  const sortedProspects = [...prospects]
    .sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
    .slice(0, maxRows);

  if (sortedProspects.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        <div className="text-4xl mb-2">📋</div>
        <div>No prospects yet</div>
        <div className="text-sm mt-1">Run prospect research or add manually</div>
      </div>
    );
  }

  return (
    <div className="divide-y divide-gray-700/30">
      <div className="flex items-center justify-between px-2 py-2 text-xs text-gray-500 uppercase tracking-wider">
        <span>Recent Prospects</span>
        <span>{prospects.length} total</span>
      </div>
      {sortedProspects.map(prospect => (
        <ProspectRow
          key={prospect.id}
          prospect={prospect}
          onStageChange={(newStage) => onStageChange(prospect.id, newStage)}
          onAddNote={(note) => onAddNote(prospect.id, note)}
        />
      ))}
    </div>
  );
}
