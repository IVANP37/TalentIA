import React, { createContext, useContext, useState, useCallback, useEffect } from 'react'; // Importar useEffect
import { CandidateStatus } from '../types.js';
import { MOCK_JOBS, MOCK_CANDIDATES } from '../data/mockData.js';
import { parseCv, rankCandidate } from '../services/geminiService.js'; // Manteniendo geminiService.js

const RecruitmentContext = createContext(undefined);

// Función auxiliar para cargar candidatos desde localStorage
const loadCandidatesFromLocalStorage = () => {
  try {
    const storedCandidates = localStorage.getItem('recruitmentCandidates');
    if (storedCandidates) {
      // Intentar parsear el JSON. Si falla, devolver MOCK_CANDIDATES.
      const parsed = JSON.parse(storedCandidates);
      // Opcional: Validar la estructura de los datos cargados si es muy importante
      if (Array.isArray(parsed) && parsed.every(c => c.id && c.parsedData && c.status)) {
        return parsed;
      }
      console.warn("Datos de candidatos en localStorage corruptos o con formato inesperado. Usando mock data.");
      return MOCK_CANDIDATES;
    }
  } catch (error) {
    console.error("Error al cargar candidatos de localStorage:", error);
    // Si hay un error al parsear, significa que los datos están corruptos.
    // Retornamos los datos mock para evitar que la app falle.
    return MOCK_CANDIDATES;
  }
  // Si no hay nada en localStorage, o si el parseo falló, devolver los datos mock
  return MOCK_CANDIDATES;
};

export const RecruitmentProvider = ({ children }) => {
  const [jobs, setJobs] = useState(MOCK_JOBS); // Los jobs pueden seguir siendo mock si no se persisten
  // Inicializar candidates usando la función de carga de localStorage
  const [candidates, setCandidates] = useState(loadCandidatesFromLocalStorage);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // useEffect para guardar los candidatos en localStorage cada vez que cambian
  useEffect(() => {
    try {
      localStorage.setItem('recruitmentCandidates', JSON.stringify(candidates));
      console.log("Candidatos guardados en localStorage.");
    } catch (error) {
      console.error("Error al guardar candidatos en localStorage:", error);
      // Aquí podrías mostrar un mensaje al usuario si el almacenamiento falla
    }
  }, [candidates]); // Se ejecuta cada vez que 'candidates' cambia

  const getApplicantsForJob = useCallback((jobId) => {
    return candidates.filter(c => c.jobId === jobId).sort((a, b) => (b.matchAnalysis?.score ?? 0) - (a.matchAnalysis?.score ?? 0));
  }, [candidates]);

  const addJob = (jobData) => {
    const newJob = {
      ...jobData,
      id: `job-${Date.now()}`,
      status: 'Open',
    };
    setJobs(prev => [newJob, ...prev]);
  };

  const addCandidate = async (jobId, cvText) => {
    setLoading(true);
    setError(null);
    try {
      const job = jobs.find(j => j.id === jobId);
      if (!job) throw new Error("Job not found");

      const parsedData = await parseCv(cvText);
      const tempCandidate = {
        id: '',
        jobId,
        parsedData,
        cvText,
        status: CandidateStatus.APPLIED,
        matchAnalysis: null,
        notes: [],
        interviewDate: null,
        interviewerName: null,
        interviewType: null,
        interviewLocation: null,
        appliedDate: new Date().toISOString()
      };

      const matchAnalysis = await rankCandidate(tempCandidate, job);

      const newCandidate = {
        ...tempCandidate,
        id: `cand-${Date.now()}`,
        matchAnalysis,
      };

      setCandidates(prev => [newCandidate, ...prev]);
    } catch (e) {
      console.error(e);
      setError(e.message || 'Failed to process candidate.');
    } finally {
      setLoading(false);
    }
  };

  const updateCandidateStatus = (candidateId, status) => {
    setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, status } : c));
  };

  const addNoteToCandidate = (candidateId, note) => {
    setCandidates(prev => prev.map(c => c.id === candidateId ? { ...c, notes: [...c.notes, note] } : c));
  };

  const scheduleInterview = (candidateId, date, interviewerName, interviewType, interviewLocation) => {
    setCandidates(prev => prev.map(c =>
      c.id === candidateId
        ? {
            ...c,
            interviewDate: date,
            interviewerName: interviewerName,
            interviewType: interviewType,
            interviewLocation: interviewLocation,
            status: CandidateStatus.INTERVIEW
          }
        : c
    ));
  };


  const value = {
    jobs,
    candidates,
    getApplicantsForJob,
    addJob,
    addCandidate,
    updateCandidateStatus,
    addNoteToCandidate,
    scheduleInterview,
    loading,
    error,
  };

  return <RecruitmentContext.Provider value={value}>{children}</RecruitmentContext.Provider>;
};

export const useRecruitment = () => {
  const context = useContext(RecruitmentContext);
  if (context === undefined) {
    throw new Error('useRecruitment must be used within a RecruitmentProvider');
  }
  return context;
};
