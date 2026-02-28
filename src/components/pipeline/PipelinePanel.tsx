'use client';

import { useState } from 'react';
import { usePipeline } from '@/hooks/usePipeline';
import { PipelineStages } from './PipelineStages';
import { RecentProspectsTable } from './RecentProspectsTable';
import { Stage } from '@/types/pipeline';

interface PipelinePanelProps {
  initialExpanded?: boolean;
}

export function PipelinePanel({ initialExpanded = false }: PipelinePanelProps) {
  const [expanded, setExpanded] = useState(initialExpanded);
  const [filterStage, setFilterStage] = useState<Stage | null>(null);
  const { data, loading, error, updateProspectStage, addNote } = usePipeline();

  if (loading) {
    return (
      <div className="bg-gray-900/50 border border-purple-500/30 rounded-lg p-4 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <div className="animate-pulse bg-gray-700 h-6 w-32 rounded" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-gray-900/50 border border-red-500/30 rounded-lg p-4 backdrop-blur-sm">
        <div className="text-red-400">Failed to load pipeline data</div>
      </div>
    );
  }

  if (!data) return null;

  const totalLeads = Object.values(data.stageCounts).reduce((a, b) => a + b, 0);
  const filteredProspects = filterStage
    ? data.prospects.filter(p => p.stage === filterStage)
    : data.prospects;

  const handleStageClick = (stage: Stage) => {
    setFilterStage(filterStage === stage ? null : stage);
  };

  return (
    <div className="bg-gray-900/50 border border-purple-500/30 rounded-lg backdrop-blur-sm overflow-hidden">
      {/* Header - Always Visible */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between p-4 hover:bg-gray-800/30 transition-colors"
      >
        <div className="flex items-center gap-3">
          <span className="text-xl">📊</span>
          <span className="text-white font-medium">Sales Pipeline</span>
          <span className="text-gray-400 text-sm">({totalLeads} prospects)</span>
        </div>
        <svg
          className={`w-5 h-5 text-gray-400 transition-transform duration-200 ${expanded ? 'rotate-180' : ''}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {/* Expandable Content */}
      <div
        className={`transition-all duration-300 ease-in-out ${
          expanded ? 'max-h-[600px] opacity-100' : 'max-h-0 opacity-0'
        } overflow-hidden`}
      >
        <div className="px-4 pb-4 space-y-4">
          {/* Stage Summary */}
          <PipelineStages
            stageCounts={data.stageCounts}
            activeStage={filterStage}
            onStageClick={handleStageClick}
          />

          {/* Filter indicator */}
          {filterStage && (
            <div className="flex items-center gap-2 text-sm">
              <span className="text-gray-400">Showing:</span>
              <span className="text-cyan-400">{filterStage}</span>
              <button
                onClick={() => setFilterStage(null)}
                className="text-gray-500 hover:text-white ml-1"
              >
                ✕
              </button>
            </div>
          )}

          {/* Prospects Table */}
          <RecentProspectsTable
            prospects={filteredProspects}
            onStageChange={updateProspectStage}
            onAddNote={addNote}
          />

          {/* Last Updated */}
          <div className="text-xs text-gray-500 text-right">
            Updated: {new Date(data.lastUpdated).toLocaleString()}
          </div>
        </div>
      </div>
    </div>
  );
}
