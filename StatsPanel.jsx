import React from 'react';
import { Heart, Coins, Award, Sparkles, RefreshCw } from 'lucide-react';

const StatsPanel = ({ user, onReset }) => {
  const xpNeeded = user.level * 100;
  const xpPercentage = Math.min(100, (user.xp / xpNeeded) * 100);
  const hpPercentage = Math.min(100, user.hp);

  return (
    <header className="w-full glass-panel cosmic-shimmer p-6 md:p-8 mb-10 relative overflow-hidden">
      {/* Background Glowing Nebula */}
      <div className="absolute top-0 right-1/4 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl -z-10 animate-pulse-slow"></div>
      
      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
        {/* Left Side: Avatar and Level Title */}
        <div className="flex items-center gap-5">
          {/* Avatar Area with Level Orbit */}
          <div className="relative flex-shrink-0 w-20 h-20 rounded-full border-2 border-purple-500/30 flex items-center justify-center bg-cosmic-darkest shadow-cosmic-glow">
            {/* Spinning Orbit Ring */}
            <div className="absolute inset-0 border-t-2 border-r-2 border-rpg-xp border-transparent rounded-full animate-spin"></div>
            
            {/* Character Icon / Symbol */}
            <div className="text-center">
              <span className="text-3xl">🧑‍🚀</span>
            </div>
            
            {/* Level Badge Badge */}
            <div className="absolute -bottom-2 -right-2 bg-rpg-level text-white font-bold text-xs px-2.5 py-1 rounded-full shadow-lg border border-purple-300/20 flex items-center gap-0.5">
              <span className="text-[10px] text-purple-200">LV</span>
              <span className="text-[13px]">{user.level}</span>
            </div>
          </div>

          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-xl font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white via-gray-200 to-purple-300">
                {user.username}
              </h2>
              <Sparkles className="w-4 h-4 text-rpg-xp animate-pulse" />
            </div>
            <p className="text-sm text-purple-300/70 font-mono tracking-wider mt-0.5">
              Rank: Stellar Explorer
            </p>
          </div>
        </div>

        {/* Right Side: Quick Stats Bars Grid */}
        <div className="flex-grow grid grid-cols-1 md:grid-cols-3 gap-6 lg:max-w-4xl lg:ml-6">
          {/* HP Stat */}
          <div className="flex flex-col gap-2 bg-white/5 border border-white/5 p-3 rounded-xl">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-1.5 text-rpg-hp font-semibold">
                <Heart className={`w-4 h-4 fill-rpg-hp ${user.hp < 30 ? 'animate-bounce' : 'animate-pulse'}`} />
                <span>HEALTH POINTS</span>
              </div>
              <span className="font-mono text-xs text-rpg-hp font-bold">{user.hp} / 100</span>
            </div>
            
            {/* HP Bar */}
            <div className="w-full bg-cosmic-darkest h-3.5 rounded-full p-0.5 border border-white/5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-rose-600 to-rpg-hp h-full rounded-full shadow-hp-glow transition-all duration-500 ease-out"
                style={{ width: `${hpPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* XP Stat */}
          <div className="flex flex-col gap-2 bg-white/5 border border-white/5 p-3 rounded-xl">
            <div className="flex justify-between items-center text-sm">
              <div className="flex items-center gap-1.5 text-rpg-xp font-semibold">
                <Award className="w-4 h-4 animate-spin-slow text-rpg-xp" />
                <span>EXP PROGRESS</span>
              </div>
              <span className="font-mono text-xs text-rpg-xp font-bold">{user.xp} / {xpNeeded}</span>
            </div>

            {/* XP Bar */}
            <div className="w-full bg-cosmic-darkest h-3.5 rounded-full p-0.5 border border-white/5 overflow-hidden">
              <div 
                className="bg-gradient-to-r from-cyan-500 to-rpg-xp h-full rounded-full shadow-xp-glow transition-all duration-500 ease-out"
                style={{ width: `${xpPercentage}%` }}
              ></div>
            </div>
          </div>

          {/* Gold Stat */}
          <div className="flex items-center justify-between bg-white/5 border border-white/5 p-3 rounded-xl relative overflow-hidden group">
            {/* Shimmer on hover */}
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out"></div>
            
            <div className="flex flex-col gap-1">
              <div className="flex items-center gap-1.5 text-rpg-gold text-sm font-semibold">
                <Coins className="w-4 h-4 text-rpg-gold animate-bounce" />
                <span>AURUM RESERVES</span>
              </div>
              <span className="text-xl font-bold font-mono text-rpg-gold leading-none mt-1">
                {user.gold.toLocaleString()} <span className="text-xs text-yellow-500/80 font-normal">GOLD</span>
              </span>
            </div>
            
            <button
              onClick={onReset}
              className="bg-purple-950/40 hover:bg-purple-900/60 text-purple-300 hover:text-white border border-purple-800/40 hover:border-purple-600 p-2.5 rounded-xl transition-all duration-200"
              title="Reset Adventure Data"
            >
              <RefreshCw className="w-4 h-4 hover:rotate-180 transition-transform duration-500" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default StatsPanel;
