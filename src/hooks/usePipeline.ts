import { useState, useEffect } from 'react';
import { PipelineData, Prospect, Stage, StageCounts } from '@/types/pipeline';

// Mock data for development - will be replaced with real API call
const MOCK_PROSPECTS: Prospect[] = [
  {
    id: '1',
    businessName: 'Reliable Heating & Air',
    city: 'Atlanta',
    state: 'GA',
    industry: 'hvac',
    phone: '(404) 555-0101',
    website: 'https://reliableair.com',
    googleReviews: 47,
    stage: 'lead',
    nextAction: 'Cold call',
    createdAt: '2026-02-28T12:00:00Z',
    updatedAt: '2026-02-28T12:00:00Z',
  },
  {
    id: '2',
    businessName: 'HVAC Guyz & Plumbing',
    city: 'Atlanta',
    state: 'GA',
    industry: 'hvac',
    phone: '(404) 555-0102',
    googleReviews: 32,
    stage: 'lead',
    nextAction: 'Cold call',
    createdAt: '2026-02-28T12:00:00Z',
    updatedAt: '2026-02-28T12:00:00Z',
  },
  {
    id: '3',
    businessName: 'Honor Air and Heat',
    city: 'Atlanta',
    state: 'GA',
    industry: 'hvac',
    website: 'https://honorairandheat.com',
    googleReviews: 28,
    stage: 'lead',
    nextAction: 'Cold call',
    createdAt: '2026-02-28T12:00:00Z',
    updatedAt: '2026-02-28T12:00:00Z',
  },
  {
    id: '4',
    businessName: 'Quick Fix Plumbing',
    city: 'Marietta',
    state: 'GA',
    industry: 'plumber',
    phone: '(770) 555-0201',
    googleReviews: 89,
    stage: 'contacted',
    nextAction: 'Follow up call',
    notes: 'Interested, asked to call back Monday',
    createdAt: '2026-02-27T10:00:00Z',
    updatedAt: '2026-02-28T09:00:00Z',
  },
  {
    id: '5',
    businessName: 'ATL Roofing Pros',
    city: 'Decatur',
    state: 'GA',
    industry: 'roofer',
    phone: '(404) 555-0301',
    website: 'https://atlroofingpros.com',
    googleReviews: 156,
    stage: 'discovery',
    nextAction: 'Demo scheduled Thu 3pm',
    createdAt: '2026-02-25T14:00:00Z',
    updatedAt: '2026-02-28T11:00:00Z',
  },
];

function calculateStageCounts(prospects: Prospect[]): StageCounts {
  return prospects.reduce(
    (acc, prospect) => {
      acc[prospect.stage]++;
      return acc;
    },
    { lead: 0, contacted: 0, discovery: 0, proposal: 0, closed: 0, lost: 0 }
  );
}

export function usePipeline() {
  const [data, setData] = useState<PipelineData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    // Simulate API call
    const loadData = async () => {
      try {
        // TODO: Replace with real API call
        // const response = await fetch('/api/pipeline');
        // const data = await response.json();
        
        await new Promise(resolve => setTimeout(resolve, 500)); // Simulate network delay
        
        setData({
          prospects: MOCK_PROSPECTS,
          stageCounts: calculateStageCounts(MOCK_PROSPECTS),
          lastUpdated: new Date().toISOString(),
        });
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to load pipeline data'));
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const updateProspectStage = async (prospectId: string, newStage: Stage) => {
    if (!data) return;

    // Optimistic update
    const updatedProspects = data.prospects.map(p =>
      p.id === prospectId ? { ...p, stage: newStage, updatedAt: new Date().toISOString() } : p
    );

    setData({
      ...data,
      prospects: updatedProspects,
      stageCounts: calculateStageCounts(updatedProspects),
      lastUpdated: new Date().toISOString(),
    });

    // TODO: API call to persist change
    // await fetch(`/api/prospects/${prospectId}`, { method: 'PATCH', body: JSON.stringify({ stage: newStage }) });
  };

  const addNote = async (prospectId: string, note: string) => {
    if (!data) return;

    const updatedProspects = data.prospects.map(p =>
      p.id === prospectId
        ? { ...p, notes: p.notes ? `${p.notes}\n${note}` : note, updatedAt: new Date().toISOString() }
        : p
    );

    setData({
      ...data,
      prospects: updatedProspects,
      lastUpdated: new Date().toISOString(),
    });

    // TODO: API call to persist change
  };

  return {
    data,
    loading,
    error,
    updateProspectStage,
    addNote,
  };
}
