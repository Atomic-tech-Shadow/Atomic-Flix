import MainLayout from '@/components/layout/main-layout';
import { motion } from 'framer-motion';
import { Sparkles, Heart, Code, Globe } from 'lucide-react';

const features = [
  {
    icon: Code,
    color: 'text-cyan-400',
    bg: 'bg-cyan-500/10 border-cyan-500/20',
    title: 'Interface Moderne',
    desc: 'Design épuré et intuitif pour une navigation fluide et agréable.',
  },
  {
    icon: Globe,
    color: 'text-purple-400',
    bg: 'bg-purple-500/10 border-purple-500/20',
    title: 'Multi-langues',
    desc: 'Profitez de vos animes en VOSTFR et VF selon vos préférences.',
  },
  {
    icon: Heart,
    color: 'text-pink-400',
    bg: 'bg-pink-500/10 border-pink-500/20',
    title: 'Fait avec passion',
    desc: 'Conçu par des fans, pour des fans de l\'animation japonaise.',
  },
];

const techs = ['React', 'TypeScript', 'Tailwind CSS', 'Vite', 'Framer Motion', 'Wouter', 'TanStack Query', 'Radix UI'];

const AboutPage: React.FC = () => (
  <MainLayout>
    <div className="min-h-screen text-white pb-16" style={{ backgroundColor: 'var(--atomic-dark)' }}>
      <div className="max-w-3xl mx-auto px-4 pt-10">

        {/* ── Hero ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center mb-5">
            <img
              src="/assets/atomic-logo-round.png"
              alt="ATOMIC FLIX"
              className="h-20 w-20 atomic-logo-round"
              style={{ boxShadow: '0 0 40px rgba(0,240,255,0.4)' }}
            />
          </div>
          <h1 className="text-4xl sm:text-5xl font-black mb-3 atomic-gradient-text tracking-tight">
            ATOMIC FLIX
          </h1>
          <p className="text-white/50 text-base sm:text-lg">
            Votre plateforme de streaming d&apos;anime préférée 🇹🇬
          </p>
        </motion.div>

        {/* ── Mission ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8"
        >
          <div className="atomic-glass p-6 sm:p-8 rounded-2xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="p-2 bg-cyan-500/10 rounded-lg border border-cyan-500/20">
                <Sparkles className="text-cyan-400 h-5 w-5" />
              </div>
              <h2 className="text-xl font-bold text-white">Notre Mission</h2>
            </div>
            <p className="text-white/65 leading-relaxed">
              ATOMIC FLIX est une plateforme moderne de streaming d&apos;anime conçue pour offrir
              la meilleure expérience aux fans d&apos;animation japonaise. Nous vous proposons un
              accès simple et rapide à vos animes préférés, en VOSTFR et VF — entièrement gratuit.
            </p>
          </div>
        </motion.div>

        {/* ── Features ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="grid sm:grid-cols-3 gap-4 mb-8"
        >
          {features.map((f) => {
            const Icon = f.icon;
            return (
              <div key={f.title} className={`p-5 rounded-xl text-center border ${f.bg} bg-white/[0.02]`}>
                <div className={`inline-flex p-3 rounded-xl mb-3 ${f.bg}`}>
                  <Icon className={`h-6 w-6 ${f.color}`} />
                </div>
                <h3 className={`text-base font-bold mb-2 ${f.color}`}>{f.title}</h3>
                <p className="text-white/50 text-sm leading-relaxed">{f.desc}</p>
              </div>
            );
          })}
        </motion.div>

        {/* ── Tech Stack ── */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="atomic-glass p-6 sm:p-8 rounded-2xl mb-8"
        >
          <h2 className="text-lg font-bold text-white mb-4 text-center">Technologies utilisées</h2>
          <div className="flex flex-wrap gap-2 justify-center">
            {techs.map((t) => (
              <span
                key={t}
                className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/8 text-white/65 text-sm hover:border-cyan-500/30 hover:text-white/90 transition-all duration-200"
              >
                {t}
              </span>
            ))}
          </div>
        </motion.div>

        {/* ── Footer ── */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center text-white/35 text-sm"
        >
          <p className="flex items-center justify-center gap-1.5 mb-1">
            Made with <Heart className="inline text-pink-500 h-3.5 w-3.5" /> in Togo 🇹🇬
          </p>
          <p className="text-xs text-white/25">ATOMIC FLIX © 2025 — Tous droits réservés</p>
        </motion.div>

      </div>
    </div>
  </MainLayout>
);

export default AboutPage;
