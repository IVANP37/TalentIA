import React, { useState, useMemo } from 'react';
import { useRecruitment } from '../hooks/useRecruitment.jsx';
import Icon from '../components/Icon.jsx';
import Modal from '../components/Modal.jsx';
import NewJobForm from '../components/NewJobForm.jsx';
import Chatbot from '../components/Chatbot.jsx'; // Assuming this is your AI Assistant
import { useTranslation } from 'react-i18next';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { CandidateStatus } from '../types.js'; // Import CandidateStatus

// Colors for charts (can be customized)
const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#A100F2', '#F200A1'];
const GENDER_COLORS = ['#8884d8', '#82ca9d', '#ffc658']; // Male, Female, Other/Not specified

const JobCard = ({ job, onSelect }) => {
  const { getApplicantsForJob } = useRecruitment();
  const applicantCount = getApplicantsForJob(job.id).length;
  // CORRECCIÓN: Usar los estados 'Abierta' y 'Cerrado' para la lógica de color
  const statusColor = job.status === 'Abierta' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800';
  const statusDotColor = job.status === 'Abierta' ? 'bg-green-500' : 'bg-red-500';
  const { t, i18n } = useTranslation();
  const lang = i18n.language;

  return (
    <div
      onClick={onSelect}
      className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 cursor-pointer hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between border border-gray-200 dark:border-gray-700"
    >
      <div>
        <div className="flex justify-between items-start mb-2">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">{job.title[lang]}</h3>
            <span className={`px-3 py-1 text-xs font-semibold rounded-full ${statusColor} dark:bg-opacity-30`}>
                {t(job.status)}
            </span>
        </div>
        <p className="text-gray-600 dark:text-gray-400 text-sm">{job.department[lang]} - {job.location[lang]}</p>
        <p className="text-gray-500 dark:text-gray-300 mt-3 text-sm line-clamp-2">{job.description[lang]}</p>
      </div>
      <div className="mt-5 flex justify-between items-center">
        <div className="text-sm text-gray-500 dark:text-gray-400 flex items-center">
          <Icon name="users" className="w-4 h-4 mr-1 text-indigo-500" />
          <span className="font-semibold text-indigo-600 dark:text-indigo-400">{applicantCount}</span> {t('Applicants')}
        </div>
        <div className="flex items-center text-sm text-gray-700 dark:text-gray-300">
          <span className={`w-2.5 h-2.5 rounded-full mr-2 ${statusDotColor}`}></span>
          {job.salary}
        </div>
      </div>
    </div>
  );
};

