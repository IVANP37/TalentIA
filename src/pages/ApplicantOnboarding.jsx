import React, { useState, useRef } from 'react';
import Icon from '../components/Icon.jsx';
import { useTranslation } from 'react-i18next';
import { jsPDF } from 'jspdf'; // Importar jsPDF
import html2canvas from 'html2canvas'; // Importar html2canvas
import Logo from '../assets/Nucleus-logo.svg';

const ApplicantOnboarding = ({ candidate, onBack }) => {
  const [signature, setSignature] = useState('');
  const [dni, setDni] = useState(''); // Nuevo estado para el DNI
  const [isSigned, setIsSigned] = useState(false);
  const [message, setMessage] = useState(null); // Estado para el mensaje personalizado
  const [messageType, setMessageType] = useState(''); // 'success' o 'error'
  const { t } = useTranslation();

  // Referencia para el elemento del contrato que queremos convertir a PDF
  const contractRef = useRef(null);

  const handleSign = () => {
    if (signature.trim() === candidate.parsedData?.name && dni.trim() !== '') {
      setIsSigned(true);
      setMessage(t('¡Contrato Firmado Exitosamente! Se ha enviado una confirmación a {{email}}.', { email: candidate.parsedData?.email }));
      setMessageType('success');
    } else {
      // Mensaje más específico si la firma no coincide o el DNI está vacío
      if (signature.trim() !== candidate.parsedData?.name) {
        setMessage(t('La firma debe coincidir con el nombre completo del candidato.'));
      } else if (dni.trim() === '') {
        setMessage(t('Por favor, ingresa tu DNI.'));
      }
      setMessageType('error');
    }
    // Limpiar el mensaje después de 5 segundos
    setTimeout(() => {
      setMessage(null);
      setMessageType('');
    }, 5000);
  };

  const handleDownloadPdf = async () => {
    if (!contractRef.current) {
      setMessage(t('Error: No se pudo encontrar el contenido del contrato para descargar.'));
      setMessageType('error');
      return;
    }

    // Ocultar temporalmente el botón de descarga para que no aparezca en el PDF
    const downloadButton = document.getElementById('downloadPdfButton');
    if (downloadButton) downloadButton.style.display = 'none';

    // Capturar el contenido del contrato como una imagen
    // Se usa scale para mejorar la resolución del PDF
    const canvas = await html2canvas(contractRef.current, {
      scale: 3, // Aumenta la resolución para mejor calidad en el PDF (puedes ajustar este valor)
      useCORS: true, // Importante si hay imágenes de diferentes orígenes
      logging: false, // Desactivar logs de html2canvas en consola
      // Considera `windowWidth` y `windowHeight` si el contenido es muy grande y el scroll es un problema
      // windowWidth: contractRef.current.scrollWidth,
      // windowHeight: contractRef.current.scrollHeight,
    });

    // Restaurar la visibilidad del botón de descarga
    if (downloadButton) downloadButton.style.display = 'block';

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4'); // 'p' para portrait, 'mm' para unidades, 'a4' para tamaño
    const imgWidth = 210; // Ancho A4 en mm (ancho de la página)
    const pageHeight = 297; // Alto A4 en mm (alto de la página)
    const imgHeight = (canvas.height * imgWidth) / canvas.width; // Altura de la imagen escalada para el ancho de la página
    let heightLeft = imgHeight;
    let position = 0;

    // Añadir la primera página
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
    heightLeft -= pageHeight;

    // Si el contenido es más largo que una página, añadir más páginas
    while (heightLeft >= -1) { // -1 para asegurar que se capture el final si hay un pequeño remanente
      position = heightLeft - imgHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight);
      heightLeft -= pageHeight;
    }

    pdf.save(`Contrato_Empleo_${candidate.parsedData?.name.replace(/\s/g, '_')}.pdf`);
  };

  const contractText = `
    Este Contrato de Empleo ("Acuerdo") se celebra con fecha de ${new Date().toLocaleDateString()}, entre Nucleus SA ("Empleador") y ${candidate.parsedData?.name} ("Empleado").

    1. Puesto: El Empleador acuerda emplear al Empleado en el puesto de [Título del Puesto - A Completar]. El Empleado desempeñará los deberes y responsabilidades asociados a este puesto.

    2. Remuneración: El Empleador pagará al Empleado un salario anual, pagadero en cuotas quincenales, sujeto a las deducciones y retenciones de nómina estándar.

    3. Confidencialidad: El Empleado se compromete a mantener la confidencialidad de toda la información propietaria del Empleador.

    4. Duración: Este acuerdo comenzará en la fecha de inicio y continuará hasta que sea terminado por cualquiera de las partes con el aviso apropiado.

    EN FE DE LO CUAL, las partes han ejecutado este Acuerdo en la fecha indicada al inicio.
  `;

  return (
    <div className="container mx-auto max-w-4xl">
      <button onClick={onBack} className="flex items-center text-indigo-600 dark:text-indigo-400 hover:underline mb-6">
        <Icon name="arrowLeft" className="w-5 h-5 mr-2" />
        {t('Back to Dashboard')}
      </button>

      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{t('Welcome Aboard, {{name}}!', { name: candidate.parsedData?.name })}</h1>
          <p className="text-xl text-gray-600 dark:text-gray-300 mt-2">{t('We are thrilled to have you join our team.')}</p>
        </div>

        {/* Mensaje personalizado */}
        {message && (
          <div className={`p-4 mb-4 rounded-lg text-center ${messageType === 'success' ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'}`}>
            {message}
          </div>
        )}

        <div className="space-y-6">
          <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
            <h2 className="text-2xl font-semibold mb-3">{t('Onboarding Checklist')}</h2>
            <ul className="space-y-2 text-gray-700 dark:text-gray-300">
              <li className="flex items-center">
                <span className={`w-6 h-6 rounded-full mr-3 flex items-center justify-center ${isSigned ? 'bg-green-500' : 'bg-gray-300'}`}>
                    {isSigned && <span className="text-white">✓</span>}
                </span>
                {t('Sign Employment Contract')}
              </li>
              <li className="flex items-center">
                   <span className="w-6 h-6 rounded-full mr-3 bg-gray-300"></span>
                {t('Complete HR Paperwork (link to be sent via email)')}
              </li>
              <li className="flex items-center">
                   <span className="w-6 h-6 rounded-full mr-3 bg-gray-300"></span>
                {t('Set up hardware and software')}
              </li>
              <li className="flex items-center">
                   <span className="w-6 h-6 rounded-full mr-3 bg-gray-300"></span>
                {t('Meet your new team!')}
              </li>
            </ul>
          </div>

          <div className="p-6 bg-gray-50 dark:bg-gray-700 rounded-lg">
            {/* Contenedor del contrato para la captura de PDF */}
            <div ref={contractRef} className="bg-white dark:bg-gray-800 p-8 rounded-lg shadow-md" style={{ width: '210mm', minHeight: '297mm', boxSizing: 'border-box' }}>
                {/* Encabezado con Logo y Título */}
                <div className="flex flex-col items-center mb-8 border-b pb-4 border-gray-200 dark:border-gray-600">
                    <img src={Logo} alt="Nucleus Logo" className="h-16 w-auto mb-4" />
                    <h2 className="text-3xl font-bold text-gray-900 dark:text-white text-center">{t('Contrato de Empleo')}</h2>
                    <p className="text-lg text-gray-600 dark:text-gray-300 text-center mt-2">Nucleus SA</p>
                </div>

                {/* Texto del Contrato */}
                <pre className="whitespace-pre-wrap text-base text-gray-700 dark:text-gray-300 font-sans leading-relaxed mb-12">
                    {contractText}
                </pre>

                {/* Área de Firma Digital (se captura con html2canvas) */}
                {isSigned && (
                    <div className="mt-16 pt-8 border-t border-gray-300 dark:border-gray-600 text-center">
                        <p className="font-bold text-2xl text-gray-800 dark:text-gray-200 mb-2">{signature}</p>
                        <p className="text-lg text-gray-600 dark:text-gray-400">{t('Firma Electrónica')}</p>
                        <p className="text-md text-gray-500 dark:text-gray-500">{t('DNI')}: {dni}</p> {/* DNI ingresado por el usuario */}
                        <p className="text-md text-gray-500 dark:text-gray-500">{new Date().toLocaleDateString()}</p>
                        <p className="text-xs text-gray-500 dark:text-gray-500 mt-1">ID de Documento: {candidate.id}</p>
                    </div>
                )}
            </div>

            {isSigned ? (
                <div className="p-4 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-lg text-center mt-4">
                    <p className="font-bold">{t('Contract Signed Successfully!')}</p>
                    <p>{t('A confirmation has been sent to {{email}}.', { email: candidate.parsedData?.email })}</p>
                    {/* Botón de descarga de PDF */}
                    <button
                      id="downloadPdfButton" // ID para ocultar/mostrar
                      onClick={handleDownloadPdf}
                      className="mt-4 w-full bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      {t('Download Contract as PDF')}
                    </button>
                </div>
            ) : (
                <div className="mt-4">
                  <label htmlFor="signature" className="block text-sm font-medium text-gray-700 dark:text-gray-200">
                    {t('To sign, please type your full name: "{{name}}"', { name: candidate.parsedData?.name })}
                  </label>
                  <input
                    type="text"
                    id="signature"
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-lg font-serif italic shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder={t('Your electronic signature')}
                  />
                  {/* Nuevo campo para el DNI */}
                  <label htmlFor="dni" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mt-4">
                    {t('Por favor, ingresa tu DNI:')}
                  </label>
                  <input
                    type="text"
                    id="dni"
                    value={dni}
                    onChange={(e) => setDni(e.target.value)}
                    className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-900 border border-gray-300 dark:border-gray-600 rounded-md text-lg font-mono shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                    placeholder={t('Tu número de DNI')}
                  />
                  <button
                    onClick={handleSign}
                    disabled={!signature || !dni} // Deshabilitar si firma o DNI están vacíos
                    className="mt-4 w-full bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-gray-400"
                  >
                    {t('Sign Contract')}
                  </button>
                </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ApplicantOnboarding;
