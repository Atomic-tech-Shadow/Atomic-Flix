import MainLayout from '@/components/layout/main-layout';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Code, Globe } from 'lucide-react';

const AboutPage: React.FC = () => {
  return (
    <MainLayout>
      <div className="min-h-screen text-white pb-12" style={{ backgroundColor: 'var(--atomic-dark)' }}>
        <div className="container mx-auto px-4 pt-8">
          
          {/* Hero Section */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <div className="flex justify-center mb-6">
              <img 
                src="/assets/atomic-logo-round.png" 
                alt="ATOMIC FLIX" 
                className="h-24 w-24 atomic-logo-round"
                style={{
                  boxShadow: '0 0 40px rgba(0, 240, 255, 0.6)'
                }}
              />
            </div>
            <h1 className="text-5xl md:text-6xl font-black mb-4 atomic-gradient-text">
              ATOMIC FLIX
            </h1>
            <p className="text-xl text-gray-300">
              Votre plateforme de streaming d'anime préférée 🇹🇬
            </p>
          </motion.div>

          {/* Mission */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="max-w-3xl mx-auto mb-12"
          >
            <div className="atomic-glass p-8 rounded-2xl">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="text-cyan-400" size={28} />
                <h2 className="text-3xl font-bold atomic-gradient-text">Notre Mission</h2>
              </div>
              <p className="text-gray-300 leading-relaxed text-lg">
                ATOMIC FLIX est une plateforme moderne de streaming d'anime conçue pour offrir 
                la meilleure expérience aux fans d'animation japonaise. Nous vous proposons un 
                accès simple et rapide à vos animes préférés, en VOSTFR et VF.
              </p>
            </div>
          </motion.div>

          {/* Features Grid */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="grid md:grid-cols-3 gap-6 mb-12"
          >
            <div className="atomic-glass p-6 rounded-xl text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-cyan-500/20 rounded-full">
                  <Code className="text-cyan-400" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 text-cyan-400">Interface Moderne</h3>
              <p className="text-gray-400">
                Design épuré et intuitif pour une navigation fluide
              </p>
            </div>

            <div className="atomic-glass p-6 rounded-xl text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-purple-500/20 rounded-full">
                  <Globe className="text-purple-400" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 text-purple-400">Multi-langues</h3>
              <p className="text-gray-400">
                Profitez de vos animes en VOSTFR et VF
              </p>
            </div>

            <div className="atomic-glass p-6 rounded-xl text-center">
              <div className="flex justify-center mb-4">
                <div className="p-3 bg-pink-500/20 rounded-full">
                  <Heart className="text-pink-400" size={32} />
                </div>
              </div>
              <h3 className="text-xl font-bold mb-2 text-pink-400">Fait avec passion</h3>
              <p className="text-gray-400">
                Conçu par des fans, pour des fans
              </p>
            </div>
          </motion.div>

          {/* Tech Stack */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="max-w-3xl mx-auto"
          >
            <div className="atomic-glass p-8 rounded-2xl">
              <h2 className="text-3xl font-bold mb-6 text-center atomic-gradient-text">
                Technologies
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {['React', 'TypeScript', 'Tailwind CSS', 'Vite'].map((tech) => (
                  <div 
                    key={tech}
                    className="bg-gray-800/50 px-4 py-3 rounded-lg text-center border border-cyan-500/20 hover:border-cyan-500/50 transition-colors"
                  >
                    <span className="text-gray-300 font-medium">{tech}</span>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Footer */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.8 }}
            className="text-center mt-12 text-gray-400"
          >
            <p className="text-sm">
              Made with <Heart className="inline text-pink-500" size={16} /> in Togo 🇹🇬
            </p>
            <p className="text-xs mt-2">
              ATOMIC FLIX © 2025 - Tous droits réservés
            </p>
          </motion.div>

        </div>
      </div>
    </MainLayout>
  );
};

export default AboutPage;
