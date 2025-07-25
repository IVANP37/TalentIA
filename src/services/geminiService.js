// Servicio adaptado para usar Ollama en vez de Gemini

const OLLAMA_URL = import.meta.env.VITE_OLLAMA_URL || 'http://ollama:11434';
const OLLAMA_MODEL = 'gemma3'; // Cambiado a gemma3 según indicación

/**
 * Función auxiliar para extraer un objeto JSON de una cadena de texto.
 * Intenta encontrar el primer '{' y el último '}' para aislar el JSON.
 * @param {string} text La cadena de texto que puede contener JSON.
 * @returns {object} El objeto JSON parseado.
 * @throws {Error} Si no se encuentra un JSON válido o falla el parseo.
 */
const extractJson = (text) => {
    // Intenta encontrar el primer '{' y el último '}'
    const startIndex = text.indexOf('{');
    const endIndex = text.lastIndexOf('}');

    if (startIndex === -1 || endIndex === -1 || startIndex > endIndex) {
        // Si no se encuentran las llaves o están en orden incorrecto, no hay JSON válido
        throw new Error('No se encontró un objeto JSON válido en la respuesta del modelo.');
    }

    // Extrae la posible cadena JSON
    const jsonString = text.substring(startIndex, endIndex + 1);

    // Intenta parsear directamente
    try {
        return JSON.parse(jsonString);
    } catch (e) {
        // Si el parseo directo falla, intenta una limpieza más agresiva de bloques markdown
        // Esto es un fallback, la extracción primaria debería ser robusta
        const cleanedJsonText = jsonString.trim().replace(/^```json|```$/g, '').trim();
        try {
            return JSON.parse(cleanedJsonText);
        } catch (innerError) {
            // Si incluso después de la limpieza falla, lanza el error original de parseo
            throw new Error(`Fallo al parsear JSON después de la extracción: ${innerError.message}. Cadena intentada: "${cleanedJsonText}"`);
        }
    }
};

export const parseCv = async (cvText) => {
    // Hacemos el prompt más estricto para que devuelva SOLO JSON
    const prompt = `Extrae la siguiente información del CV en formato JSON:
{
  "name": "Nombre completo",
  "email": "Correo electrónico",
  "phone": "Teléfono",
  "summary": "Resumen profesional",
  "experience": [
    { "title": "Puesto", "company": "Empresa", "duration": "Duración", "description": "Descripción" }
  ],
  "education": [
    { "institution": "Institución", "degree": "Título", "year": "Año" }
  ],
  "skills": ["habilidad1", "habilidad2"],
  "rating": {
    "score": 1-5, // Valoración general del postulante (1=muy bajo, 5=excelente)
    "comment": "Comentario breve sobre la valoración general"
  }
}
Si falta algún campo, usa una cadena vacía o un array vacío.
Devuelve SOLO el JSON. NO incluyas ningún texto adicional, explicaciones, introducciones o bloques de código markdown (como \`\`\`json).
CV:
${cvText}
`;
    try {
        const res = await fetch(`${OLLAMA_URL}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // Aseguramos que no haya streaming para simplificar el parseo
            body: JSON.stringify({ model: OLLAMA_MODEL, prompt, stream: false })
        });
        const data = await res.json();
        console.log('Ollama raw response for parseCv:', data); // Log la respuesta cruda
        const jsonText = data.response || ''; // Usamos data.response para /api/generate
        return extractJson(jsonText);
    } catch (error) {  
        console.error('Error parsing CV with Ollama:', error);
        throw new Error('Failed to parse CV with Ollama. ' + error.message);
    }
};

export const rankCandidate = async (candidate, job) => {
    // Hacemos el prompt más estricto para que devuelva SOLO JSON
    const prompt = `Dado el siguiente puesto y candidato, responde en JSON con este formato:
{
  "score": 0-100,
  "summary": "Resumen de ajuste",
  "strengths": ["fuerza1", "fuerza2"],
  "weaknesses": ["debilidad1", "debilidad2"]
}

Devuelve SOLO el JSON. NO incluyas ningún texto adicional, explicaciones, introducciones o bloques de código markdown (como \`\`\`json).

Puesto:
Título: ${job.title}
Descripción: ${job.description}
Requisitos: ${job.requirements.join(', ')}

Candidato:
Resumen: ${candidate.parsedData?.summary}
Experiencia: ${(candidate.parsedData?.experience || []).map(e => `${e.title} en ${e.company}`).join(', ')}
Habilidades: ${(candidate.parsedData?.skills || []).join(', ')}
`;
    try {
        const res = await fetch(`${OLLAMA_URL}/api/generate`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            // Aseguramos que no haya streaming
            body: JSON.stringify({ model: OLLAMA_MODEL, prompt, stream: false })
        });
        const data = await res.json();
        console.log('Ollama raw response for rankCandidate:', data); // Log la respuesta cruda
        const jsonText = data.response || ''; // Usamos data.response para /api/generate
        return extractJson(jsonText);
    } catch (error) {
        console.error('Error ranking candidate with Ollama:', error);
        throw new Error('Failed to rank candidate with Ollama. ' + error.message);
    }
};

export const askChatbot = async (question, jobs, candidates) => {
    // El contexto se da como system prompt, y la pregunta como user
    const context = `Eres un asistente experto en RRHH. Responde solo usando los datos proporcionados sobre vacantes y candidatos. No inventes información.\n\nVacantes:\n${jobs.filter(j => j.status === 'Open').map(job => `- ID: ${job.id}\n  Título: ${job.title}\n  Descripción: ${job.description}\n  Requisitos: ${job.requirements.join(', ')}`).join('\n')}\n\nCandidatos:\n${candidates.map(candidate => `- ID: ${candidate.id}\n  Nombre: ${candidate.parsedData?.name || 'N/A'}\n  Puesto: ${candidate.jobId}\n  Estado: ${candidate.status}\n  Score: ${candidate.matchAnalysis?.score || 'N/A'}\n  Resumen: ${candidate.parsedData?.summary || 'N/A'}\n  Habilidades: ${(candidate.parsedData?.skills || []).join(', ') || 'N/A'}`).join('\n')}`;
    try {
        const res = await fetch(`${OLLAMA_URL}/api/chat`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                model: OLLAMA_MODEL,
                messages: [
                    { role: 'system', content: context },
                    { role: 'user', content: question }
                ],
                stream: false // Aseguramos que no haya streaming para respuestas de chat
            })
        });
        const data = await res.json();
        console.log('Ollama raw response for askChatbot:', data); // Log la respuesta cruda para el chatbot
        // Limpia cualquier bloque markdown (```json, ```txt, ```)
        let content = data.message?.content || data.response || 'No response from Ollama.';
        content = content.replace(/```[a-zA-Z]*[\r\n]?/g, '').replace(/```/g, '').trim();
        return content;
    } catch (error) {
        console.error('Error with Ollama chatbot:', error);
        // Devolvemos el mensaje de error para que el componente lo muestre
        return 'Sorry, I encountered an error. ' + error.message;
    }
};