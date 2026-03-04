'use client';

import { Stage, STAGE_CONFIG } from '@/types/pipeline';

interface StageSummaryProps {
  stage: Stage;
  count: number;
  isActive?: boolean;
  onClick?: () => void;
}

export function StageSummary({ stage, count, isActive = false, onClick }: StageSummaryProps) {
  const config = STAGE_CONFIG[stage];

  return (
    <button
      onClick={onClick}
      className={`
        ${config.bgColor} ${config.borderColor} border rounded-lg px-4 py-3 text-center
        transition-all duration-200 hover:scale-105 hover:border-opacity-100
        ${isActive ? 'ring-2 ring-white/30' : ''}
        ${onClick ? 'cursor-pointer' : 'cursor-default'}
      `}
    >
      <div className={`text-xs uppercase tracking-wider ${config.textColor} opacity-80`}>
        {config.label}
      </div>
      <div className={`text-2xl font-bold ${config.textColor}`}>
        {count}
      </div>
    </button>
  );
}
