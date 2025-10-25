import { motion } from 'framer-motion';
import MainLayout from '@/components/layout/main-layout';
import { useLocation } from 'wouter';

const LanguageTestPage = () => {
  const [, navigate] = useLocation();
  
  const languages = ['VOSTFR', 'VF1', 'VF2', 'VA'];
  const selectedLanguage = 'VOSTFR';
  
  // Fonction pour générer le drapeau selon la langue
  const renderFlag = (lang: string) => {
    const upperLang = lang.toUpperCase();
    
    // Drapeau français pour VF, VF1, VF2
    if (upperLang.startsWith('VF')) {
      return (
        <div className="absolute inset-0 flex">
          <div className="w-1/3 bg-blue-600"></div>
          <div className="w-1/3 bg-white"></div>
          <div className="w-1/3 bg-red-600"></div>
        </div>
      );
    }
    
    // Drapeau japonais pour VOSTFR
    if (upperLang === 'VOSTFR') {
      return (
        <div className="absolute inset-0 bg-white flex items-center justify-center">
          <div className="w-6 h-6 bg-red-600 rounded-full"></div>
        </div>
      );
    }
    
    // Drapeau américain pour VA (Version Anglaise)
    if (upperLang === 'VA') {
      return (
        <div className="absolute inset-0 bg-blue-800 flex flex-col">
          <div className="h-1/2 bg-blue-800 flex items-center justify-center">
            <div className="grid grid-cols-3 gap-0.5">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="w-1 h-1 bg-white rounded-full"></div>
              ))}
            </div>
          </div>
          <div className="flex-1 flex flex-col">
            {[...Array(7)].map((_, i) => (
              <div key={i} className={`flex-1 ${i % 2 === 0 ? 'bg-red-600' : 'bg-white'}`}></div>
            ))}
          </div>
        </div>
      );
    }
    
    // Drapeau par défaut (neutre)
    return (
      <div className="absolute inset-0 bg-gray-700"></div>
    );
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto p-8">
        <h1 className="text-4xl font-bold text-white mb-8 text-center">
          Test des Drapeaux de Langues
        </h1>
        
        <div className="mb-8">
          <h2 className="text-2xl text-cyan-400 mb-4">Dandadan - Langues disponibles</h2>
          <p className="text-gray-300 mb-4">
            Toutes les langues disponibles pour Dandadan Saison 1
          </p>
        </div>

        {/* Sélecteur de langue */}
        <div className="flex gap-2 flex-wrap mb-8">
          {languages.map((lang) => (
            <motion.button
              key={lang}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`relative px-4 py-2 rounded-md font-bold text-sm border-2 transition-all overflow-hidden ${
                selectedLanguage === lang
                  ? 'border-white text-white shadow-lg opacity-100'
                  : 'border-gray-500 text-gray-300 hover:border-gray-300 opacity-50 hover:opacity-75'
              }`}
              data-testid={`button-language-${lang.toLowerCase()}`}
            >
              {renderFlag(lang)}
              
              {/* Texte de la langue */}
              <span className="relative z-10 text-white font-bold text-shadow-strong" style={{
                textShadow: '2px 2px 4px rgba(0,0,0,0.8), -1px -1px 2px rgba(0,0,0,0.8), 1px -1px 2px rgba(0,0,0,0.8), -1px 1px 2px rgba(0,0,0,0.8)'
              }}>
                {lang === 'VOSTFR' ? 'VO' : lang}
              </span>
            </motion.button>
          ))}
        </div>

        {/* Grande version des drapeaux */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {languages.map((lang) => (
            <div key={lang} className="space-y-2">
              <div className="relative h-32 rounded-lg overflow-hidden border-2 border-gray-600">
                {renderFlag(lang)}
              </div>
              <p className="text-center text-white font-bold">{lang}</p>
            </div>
          ))}
        </div>

        {/* Bouton pour tester sur Dandadan */}
        <div className="mt-8 text-center">
          <button
            onClick={() => navigate('/anime/dandadan/player?season=saison1&episode=1&lang=vostfr')}
            className="px-6 py-3 bg-gradient-to-r from-cyan-500 to-purple-600 text-white font-bold rounded-lg hover:opacity-90 transition-opacity"
          >
            Tester sur Dandadan →
          </button>
        </div>
      </div>
    </MainLayout>
  );
};

export default LanguageTestPage;