const Dashboard = ({ onSelectJob }) => {
  const { jobs, candidates } = useRecruitment();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState(''); // State for search
  // CORRECCIÓN: El estado inicial del filtro debe coincidir con los valores del mock
  const [filterStatus, setFilterStatus] = useState('All'); // State for status filter
  const { t, i18n } = useTranslation();

  // --- Lógica para preparar datos para los KPIs y Gráficos ---
  // CORRECCIÓN: Usar 'Abierta' para contar vacantes abiertas
  const totalOpenJobs = useMemo(() => jobs.filter(job => job.status === 'Abierta').length, [jobs]);
  const totalCandidates = useMemo(() => candidates.length, [candidates]);
  const candidatesInInterview = useMemo(() => candidates.filter(c => c.status === CandidateStatus.INTERVIEW).length, [candidates]);
  const hiredCandidates = useMemo(() => candidates.filter(c => c.status === CandidateStatus.HIRED).length, [candidates]);

  const dataByStatus = useMemo(() => {
    const statusCounts = candidates.reduce((acc, candidate) => {
      acc[candidate.status] = (acc[candidate.status] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(statusCounts).map(status => ({
      name: t(status), // Translate status name
      value: statusCounts[status],
    }));
  }, [candidates, t]);

  const dataByGender = useMemo(() => {
    const genderCounts = candidates.reduce((acc, candidate) => {
      const gender = candidate.parsedData?.gender || 'Other';
      acc[gender] = (acc[gender] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(genderCounts).map(gender => ({
      name: t(gender), // Translate gender name (Male, Female, Other)
      value: genderCounts[gender],
    }));
  }, [candidates, t]);

  const dataByJob = useMemo(() => {
    const currentLang = i18n.language;
    const jobCounts = candidates.reduce((acc, candidate) => {
      const job = jobs.find(j => j.id === candidate.jobId);
      let jobTitle = t('Puesto Desconocido');

      if (job) {
        jobTitle = job.title[currentLang] || job.title.en || t('Puesto Desconocido');
      }
      acc[jobTitle] = (acc[jobTitle] || 0) + 1;
      return acc;
    }, {});
    return Object.keys(jobCounts).map(jobTitle => ({
      name: jobTitle,
      value: jobCounts[jobTitle],
    }));
  }, [candidates, jobs, i18n.language, t]);

  // --- Lógica para filtrar y buscar ofertas de trabajo ---
  const filteredJobs = useMemo(() => {
    let currentJobs = jobs;

    // Filtrar por estado
    if (filterStatus !== 'All') {
      // CORRECCIÓN: Filtrar por los valores de estado en español
      currentJobs = currentJobs.filter(job => job.status === filterStatus);
    }

    // Buscar por término
    if (searchTerm) {
      const lowerCaseSearchTerm = searchTerm.toLowerCase();
      currentJobs = currentJobs.filter(job =>
        job.title[i18n.language]?.toLowerCase().includes(lowerCaseSearchTerm) ||
        job.description[i18n.language]?.toLowerCase().includes(lowerCaseSearchTerm) ||
        job.department[i18n.language]?.toLowerCase().includes(lowerCaseSearchTerm) ||
        job.location[i18n.language]?.toLowerCase().includes(lowerCaseSearchTerm)
      );
    }

    return currentJobs;
  }, [jobs, filterStatus, searchTerm, i18n.language]);


  // --- Renderizado del Dashboard ---
  return (
    <div className="container mx-auto p-4 sm:p-6 lg:p-8">
      {/* Main Application Header */}
      <header className="flex flex-col sm:flex-row justify-between items-center mb-10 pb-6 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center mb-4 sm:mb-0">
          <h1 className="text-4xl font-extrabold text-gray-900 dark:text-white">{t('Plataforma de Reclutamiento')}</h1> {/* Título actualizado */}
        </div>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center bg-indigo-600 text-white px-6 py-3 rounded-xl shadow-lg hover:bg-indigo-700 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-gray-900"
        >
          <Icon name="plus" className="w-5 h-5 mr-2" />
          {t('Crear Vacante')}
        </button>
      </header>

      {/* KPIs Section - STYLES IMPROVED */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
        {/* KPI: Vacantes Abiertas */}
        <div className="relative overflow-hidden bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl shadow-xl p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <div className="absolute inset-0 bg-pattern-dots opacity-10"></div> {/* Subtle pattern background */}
          <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <Icon name="briefcase" className="w-10 h-10 text-white mb-3 opacity-90" />
            <p className="text-sm font-medium opacity-90">{t('Vacantes Abiertas')}</p>
            <span className="text-4xl font-bold mt-2">{totalOpenJobs}</span>
          </div>
        </div>

        {/* KPI: Total Candidatos */}
        <div className="relative overflow-hidden bg-gradient-to-br from-green-500 to-teal-600 rounded-xl shadow-xl p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <div className="absolute inset-0 bg-pattern-dots opacity-10"></div>
          <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <Icon name="users" className="w-10 h-10 text-white mb-3 opacity-90" />
            <p className="text-sm font-medium opacity-90">{t('Total Candidatos')}</p>
            <span className="text-4xl font-bold mt-2">{totalCandidates}</span>
          </div>
        </div>

        {/* KPI: En Entrevista */}
        <div className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl shadow-xl p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <div className="absolute inset-0 bg-pattern-dots opacity-10"></div>
          <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <Icon name="calendar" className="w-10 h-10 text-white mb-3 opacity-90" />
            <p className="text-sm font-medium opacity-90">{t('En Entrevista')}</p>
            <span className="text-4xl font-bold mt-2">{candidatesInInterview}</span>
          </div>
        </div>

        {/* KPI: Candidatos Contratados */}
        <div className="relative overflow-hidden bg-gradient-to-br from-yellow-500 to-orange-600 rounded-xl shadow-xl p-6 text-white transform transition-all duration-300 hover:scale-105 hover:shadow-2xl">
          <div className="absolute inset-0 bg-pattern-dots opacity-10"></div>
          <div className="relative z-10 flex flex-col items-center justify-center text-center">
            <Icon name="checkCircle" className="w-10 h-10 text-white mb-3 opacity-90" />
            <p className="text-sm font-medium opacity-90">{t('Candidatos Contratados')}</p>
            <span className="text-4xl font-bold mt-2">{hiredCandidates}</span>
          </div>
        </div>
      </section>

      {/* Statistics Section (Charts) */}
      <section className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 mb-10 border border-gray-200 dark:border-gray-700">
        <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">{t('Estadísticas de Candidatos')}</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Candidates by Status Chart */}
          <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-inner">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('Candidatos por Estado')}</h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={dataByStatus}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {dataByStatus.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Candidates by Gender Chart */}
          <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-inner">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('Candidatos por Sexo')}</h4>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={dataByGender}
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                >
                  {dataByGender.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={GENDER_COLORS[index % GENDER_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </div>

          {/* Candidates by Job Position Chart */}
          <div className="flex flex-col items-center p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-inner col-span-1 md:col-span-2 lg:col-span-1">
            <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 mb-4">{t('Candidatos por Puesto')}</h4>
            <ResponsiveContainer width="100%" height={250}>
              <BarChart
                data={dataByJob}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.3} />
                <XAxis dataKey="name" angle={-15} textAnchor="end" height={50} tick={{ fontSize: 12, fill: 'var(--text-color-light)' }} />
                <YAxis allowDecimals={false} tick={{ fill: 'var(--text-color-light)' }} />
                <Tooltip />
                <Legend />
                <Bar dataKey="value" fill="#8884d8" name={t('Candidatos')} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </section>

      {/* Job Postings Filter and Search Section */}
      <section className="flex flex-col sm:flex-row justify-between items-center mb-8 gap-4">
        <h2 className="text-3xl font-bold text-gray-800 dark:text-white mb-4 sm:mb-0">{t('Ofertas de Empleo')}</h2>
        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <input
            type="text"
            placeholder={t('Buscar ofertas...')}
            className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 flex-grow"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="All">{t('Todos los estados')}</option>
            {/* CORRECCIÓN: Usar los valores de estado en español para las opciones del filtro */}
            <option value="Abierta">{t('Abierta')}</option>
            <option value="Cerrado">{t('Cerrado')}</option>
          </select>
        </div>
      </section>

      {/* Job Postings List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredJobs.length > 0 ? (
          filteredJobs.map(job => (
            <JobCard key={job.id} job={job} onSelect={() => onSelectJob(job)} />
          ))
        ) : (
          <div className="col-span-full text-center text-gray-500 dark:text-gray-400 p-8 text-lg">
            {t('No se encontraron ofertas de empleo que coincidan con los criterios.')}
          </div>
        )}
      </div>

      {/* Modal for Creating New Job Posting */}
      <Modal title={t('Crear Nueva Vacante')} isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
        <NewJobForm onSuccess={() => setIsModalOpen(false)} />
      </Modal>

      {/* AI Assistant (Chatbot) */}
      <Chatbot />
    </div>
  );
};

export default Dashboard;
