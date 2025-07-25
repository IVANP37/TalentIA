export const CandidateStatus = {
  APPLIED: 'Aplicado',
  REVIEWING: 'En Revisión',
  INTERVIEW: 'Entrevista',
  FINALIST: 'Finalista',
  HIRED: 'Contratado',
  REJECTED: 'Rechazado',
};

/**
 * @typedef {object} ParsedCVData
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {object} summary - { en: string, es: string }
 * @property {Array<object>} experience - [{ title: { en: string, es: string }, company: string, duration: { en: string, es: string }, description: { en: string, es: string } }]
 * @property {Array<object>} education - [{ institution: string, degree: { en: string, es: string }, year: string }]
 * @property {Array<string>} skills
 * @property {string} [dni] // Añadido el campo DNI
 */

/**
 * @typedef {object} MatchAnalysisData
 * @property {number} score
 * @property {object} summary - { en: string, es: string }
 * @property {Array<object>} strengths - [{ en: string, es: string }]
 * @property {Array<object>} weaknesses - [{ en: string, es: string }]
 */

/**
 * @typedef {object} Candidate
 * @property {string} id
 * @property {string} jobId
 * @property {ParsedCVData} parsedData
 * @property {string} cvText
 * @property {string} status - Una de las CandidateStatus
 * @property {MatchAnalysisData | null} matchAnalysis
 * @property {Array<object>} notes - [{ en: string, es: string }]
 * @property {string | null} interviewDate // Fecha y hora de la entrevista en formato ISO
 * @property {string | null} interviewerName // Nombre del entrevistador
 * @property {string | null} interviewType // 'Virtual' o 'Presencial'
 * @property {string | null} interviewLocation // Enlace o dirección
 * @property {string} appliedDate // Fecha de aplicación en formato ISO
 */
// En types.js, dentro de ParsedCVData
/**
 * @typedef {object} ParsedCVData
 * @property {string} name
 * // ... otras propiedades
 * @property {string} [gender] // Añadir esta línea
 * @property {string} [dni] // Asegurarse de que esta línea también esté si no lo estaba
 */