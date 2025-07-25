
import React, { useState } from 'react';
import { useRecruitment } from '../hooks/useRecruitment.jsx';
import { askChatbot } from '../services/geminiService.js';
import Icon from './Icon.jsx';
import LoadingSpinner from './LoadingSpinner.jsx';
import { useTranslation } from 'react-i18next';

const Chatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const { jobs, candidates } = useRecruitment();
  const { t } = useTranslation();

  const toggleChat = () => setIsOpen(!isOpen);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!inputValue.trim()) return;

    const userMessage = { type: 'user', text: inputValue };
    setMessages(prev => [...prev, userMessage]);
    setInputValue('');
    setIsLoading(true);

    try {
      const botResponse = await askChatbot(inputValue, jobs, candidates);
      setMessages(prev => [...prev, { type: 'bot', text: botResponse }]);
    } catch (error) {
      console.error(error);
      setMessages(prev => [...prev, { type: 'bot', text: t('Sorry, I had trouble connecting. Please try again.') }]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <button
        onClick={toggleChat}
        className="fixed bottom-6 right-6 bg-indigo-600 text-white rounded-full p-4 shadow-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-transform hover:scale-110"
        aria-label="Toggle AI Assistant"
      >
        <Icon name="chat" className="w-8 h-8" />
      </button>

      {isOpen && (
        <div className="fixed bottom-24 right-6 w-full max-w-md bg-white dark:bg-gray-800 rounded-lg shadow-2xl flex flex-col h-[60vh] z-40">
          <div className="p-4 bg-indigo-600 text-white rounded-t-lg flex justify-between items-center">
            <h3 className="font-bold text-lg">{t('Recruitment AI Assistant')}</h3>
            <button onClick={toggleChat} className="text-white hover:text-indigo-200">&times;</button>
          </div>
          <div className="flex-1 p-4 overflow-y-auto space-y-4">
            {messages.length === 0 && (
                <div className="text-center text-gray-500 dark:text-gray-400 h-full flex flex-col justify-center">
                    <p className="font-semibold">{t('Ask me anything!')}</p>
                    <p className="text-sm">{t('e.g., "Who is the best candidate for the Frontend role?"')}</p>
                    <p className="text-sm">{t('Compare Vanesa and Iñaki for the Senior Engineer position.')}</p>
                </div>
            )}
            {messages.map((msg, index) => (
              <div key={index} className={`flex ${msg.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div
                  className={`max-w-xs lg:max-w-md px-4 py-2 rounded-xl ${
                    msg.type === 'user'
                      ? 'bg-indigo-500 text-white'
                      : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.text}</p>
                </div>
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                  <div className="bg-gray-200 dark:bg-gray-700 px-4 py-2 rounded-xl">
                      <LoadingSpinner size="sm" />
                  </div>
              </div>
            )}
          </div>
          <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 dark:border-gray-700 flex items-center">
            <input
              type="text"
              value={inputValue}
              onChange={(e) => setInputValue(e.target.value)}
              placeholder={t('Ask a question...')}
              className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-gray-50 dark:bg-gray-700"
              disabled={isLoading}
            />
            <button
              type="submit"
              className="ml-3 bg-indigo-600 text-white rounded-full p-3 hover:bg-indigo-700 disabled:bg-indigo-300"
              disabled={isLoading || !inputValue.trim()}
            >
              <Icon name="send" className="w-5 h-5" />
            </button>
          </form>
        </div>
      )}
    </>
  );
};

export default Chatbot;