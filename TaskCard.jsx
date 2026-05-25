import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, ShieldAlert, Sparkles, Orbit, Gem, Flame } from 'lucide-react';

const DIFFICULTIES = {
  Easy: {
    color: 'border-emerald-500/30 text-emerald-400 bg-emerald-500/10 shadow-emerald-500/5',
    glow: 'group-hover:border-emerald-400/50 group-hover:shadow-emerald-500/10',
    icon: Orbit,
    rewardXp: 10,
    rewardGold: 5,
    title: 'TERRESTRIAL QUEST'
  },
  Medium: {
    color: 'border-cyan-500/30 text-cyan-400 bg-cyan-500/10 shadow-cyan-500/5',
    glow: 'group-hover:border-cyan-400/50 group-hover:shadow-cyan-500/10',
    icon: Sparkles,
    rewardXp: 20,
    rewardGold: 10,
    title: 'NEBULAR QUEST'
  },
  Hard: {
    color: 'border-fuchsia-500/30 text-fuchsia-400 bg-fuchsia-500/10 shadow-fuchsia-500/5',
    glow: 'group-hover:border-fuchsia-400/50 group-hover:shadow-fuchsia-500/10',
    icon: Gem,
    rewardXp: 45,
    rewardGold: 25,
    title: 'VOID QUEST'
  },
  Epic: {
    color: 'border-amber-500/45 text-amber-400 bg-amber-500/10 shadow-amber-500/15',
    glow: 'group-hover:border-amber-400/80 group-hover:shadow-amber-500/25 group-hover:shadow-gold-glow',
    icon: Flame,
    rewardXp: 100,
    rewardGold: 60,
    title: 'COSMIC SINGULARITY'
  }
};

const TaskCard = ({ task, onComplete, onDelete, completingId }) => {
  const config = DIFFICULTIES[task.difficulty] || DIFFICULTIES.Easy;
  const Icon = config.icon;
  const isCompleting = completingId === task._id;

  // Generate organic floating speed/delay class based on string hash of the task's ID
  const getFloatingClass = (id) => {
    if (!id) return 'animate-float-medium';
    const sum = id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const options = ['animate-float-slow', 'animate-float-medium', 'animate-float-fast'];
    return options[sum % options.length];
  };

  const floatClass = getFloatingClass(task._id);

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.8, y: 30 }}
      animate={{ opacity: 1, scale: 1, y: 0 }}
      exit={{ 
        opacity: 0, 
        scale: 0.6, 
        y: -120, 
        rotate: -8,
        transition: { duration: 0.45, ease: "easeIn" } 
      }}
      className={`w-full group ${floatClass}`}
    >
      <div className={`glass-panel p-5 relative overflow-hidden transition-all duration-300 ${config.color} ${config.glow} flex flex-col justify-between h-56 group`}>
        {/* Floating Space Particles Decoration inside card */}
        <div className="absolute top-2 right-2 w-1.5 h-1.5 bg-white/20 rounded-full blur-xs group-hover:animate-pulse"></div>
        <div className="absolute bottom-4 left-4 w-1 h-1 bg-white/10 rounded-full blur-xs"></div>
        
        {/* Card Header: Difficulty Badge & Rewards */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <Icon className="w-4 h-4 animate-spin-slow" />
            <span className="text-[10px] font-mono tracking-widest uppercase font-bold">
              {config.title}
            </span>
          </div>
          
          <div className="flex items-center gap-2 font-mono text-[10px] bg-black/40 border border-white/5 rounded-full px-2.5 py-1">
            <span className="text-rpg-xp font-bold">+{config.rewardXp} XP</span>
            <span className="text-white/30">•</span>
            <span className="text-rpg-gold font-bold">+{config.rewardGold}G</span>
          </div>
        </div>

        {/* Card Body: Quest Title */}
        <div className="my-4">
          <h3 className="text-base md:text-lg font-semibold tracking-wide text-transparent bg-clip-text bg-gradient-to-br from-white via-white to-gray-400 group-hover:to-purple-200 line-clamp-2 leading-relaxed">
            {task.title}
          </h3>
        </div>

        {/* Card Footer: Interactive Buttons */}
        <div className="flex gap-3 mt-auto pt-3 border-t border-white/5 relative z-10">
          {/* Complete Button */}
          <button
            onClick={() => onComplete(task._id, task.difficulty)}
            disabled={isCompleting}
            className={`flex-grow flex items-center justify-center gap-2 px-3 py-2 rounded-xl text-xs font-bold tracking-wider transition-all duration-300 ${
              isCompleting 
                ? 'bg-purple-900/30 text-purple-400 border border-purple-800/20' 
                : 'bg-gradient-to-r from-violet-600/80 to-indigo-600/80 hover:from-violet-500 hover:to-indigo-500 text-white border border-indigo-500/30 hover:border-indigo-400/80 hover:shadow-cosmic-glow active:scale-95'
            }`}
          >
            <CheckCircle className={`w-3.5 h-3.5 ${isCompleting ? 'animate-spin' : ''}`} />
            <span>{isCompleting ? 'COMPLETING...' : 'RESOLVE QUEST'}</span>
          </button>

          {/* Delete/Abort Button */}
          <button
            onClick={() => onDelete(task._id)}
            className="flex-shrink-0 bg-rose-950/20 hover:bg-rose-950/60 border border-rose-900/30 hover:border-rose-600 text-rose-400 hover:text-white p-2 rounded-xl transition-all duration-200 active:scale-95 flex items-center justify-center"
            title="Abort quest and suffer gravity decay damage"
          >
            <ShieldAlert className="w-4 h-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default TaskCard;
