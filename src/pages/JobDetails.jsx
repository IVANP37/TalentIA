
import React, { useState } from 'react';
import { useRecruitment } from '../hooks/useRecruitment.jsx';
import { STATUS_COLORS } from '../constants.js';
import Icon from '../components/Icon.jsx';
import Modal from '../components/Modal.jsx';
import ApplyForm from '../components/ApplyForm.jsx';
import CandidateProfile from '../components/CandidateProfile.jsx';
import { useTranslation } from 'react-i18next';

const CandidateCard = ({ candidate, onSelect }) => {
  const score = candidate.matchAnalysis?.score ?? 0;
  let scoreColor = 'text-gray-500';
  if (score >= 85) scoreColor = 'text-green-500';
  else if (score >= 70) scoreColor = 'text-yellow-500';
  else if (score > 0) scoreColor = 'text-orange-500';
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <div onClick={onSelect} className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm hover:shadow-md cursor-pointer transition-shadow">
      <div className="flex justify-between items-center">
        <p className="font-semibold text-lg text-gray-800 dark:text-white">{candidate.parsedData?.name || 'N/A'}</p>
        <div className="flex items-center gap-2">
            <span className={`text-xl font-bold ${scoreColor}`}>{score > 0 ? `${score}%` : 'N/A'}</span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${STATUS_COLORS[candidate.status]}`}>{t(candidate.status)}</span>
        </div>
      </div>
      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{candidate.parsedData?.email || ''}</p>
      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2 line-clamp-2">{candidate.matchAnalysis?.summary ? candidate.matchAnalysis.summary[lang] : t('AI analysis pending...')}</p>
    </div>
  );
};

const JobDetails = ({ job, onBack, onStartOnboarding }) => {
  const { getApplicantsForJob } = useRecruitment();
  const [isApplyModalOpen, setApplyModalOpen] = useState(false);
  const [selectedCandidate, setSelectedCandidate] = useState(null);
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  const applicants = getApplicantsForJob(job.id);

  return (
    <div className="container mx-auto">
      <button onClick={onBack} className="flex items-center text-indigo-600 dark:text-indigo-400 hover:underline mb-4">
        <Icon name="arrowLeft" className="w-5 h-5 mr-2" />
        {t('Back to Dashboard')}
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 mb-6">
        <div className="flex justify-between items-start">
            <div>
                <h2 className="text-3xl font-extrabold text-gray-900 dark:text-white">{job.title[lang]}</h2>
                <p className="text-gray-600 dark:text-gray-400 mt-1">{job.department[lang]} | {job.location[lang]} | {job.salary}</p>
            </div>
            <button onClick={() => setApplyModalOpen(true)} className="bg-indigo-600 text-white px-4 py-2 rounded-lg shadow hover:bg-indigo-700 transition">
                {t('Add Candidate')}
            </button>
        </div>
        <div className="mt-4 border-t border-gray-200 dark:border-gray-700 pt-4">
            <h4 className="font-semibold">{t('Description')}</h4>
            <p className="text-gray-700 dark:text-gray-300 mt-1">{job.description[lang]}</p>
            <h4 className="font-semibold mt-3">{t('Requirements')}</h4>
            <ul className="list-disc list-inside mt-1 text-gray-700 dark:text-gray-300">
                {job.requirements.map((req, i) => <li key={i}>{req[lang]}</li>)}
            </ul>
        </div>
      </div>
      
      <h3 className="text-2xl font-bold mb-4 text-gray-800 dark:text-white">{t('Applicants')} ({applicants.length})</h3>
      <div className="space-y-4">
        {applicants.length > 0 ? (
          applicants.map(candidate => (
            <CandidateCard key={candidate.id} candidate={candidate} onSelect={() => setSelectedCandidate(candidate)} />
          ))
        ) : (
          <div className="text-center py-12 bg-white dark:bg-gray-800 rounded-lg">
            <p className="text-gray-500 dark:text-gray-400">{t('No applicants for this position yet.')}</p>
          </div>
        )}
      </div>

      <Modal title={t('Add Candidate')} isOpen={isApplyModalOpen} onClose={() => setApplyModalOpen(false)}>
        <ApplyForm jobId={job.id} onSuccess={() => setApplyModalOpen(false)} />
      </Modal>

      {selectedCandidate && (
        <Modal title={t('Candidate Profile')} isOpen={!!selectedCandidate} onClose={() => setSelectedCandidate(null)} size="4xl">
            <CandidateProfile 
                candidate={selectedCandidate} 
                onClose={() => setSelectedCandidate(null)} 
                onStartOnboarding={onStartOnboarding}
            />
        </Modal>
      )}
    </div>
  );
};

export default JobDetails;