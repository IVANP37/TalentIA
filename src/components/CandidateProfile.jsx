import React, { useState } from 'react';
import { CandidateStatus } from '../types.js';
import { useRecruitment } from '../hooks/useRecruitment.jsx';
import { STATUS_COLORS } from '../constants.js';
import { useTranslation } from 'react-i18next';

const ProfileSection = ({ title, children }) => (
    <div className="mb-6">
        <h4 className="text-lg font-semibold text-gray-800 dark:text-gray-200 border-b border-gray-200 dark:border-gray-600 pb-2 mb-3">{title}</h4>
        {children}
    </div>
);

const CandidateProfile = ({ candidate, onClose, onStartOnboarding }) => {
    const { updateCandidateStatus, addNoteToCandidate, scheduleInterview } = useRecruitment();
    const [newNote, setNewNote] = useState('');
    const [interviewDate, setInterviewDate] = useState('');
    const [interviewerName, setInterviewerName] = useState(''); // Nuevo estado para el nombre del entrevistador
    const [interviewType, setInterviewType] = useState(''); // Nuevo estado para el tipo de entrevista (Virtual/Presencial)
    const [interviewLocation, setInterviewLocation] = useState(''); // Nuevo estado para el enlace/ubicación
    const [message, setMessage] = useState(null); // Estado para mensajes de UI
    const [messageType, setMessageType] = useState(''); // 'success' o 'error'

    const { t, i18n } = useTranslation();
    const lang = i18n.language;

    const handleAddNote = () => {
        if (newNote.trim()) {
            addNoteToCandidate(candidate.id, { en: newNote, es: newNote }); // Simple: agrega igual en ambos idiomas
            setNewNote('');
        }
    };

    const handleScheduleInterview = () => {
        if (!interviewDate || !interviewerName || !interviewType || !interviewLocation) {
            setMessage(t('Por favor, completa todos los campos de la entrevista (Fecha, Entrevistador, Tipo, Ubicación/Enlace).'));
            setMessageType('error');
            setTimeout(() => setMessage(null), 5000);
            return;
        }

        scheduleInterview(
            candidate.id,
            new Date(interviewDate).toISOString(),
            interviewerName,
            interviewType,
            interviewLocation
        );
        setMessage(t('Entrevista agendada exitosamente.'));
        setMessageType('success');
        setInterviewDate('');
        setInterviewerName('');
        setInterviewType('');
        setInterviewLocation('');
        setTimeout(() => setMessage(null), 5000);
    };

    const handleStatusChange = (e) => {
        updateCandidateStatus(candidate.id, e.target.value);
    };

    const handleHire = () => {
        updateCandidateStatus(candidate.id, CandidateStatus.HIRED);
        onStartOnboarding(candidate);
        onClose();
    };

    const { parsedData, matchAnalysis } = candidate;

    // Logs de depuración (mantener para verificar datos)
    console.log("CandidateProfile - candidate prop:", candidate);
    console.log("CandidateProfile - parsedData:", parsedData);
    console.log("CandidateProfile - matchAnalysis:", matchAnalysis);

    if (!parsedData || !matchAnalysis) {
        return <div className="text-center p-8">{t('Loading candidate data or match analysis...')}</div>
    }

    const score = matchAnalysis.score ?? 'N/A';
    const summary = matchAnalysis.summary?.[lang] ?? t('No summary available.');
    const strengths = matchAnalysis.strengths || [];
    const weaknesses = matchAnalysis.weaknesses || [];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* Left Column: Actions & Notes */}
            <div className="space-y-6">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="font-semibold mb-2">{t('Actions')}</h4>
                    <button onClick={handleHire} className="w-full bg-green-600 text-white px-4 py-2 rounded-lg shadow hover:bg-green-700 transition mb-4">{t('Mark as Hired & Start Onboarding')}</button>

                    {/* Sección para agendar entrevista */}
                    <div className="space-y-2 mb-4">
                        <h5 className="font-semibold text-gray-800 dark:text-gray-200">{t('Schedule Interview')}</h5>
                        {message && (
                            <div className={`p-2 text-sm rounded ${messageType === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
                                {message}
                            </div>
                        )}
                        <input
                            type="datetime-local"
                            value={interviewDate}
                            onChange={e => setInterviewDate(e.target.value)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md text-gray-900 dark:text-gray-100"
                        />
                        <input
                            type="text"
                            value={interviewerName}
                            onChange={e => setInterviewerName(e.target.value)}
                            placeholder={t('Nombre del Entrevistador')}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md text-gray-900 dark:text-gray-100"
                        />
                        <select
                            value={interviewType}
                            onChange={e => setInterviewType(e.target.value)}
                            className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md text-gray-900 dark:text-gray-100"
                        >
                            <option value="">{t('Selecciona Tipo de Entrevista')}</option>
                            <option value="Virtual">{t('Virtual')}</option>
                            <option value="Presencial">{t('Presencial')}</option>
                        </select>
                        {interviewType && (
                            <input
                                type="text"
                                value={interviewLocation}
                                onChange={e => setInterviewLocation(e.target.value)}
                                placeholder={interviewType === 'Virtual' ? t('Enlace de la Reunión (ej. Zoom, Meet)') : t('Dirección de la Entrevista')}
                                className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md text-gray-900 dark:text-gray-100"
                            />
                        )}
                        <button onClick={handleScheduleInterview} className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg shadow hover:bg-purple-700 transition">{t('Schedule Interview')}</button>
                    </div>

                    {/* Mostrar detalles de la entrevista agendada si existe */}
                    {candidate.interviewDate && (
                        <div className="p-4 bg-indigo-50 dark:bg-indigo-700 rounded-lg mt-4">
                            <h5 className="font-semibold text-indigo-800 dark:text-indigo-200 mb-2">{t('Entrevista Agendada')}</h5>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                <strong>{t('Fecha y Hora')}:</strong> {new Date(candidate.interviewDate).toLocaleString(lang === 'es' ? 'es-ES' : 'en-US', { dateStyle: 'full', timeStyle: 'short' })}
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                <strong>{t('Entrevistador')}:</strong> {candidate.interviewerName}
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                <strong>{t('Tipo')}:</strong> {t(candidate.interviewType)}
                            </p>
                            <p className="text-sm text-gray-700 dark:text-gray-300">
                                <strong>{t('Ubicación/Enlace')}:</strong> {candidate.interviewLocation}
                            </p>
                        </div>
                    )}
                </div>

                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <h4 className="font-semibold mb-2">{t('Internal Notes')}</h4>
                    <div className="space-y-2 mb-4 max-h-40 overflow-y-auto">
                        {candidate.notes.map((note, i) => (
                           <div key={i} className="text-sm bg-white dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-600">{note[lang]}</div>
                        ))}
                    </div>
                    <textarea value={newNote} onChange={e => setNewNote(e.target.value)} rows={3} placeholder={t('Add a new note...')} className="w-full p-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 rounded-md text-gray-900 dark:text-gray-100 mb-2"></textarea>
                    <button onClick={handleAddNote} className="w-full bg-blue-600 text-white px-4 py-2 rounded-lg shadow hover:bg-blue-700 transition">{t('Add Note')}</button>
                </div>
            </div>

            {/* Right Column: Details */}
            <div className="space-y-6">
                <ProfileSection title={t('Professional Summary')}>
                    <p className="text-gray-600 dark:text-gray-400">{parsedData.summary?.[lang]}</p>
                </ProfileSection>
                <ProfileSection title={t('Experience')}>
                    {parsedData.experience.map((exp, i) => (
                        <div key={i} className="mb-3">
                            <div className="font-semibold">{exp.title?.[lang]} - {exp.company}</div>
                            <div className="text-sm text-gray-500">{exp.duration?.[lang]}</div>
                            <div className="text-sm text-gray-700 dark:text-gray-300">{exp.description?.[lang]}</div>
                        </div>
                    ))}
                </ProfileSection>
                <ProfileSection title={t('Education')}>
                    {parsedData.education.map((edu, i) => (
                        <div key={i} className="mb-2">
                            <div className="font-semibold">{edu.institution}</div>
                            <div className="text-sm text-gray-500">{edu.degree?.[lang]} - {edu.year}</div>
                        </div>
                    ))}
                </ProfileSection>
                <ProfileSection title={t('Skills')}>
                    <div className="flex flex-wrap gap-2">
                        {parsedData.skills.map((skill, i) => (
                            <span key={i} className="bg-indigo-100 dark:bg-indigo-700 text-indigo-800 dark:text-indigo-200 px-2 py-1 rounded text-xs font-medium">{skill}</span>
                        ))}
                    </div>
                </ProfileSection>
                <ProfileSection title={t('AI Match Analysis')}>
                    <div className="p-4 bg-indigo-50 dark:bg-gray-700 rounded-lg">
                        <div className="mb-2">
                            <span className="font-bold text-lg text-indigo-700 dark:text-indigo-300">{score}%</span>
                        </div>
                        <div className="mb-2 text-gray-700 dark:text-gray-300">{summary}</div>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                            <div>
                                <h5 className="font-semibold text-green-600">{t('Strengths')}</h5>
                                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                                    {strengths.map((s, i) => <li key={i}>{s?.[lang] || s}</li>)}
                                </ul>
                            </div>
                            <div>
                                <h5 className="font-semibold text-red-600">{t('Weaknesses')}</h5>
                                <ul className="list-disc list-inside text-gray-600 dark:text-gray-400">
                                    {weaknesses.map((w, i) => <li key={i}>{w?.[lang] || w}</li>)}
                                </ul>
                            </div>
                        </div>
                    </div>
                </ProfileSection>
            </div>
        </div>
    );
};

export default CandidateProfile;
