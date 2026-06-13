"use client";

import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { CloudSun, MessageCircle, ArrowRight, Sparkles } from "lucide-react";
import { AuthWidget } from "@/presentation/components/AuthWidget";

// Simple zero-dependency class merging helper
function cn(...inputs: (string | undefined | null | false)[]) {
  return inputs.filter(Boolean).join(" ");
}

// Animation variants
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { y: 25, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      duration: 0.8,
      ease: [0.16, 1, 0.3, 1] as const, // EaseOut expo-like curve
    },
  },
};

export default function LandingPage() {
  const router = useRouter();

  const navLinks = [
    { label: "Explorador", href: "/explorer" },
    { label: "Asistente IA", href: "/chat" },
    { label: "Predicciones ML", href: "/prediction" },
  ];

  return (
    <div className="relative flex min-h-screen w-full flex-col items-center justify-center overflow-hidden bg-[#020617] text-white">
      {/* Background with scenic mountain sky overlay */}
      <div
        className="absolute inset-0 z-0 bg-cover bg-center transition-transform duration-1000 scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1519681393784-d120267933ba?auto=format&fit=crop&w=1920&q=80')`,
        }}
      >
        {/* Multi-layered premium gradients for depth */}
        <div className="absolute inset-0 bg-radial from-transparent via-[#020617]/50 to-[#020617]" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#020617] via-[#020617]/40 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-[#020617]/60 via-transparent to-[#020617]/80" />
      </div>

      {/* Decorative ambient glowing lights */}
      <div className="absolute top-1/4 left-1/4 w-[400px] h-[400px] bg-sky-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-[450px] h-[450px] bg-violet-600/10 rounded-full blur-[130px] pointer-events-none" />

      {/* Header */}
      <motion.header
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="absolute top-0 z-20 flex h-24 w-full items-center justify-between px-6 md:px-12 backdrop-blur-xs bg-gradient-to-b from-black/40 to-transparent"
      >
        {/* Logo */}
        <div className="flex items-center gap-3 cursor-pointer" onClick={() => router.push("/explorer")}>
          <div className="p-2 bg-sky-500/10 rounded-xl border border-sky-500/20 shadow-[0_0_15px_rgba(56,189,248,0.15)] animate-pulse">
            <CloudSun size={26} className="text-sky-400" />
          </div>
          <div>
            <h1 className="text-lg font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white via-white to-sky-400">
              Deteclima
            </h1>
            <p className="text-[9px] text-sky-400/80 tracking-widest uppercase font-bold">
              San Vicente de Paúl
            </p>
          </div>
        </div>

        {/* Navigation Links */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <a
              key={link.label}
              href={link.href}
              className="text-xs font-semibold uppercase tracking-wider text-slate-300 transition-all hover:text-white hover:scale-105"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* Top Right Action - AuthWidget */}
        <div className="flex items-center gap-4">
          <AuthWidget />
        </div>
      </motion.header>

      {/* Main Content Area */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="relative z-10 flex flex-col items-center justify-center text-center px-6 md:px-12 max-w-4xl w-full mt-12"
      >
        {/* Pill/Badge */}
        <motion.div
          variants={itemVariants}
          className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-sky-400/30 bg-sky-500/10 text-xs font-semibold tracking-wide text-sky-300 shadow-[0_0_15px_rgba(56,189,248,0.1)]"
        >
          <Sparkles size={13} className="text-sky-400 animate-spin" style={{ animationDuration: '6s' }} />
          Innovación Educativa & Alertas del Clima
        </motion.div>

        {/* Title */}
        <motion.h1
          variants={itemVariants}
          className="text-4xl font-extrabold tracking-tight sm:text-6xl md:text-7xl leading-[1.1] md:leading-[1.05]"
        >
          Monitoreo Climático y Alertas de{" "}
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-sky-400 via-sky-300 to-indigo-300 drop-shadow-[0_2px_10px_rgba(56,189,248,0.2)]">
            Heladas en los Andes
          </span>
        </motion.h1>

        {/* Description */}
        <motion.p
          variants={itemVariants}
          className="mt-6 max-w-2xl text-base md:text-lg leading-relaxed text-slate-300 font-medium"
        >
          Plataforma escolar interactiva diseñada por los estudiantes del Colegio San Vicente de Paúl en Jauja. 
          Descubre datos meteorológicos en tiempo real, analiza tendencias con Machine Learning 
          y anticipa heladas para proteger la agricultura local.
        </motion.p>

        {/* Call to Actions */}
        <motion.div
          variants={itemVariants}
          className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 w-full sm:w-auto"
        >
          {/* Main button with pulsing glow */}
          <button
            onClick={() => router.push("/explorer")}
            className="w-full sm:w-auto px-8 py-4 bg-sky-500 hover:bg-sky-400 text-[#020617] font-bold text-sm rounded-2xl transition-all shadow-[0_0_30px_rgba(56,189,248,0.3)] hover:shadow-[0_0_40px_rgba(56,189,248,0.5)] hover:scale-105 active:scale-95 flex items-center justify-center gap-2 group cursor-pointer"
          >
            Empezar a Explorar
            <ArrowRight size={16} className="transition-transform group-hover:translate-x-1" />
          </button>

          {/* Secondary CTA */}
          <button
            onClick={() => router.push("/chat")}
            className="w-full sm:w-auto px-8 py-4 bg-white/5 hover:bg-white/10 text-white font-bold text-sm rounded-2xl border border-white/10 backdrop-blur-md transition-all hover:scale-105 active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
          >
            <MessageCircle size={16} className="text-sky-400" />
            Consultar IA
          </button>
        </motion.div>
      </motion.div>

      {/* Footer */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 0.7 }}
        transition={{ delay: 1.2, duration: 1 }}
        className="absolute bottom-8 z-10 text-[10px] md:text-xs text-slate-400 tracking-wider text-center"
      >
        Deteclima — Colegio San Vicente de Paúl, Jauja | {new Date().getFullYear()}
      </motion.div>
    </div>
  );
}
