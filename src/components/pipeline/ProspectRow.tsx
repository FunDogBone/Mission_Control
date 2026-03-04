'use client';

import { useState } from 'react';
import { Prospect, Stage, STAGE_CONFIG, INDUSTRY_EMOJI } from '@/types/pipeline';

interface ProspectRowProps {
  prospect: Prospect;
  onStageChange: (newStage: Stage) => void;
  onAddNote: (note: string) => void;
}

const STAGES: Stage[] = ['lead', 'contacted', 'discovery', 'proposal', 'closed', 'lost'];

export function ProspectRow({ prospect, onStageChange, onAddNote }: ProspectRowProps) {
  const [showActions, setShowActions] = useState(false);
  const [showNoteInput, setShowNoteInput] = useState(false);
  const [noteText, setNoteText] = useState('');

  const stageConfig = STAGE_CONFIG[prospect.stage];
  const emoji = INDUSTRY_EMOJI[prospect.industry];

  const handleAddNote = () => {
    if (noteText.trim()) {
      onAddNote(noteText.trim());
      setNoteText('');
      setShowNoteInput(false);
    }
  };

  return (
    <div className="border-b border-gray-700/50 hover:bg-gray-800/30 transition-colors">
      <div className="flex items-center justify-between py-3 px-2">
        {/* Business Info */}
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <span className="text-xl flex-shrink-0">{emoji}</span>
          <div className="min-w-0">
            <div className="text-white font-medium truncate">{prospect.businessName}</div>
            <div className="text-gray-400 text-sm">
              {prospect.city}, {prospect.state} • {prospect.industry.toUpperCase()}
            </div>
          </div>
        </div>

        {/* Stage Badge */}
        <div className="flex items-center gap-3 flex-shrink-0">
          {prospect.nextAction && (
            <span className="text-gray-400 text-sm hidden md:inline">{prospect.nextAction}</span>
          )}
          <span className={`px-2 py-1 ${stageConfig.bgColor} ${stageConfig.textColor} text-xs rounded border ${stageConfig.borderColor}`}>
            {stageConfig.label}
          </span>
          
          {/* Actions Toggle */}
          <div className="relative">
            <button
              onClick={() => setShowActions(!showActions)}
              className="p-2 hover:bg-gray-700 rounded transition-colors text-gray-400 hover:text-white"
            >
              ⋮
            </button>

            {/* Dropdown */}
            {showActions && (
              <div className="absolute right-0 top-full mt-1 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10 min-w-[160px]">
                <div className="py-1">
                  <button
                    onClick={() => {
                      onStageChange('contacted');
                      setShowActions(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                  >
                    ✓ Mark Called
                  </button>
                  <button
                    onClick={() => {
                      setShowNoteInput(true);
                      setShowActions(false);
                    }}
                    className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700 flex items-center gap-2"
                  >
                    📝 Add Note
                  </button>
                  <div className="border-t border-gray-700 my-1" />
                  <div className="px-4 py-1 text-xs text-gray-500 uppercase">Move to</div>
                  {STAGES.filter(s => s !== prospect.stage).map(stage => (
                    <button
                      key={stage}
                      onClick={() => {
                        onStageChange(stage);
                        setShowActions(false);
                      }}
                      className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-700"
                    >
                      {STAGE_CONFIG[stage].label}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Note Input */}
      {showNoteInput && (
        <div className="px-2 pb-3 flex gap-2">
          <input
            type="text"
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddNote()}
            placeholder="Add a note..."
            className="flex-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500"
            autoFocus
          />
          <button
            onClick={handleAddNote}
            className="px-3 py-2 bg-cyan-600 hover:bg-cyan-500 rounded text-sm font-medium transition-colors"
          >
            Save
          </button>
          <button
            onClick={() => setShowNoteInput(false)}
            className="px-3 py-2 bg-gray-700 hover:bg-gray-600 rounded text-sm transition-colors"
          >
            Cancel
          </button>
        </div>
      )}

      {/* Existing Notes */}
      {prospect.notes && (
        <div className="px-2 pb-3 pl-12">
          <div className="text-sm text-gray-400 bg-gray-800/50 rounded px-3 py-2">
            📝 {prospect.notes}
          </div>
        </div>
      )}
    </div>
  );
}
