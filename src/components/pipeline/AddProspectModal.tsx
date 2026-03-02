'use client';

import React, { useState } from 'react';
import type { ProspectFormData, AddProspectModalProps } from '@/types/pipeline';
import { INDUSTRIES, STAGES } from '@/types/pipeline';

const STATES = ['GA', 'FL', 'NC', 'SC', 'TN', 'AL', 'TX', 'AZ', 'CO', 'CA'];

interface FormErrors {
  [key: string]: string | undefined;
}

const AddProspectModal: React.FC<AddProspectModalProps> = ({ isOpen, onClose, onSave }) => {
  const [formData, setFormData] = useState<ProspectFormData>({
    businessName: '',
    industry: 'hvac',
    city: '',
    state: 'GA',
    phone: '',
    website: '',
    stage: 'lead',
    notes: '',
  });
  const [errors, setErrors] = useState<FormErrors>({});

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.businessName.trim()) {
      newErrors.businessName = 'Business name is required';
    }
    if (!formData.city.trim()) {
      newErrors.city = 'City is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: undefined }));
    }
  };

  const handleSubmit = () => {
    if (validateForm()) {
      onSave(formData);
      onClose();
      setFormData({
        businessName: '',
        industry: 'hvac',
        city: '',
        state: 'GA',
        phone: '',
        website: '',
        stage: 'lead',
        notes: '',
      });
      setErrors({});
    }
  };

  if (!isOpen) return null;

  return (
    <div className='fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm'>
      <div className='bg-gray-900 border border-purple-500/50 rounded-lg w-full max-w-lg mx-4 shadow-2xl'>
        <div className='flex items-center justify-between p-4 border-b border-gray-700'>
          <h2 className='text-xl font-bold text-white'>Add New Prospect</h2>
          <button onClick={onClose} className='text-gray-400 hover:text-white transition-colors text-2xl'>
            ×
          </button>
        </div>

        <form onSubmit={(e) => e.preventDefault()} className='p-4 space-y-4'>
          <div>
            <label className='block text-sm font-medium text-gray-300 mb-1'>Business Name *</label>
            <input
              type='text'
              name='businessName'
              value={formData.businessName}
              onChange={handleChange}
              className={`w-full bg-gray-800 border rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors ${errors.businessName ? 'border-red-500' : 'border-gray-700'}`}
              placeholder='Enter business name'
            />
            {errors.businessName && <span className='text-red-400 text-sm mt-1'>{errors.businessName}</span>}
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-300 mb-1'>Industry *</label>
              <select
                name='industry'
                value={formData.industry}
                onChange={handleChange}
                className='w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors'
              >
                {INDUSTRIES.map((ind) => (
                  <option key={ind.value} value={ind.value}>
                    {ind.emoji} {ind.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-300 mb-1'>Stage</label>
              <select
                name='stage'
                value={formData.stage}
                onChange={handleChange}
                className='w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors'
              >
                {STAGES.map((s) => (
                  <option key={s.value} value={s.value}>{s.label}</option>
                ))}
              </select>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-300 mb-1'>City *</label>
              <input
                type='text'
                name='city'
                value={formData.city}
                onChange={handleChange}
                className={`w-full bg-gray-800 border rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors ${errors.city ? 'border-red-500' : 'border-gray-700'}`}
                placeholder='Atlanta'
              />
              {errors.city && <span className='text-red-400 text-sm mt-1'>{errors.city}</span>}
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-300 mb-1'>State *</label>
              <select
                name='state'
                value={formData.state}
                onChange={handleChange}
                className='w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white focus:outline-none focus:border-cyan-500 transition-colors'
              >
                {STATES.map((s) => (
                  <option key={s} value={s}>{s}</option>
                ))}
              </select>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4'>
            <div>
              <label className='block text-sm font-medium text-gray-300 mb-1'>Phone</label>
              <input
                type='tel'
                name='phone'
                value={formData.phone}
                onChange={handleChange}
                className='w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors'
                placeholder='(404) 555-1234'
              />
            </div>

            <div>
              <label className='block text-sm font-medium text-gray-300 mb-1'>Website</label>
              <input
                type='url'
                name='website'
                value={formData.website}
                onChange={handleChange}
                className='w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors'
                placeholder='https://'
              />
            </div>
          </div>

          <div>
            <label className='block text-sm font-medium text-gray-300 mb-1'>Notes</label>
            <textarea
              name='notes'
              value={formData.notes}
              onChange={handleChange}
              rows={3}
              className='w-full bg-gray-800 border border-gray-700 rounded px-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-500 transition-colors resize-none'
              placeholder='Additional notes...'
            />
          </div>

          <div className='flex justify-end gap-3 pt-4 border-t border-gray-700'>
            <button
              type='button'
              onClick={onClose}
              className='px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded text-white transition-colors'
            >
              Cancel
            </button>
            <button
              type='button'
              onClick={handleSubmit}
              className='px-4 py-2 bg-cyan-600 hover:bg-cyan-500 rounded text-white font-medium transition-colors'
            >
              Save Prospect
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProspectModal;
