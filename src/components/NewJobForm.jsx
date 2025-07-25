
import React, { useState } from 'react';
import { useRecruitment } from '../hooks/useRecruitment.jsx';
import { useTranslation } from 'react-i18next';

const NewJobForm = ({ onSuccess }) => {
  const [title, setTitle] = useState('');
  const [department, setDepartment] = useState('');
  const [location, setLocation] = useState('');
  const [salary, setSalary] = useState('');
  const [description, setDescription] = useState('');
  const [requirements, setRequirements] = useState('');
  const { addJob } = useRecruitment();
  const { t } = useTranslation();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title || !department || !location || !description || !requirements) {
        alert(t('Please fill all fields'));
        return;
    }
    addJob({
      title,
      department,
      location,
      salary,
      description,
      requirements: requirements.split(',').map(r => r.trim()),
    });
    onSuccess();
  };
  
  const InputField = ({ label, value, onChange, placeholder, required = false}) => (
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t(label)}</label>
        <input
          type="text"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={t(placeholder)}
          required={required}
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
        />
      </div>
  );

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <InputField label="Job Title" value={title} onChange={setTitle} placeholder="e.g., Senior Frontend Engineer" required />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <InputField label="Department" value={department} onChange={setDepartment} placeholder="e.g., Technology" required />
          <InputField label="Location" value={location} onChange={setLocation} placeholder="e.g., Remote" required />
      </div>
       <InputField label="Salary Range" value={salary} onChange={setSalary} placeholder="e.g., $120,000 - $160,000" />
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('Description')}</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={4}
          required
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          placeholder={t('Detailed job description...')}
        ></textarea>
      </div>
      <div>
        <label className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('Requirements (comma-separated)')}</label>
        <textarea
          value={requirements}
          onChange={(e) => setRequirements(e.target.value)}
          rows={3}
          required
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
          placeholder={t('e.g., 5+ years React, TypeScript, Tailwind CSS')}
        ></textarea>
      </div>
      <div className="flex justify-end">
        <button
          type="submit"
          className="text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark:bg-indigo-600 dark:hover:bg-indigo-700 dark:focus:ring-indigo-800"
        >
          {t('Create Job')}
        </button>
      </div>
    </form>
  );
};

export default NewJobForm;