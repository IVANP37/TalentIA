
import React, { useState } from 'react';
import { useRecruitment } from '../hooks/useRecruitment.jsx';
import LoadingSpinner from './LoadingSpinner.jsx';
import { useTranslation } from 'react-i18next';

const ApplyForm = ({ jobId, onSuccess }) => {
  const [cvText, setCvText] = useState('');
  const { addCandidate, loading, error } = useRecruitment();
  const { t } = useTranslation();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!cvText.trim()) {
        alert(t("Please paste the candidate's CV."));
        return;
    }
    await addCandidate(jobId, cvText);
    if (!error && !loading) {
        onSuccess();
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="space-y-4">
         <div>
            <label htmlFor="cv-text" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">{t('Paste CV Text')}</label>
            <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">
                {t("Paste the full content of the candidate's CV here. The AI will automatically parse it.")}
            </p>
            <textarea
                id="cv-text"
                rows={15}
                value={cvText}
                onChange={(e) => setCvText(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white"
                placeholder="Juan Pérez\nCalle Principal 123 | (555) 123-4567 | juan.perez@email.com\n\nResumen\nIngeniero de software altamente motivado...\n..."
            ></textarea>
        </div>
        
        {loading && <div className="flex justify-center"><LoadingSpinner text={t('Analyzing CV and ranking candidate...')}/></div>}

        {error && <div className="text-red-500 text-sm p-3 bg-red-100 dark:bg-red-900 dark:text-red-300 rounded-lg">{error}</div>}
        
      </div>
      <div className="flex justify-end mt-6">
        <button
          type="submit"
          className="text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center disabled:bg-indigo-400"
          disabled={loading}
        >
          {loading ? t('Submitting...') : t('Submit Application')}
        </button>
      </div>
    </form>
  );
};

export default ApplyForm;