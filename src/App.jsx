
import React, { useState } from 'react';
import { RecruitmentProvider } from './hooks/useRecruitment.jsx';
import Header from './components/Header.jsx';
import Dashboard from './pages/Dashboard.jsx';
import JobDetails from './pages/JobDetails.jsx';
import ApplicantOnboarding from './pages/ApplicantOnboarding.jsx';

function App() {
  const [selectedJob, setSelectedJob] = useState(null);
  const [onboardingCandidate, setOnboardingCandidate] = useState(null);

  const handleSelectJob = (job) => {
    setSelectedJob(job);
    setOnboardingCandidate(null);
  };

  const handleBackToDashboard = () => {
    setSelectedJob(null);
    setOnboardingCandidate(null);
  };

  const handleStartOnboarding = (candidate) => {
      setSelectedJob(null);
      setOnboardingCandidate(candidate);
  };


  const renderContent = () => {
    if (onboardingCandidate) {
        return <ApplicantOnboarding candidate={onboardingCandidate} onBack={handleBackToDashboard} />;
    }
    if (selectedJob) {
      return <JobDetails job={selectedJob} onBack={handleBackToDashboard} onStartOnboarding={handleStartOnboarding} />;
    }
    return <Dashboard onSelectJob={handleSelectJob} />;
  };

  return (
    <RecruitmentProvider>
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans">
        <Header onLogoClick={handleBackToDashboard} />
        <main className="p-4 sm:p-6 lg:p-8">
          {renderContent()}
        </main>
      </div>
    </RecruitmentProvider>
  );
}

export default App;