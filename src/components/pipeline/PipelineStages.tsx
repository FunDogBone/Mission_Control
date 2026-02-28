'use client';

import { StageCounts, Stage } from '@/types/pipeline';
import { StageSummary } from './StageSummary';

interface PipelineStagesProps {
  stageCounts: StageCounts;
  activeStage?: Stage | null;
  onStageClick?: (stage: Stage) => void;
}

const STAGE_ORDER: Stage[] = ['lead', 'contacted', 'discovery', 'proposal', 'closed'];

export function PipelineStages({ stageCounts, activeStage, onStageClick }: PipelineStagesProps) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto pb-2">
      {STAGE_ORDER.map((stage, index) => (
        <div key={stage} className="flex items-center">
          <StageSummary
            stage={stage}
            count={stageCounts[stage]}
            isActive={activeStage === stage}
            onClick={onStageClick ? () => onStageClick(stage) : undefined}
          />
          {index < STAGE_ORDER.length - 1 && (
            <div className="mx-2 text-gray-600">→</div>
          )}
        </div>
      ))}
    </div>
  );
}
