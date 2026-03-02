'use client';

import React from 'react';
import type { Prospect } from '@/types/pipeline';

const mockProspects: Prospect[] = [
  { id: 1, businessName: 'Cool HVAC', city: 'Atlanta', state: 'GA', industry: 'hvac', phone: '(404) 555-1234', website: '', stage: 'lead', notes: '', createdAt: new Date(), updatedAt: new Date() },
  { id: 2, businessName: 'Plumber Pete', city: 'Atlanta', state: 'GA', industry: 'plumber', phone: '(404) 555-5678', website: '', stage: 'contacted', notes: '', createdAt: new Date(), updatedAt: new Date() },
  { id: 3, businessName: 'Roofing Rock', city: 'Atlanta', state: 'GA', industry: 'roofer', phone: '(404) 555-9101', website: '', stage: 'discovery', notes: '', createdAt: new Date(), updatedAt: new Date() },
  { id: 4, businessName: 'Electric Elvis', city: 'Atlanta', state: 'GA', industry: 'electrician', phone: '(404) 555-2345', website: '', stage: 'proposal', notes: '', createdAt: new Date(), updatedAt: new Date() },
  { id: 5, businessName: 'Lawn Master Larry', city: 'Atlanta', state: 'GA', industry: 'landscaping', phone: '(404) 555-6789', website: '', stage: 'closed', notes: '', createdAt: new Date(), updatedAt: new Date() },
];

const INDUSTRY_EMOJI: Record<string, string> = {
  hvac: '❄️',
  plumber: '🔧',
  roofer: '🏠',
  electrician: '⚡',
  auto: '🚗',
  pest: '🐛',
  landscaping: '🌳',
};

interface Column {
  title: string;
  stage: string;
  bgClass: string;
}

const columns: Column[] = [
  { title: 'Lead', stage: 'lead', bgClass: 'bg-purple-700' },
  { title: 'Contacted', stage: 'contacted', bgClass: 'bg-cyan-700' },
  { title: 'Discovery', stage: 'discovery', bgClass: 'bg-pink-700' },
  { title: 'Proposal', stage: 'proposal', bgClass: 'bg-yellow-700' },
  { title: 'Closed', stage: 'closed', bgClass: 'bg-green-700' },
];

const PipelineKanban: React.FC = () => {
  return (
    <div className='bg-gray-900 p-4 flex space-x-4 overflow-x-auto'>
      {columns.map((column) => {
        const columnProspects = mockProspects.filter(p => p.stage === column.stage);
        return (
          <div key={column.title} className={`flex-shrink-0 w-80 ${column.bgClass} text-white p-4 rounded-lg`}>
            <h2 className='text-xl font-bold mb-2'>{column.title}</h2>
            <p className='text-sm opacity-80'>{columnProspects.length} prospects</p>

            <ul className='mt-4 space-y-2'>
              {columnProspects.map((prospect) => (
                <li key={prospect.id} className='bg-gray-800 p-3 rounded-lg'>
                  <div className='flex items-center gap-2'>
                    <span>{INDUSTRY_EMOJI[prospect.industry] || '🏢'}</span>
                    <strong>{prospect.businessName}</strong>
                  </div>
                  <div className='text-sm mt-1 text-gray-300'>
                    {prospect.city}, {prospect.state}
                  </div>
                  <div className='text-sm text-gray-400'>{prospect.phone}</div>
                </li>
              ))}
              {columnProspects.length === 0 && (
                <li className='text-sm text-gray-400 italic'>No prospects</li>
              )}
            </ul>
          </div>
        );
      })}
    </div>
  );
};

export default PipelineKanban;
