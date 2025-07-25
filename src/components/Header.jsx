
import React from 'react';
import Icon from './Icon.jsx';
import Logo from '../assets/Nucleus-logo.svg';
import { useTranslation } from 'react-i18next';

const Header = ({ onLogoClick }) => {
  const { t, i18n } = useTranslation();

  const handleChangeLang = (e) => {
    i18n.changeLanguage(e.target.value);
  };

  return (
    <header className="bg-white dark:bg-gray-800 shadow-md">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div 
            className="flex items-center cursor-pointer"
            onClick={onLogoClick}
            >
           <img src={Logo} alt="Logo" className="w-32 h-32 text-indigo-600 dark:text-indigo-400" />

            <h1 className="ml-3 text-2xl font-bold text-gray-800 dark:text-white">
              {t('AI Recruitment Hub')}
            </h1>
          </div>
          <div className="flex items-center gap-4">
             <div className="w-10 h-10 rounded-full bg-indigo-200 dark:bg-indigo-700 flex items-center justify-center">
                 <Icon name="user" className="w-6 h-6 text-indigo-600 dark:text-indigo-300" />
             </div>
             <select
                className="bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded px-2 py-1 text-sm"
                value={i18n.language}
                onChange={handleChangeLang}
                aria-label="Seleccionar idioma"
              >
                <option value="es">Español</option>
                <option value="en">English</option>
             </select>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;