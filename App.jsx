import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Sparkles, Terminal, Info, ShieldAlert, Award } from 'lucide-react';
import StatsPanel from './components/StatsPanel';
import TaskForm from './components/TaskForm';
import TaskCard from './components/TaskCard';

const API_BASE = 'http://localhost:5000/api';

const App = () => {
  const [user, setUser] = useState({
    username: 'Cosmic Adventurer',
    hp: 100,
    xp: 0,
    level: 1,
    gold: 0
  });
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [completingId, setCompletingId] = useState(null);
  
  // Game FX Screen States
  const [levelUpTrigger, setLevelUpTrigger] = useState(false);
  const [faintTrigger, setFaintTrigger] = useState(false);
  const [recentRewards, setRecentRewards] = useState(null);
  const [consoleLogs, setConsoleLogs] = useState([
    'Initializing quantum space interface...',
    'Beacon connected to local sector.'
  ]);

  // Push messages to simulated cockpit console
  const addLog = (message) => {
    setConsoleLogs((prev) => [
      `[${new Date().toLocaleTimeString()}] ${message}`,
      ...prev.slice(0, 7) // keep last 8 lines
    ]);
  };

  // Fetch initial profile and active quests
  useEffect(() => {
    const initGame = async () => {
      try {
        setLoading(true);
        // Fetch User profile
        const userRes = await fetch(`${API_BASE}/user`);
        const userData = await userRes.json();
        setUser(userData);

        // Fetch Tasks list
        const tasksRes = await fetch(`${API_BASE}/tasks`);
        const tasksData = await tasksRes.json();
        setTasks(tasksData);

        addLog(`System ready. Adventurer: ${userData.username} initialized.`);
      } catch (err) {
        console.error('Error starting game server API:', err);
        addLog('⚠️ API Sync failure. Running in simulated offline hyper-drive.');
      } finally {
        setLoading(false);
      }
    };

    initGame();
  }, []);

  // Action: Add new Quest
  const handleAddTask = async (title, difficulty) => {
    try {
      const res = await fetch(`${API_BASE}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title, difficulty })
      });
      if (!res.ok) throw new Error('API abort');
      const newTask = await res.json();
      
      setTasks((prev) => [newTask, ...prev]);
      addLog(`✨ Transmitted Quest: [${title}] successfully registered to the sector.`);
      return true;
    } catch (err) {
      console.error(err);
      addLog('❌ Outpost transmission failed. Unable to register quest.');
      return false;
    }
  };

  // Action: Complete Quest
  const handleCompleteTask = async (id, difficulty) => {
    setCompletingId(id);
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}/complete`, {
        method: 'POST'
      });
      if (!res.ok) throw new Error('Complete failed');
      const data = await res.json();

      // Show rewards pop
      setRecentRewards({
        xp: data.rewards.xp,
        gold: data.rewards.gold,
        difficulty
      });

      // Update User stats
      setUser(data.user);
      
      // Level Up FX trigger
      if (data.rewards.leveledUp) {
        setLevelUpTrigger(true);
        addLog(`🎉 LEVEL UP! Reached Level ${data.user.level}! HP restored.`);
        setTimeout(() => setLevelUpTrigger(false), 3000);
      } else {
        addLog(`🚀 Resolved Quest. Earned +${data.rewards.xp} XP and +${data.rewards.gold} Gold.`);
      }

      // Fade rewards indicator
      setTimeout(() => setRecentRewards(null), 2500);

      // Remove from list (trigger exit animation)
      setTasks((prev) => prev.filter((t) => t._id !== id));
    } catch (err) {
      console.error(err);
      addLog('❌ Resolving anomaly failed. Stardust transaction aborted.');
    } finally {
      setCompletingId(null);
    }
  };

  // Action: Delete/Abort Quest (HP Penalty)
  const handleDeleteTask = async (id) => {
    try {
      const res = await fetch(`${API_BASE}/tasks/${id}`, {
        method: 'DELETE'
      });
      if (!res.ok) throw new Error('Delete failed');
      const data = await res.json();

      setUser(data.user);
      setTasks((prev) => prev.filter((t) => t._id !== id));

      if (data.damageTaken > 0) {
        if (data.fainted) {
          setFaintTrigger(true);
          addLog(`💀 GRAV-DECAY CRITICAL: HP depleted. Cloned at Outpost. Lost 50% gold.`);
          setTimeout(() => setFaintTrigger(false), 4000);
        } else {
          addLog(`💥 Suffer ${data.damageTaken} gravity damage for abandoning quest sector!`);
        }
      } else {
        addLog('Archived quest trace scrubbed.');
      }
    } catch (err) {
      console.error(err);
      addLog('❌ Quantum decay failed. Unable to scrub quest.');
    }
  };

  // Action: Full Reset (DB and Stats Wiped)
  const handleReset = async () => {
    if (!window.confirm('Wipe simulation timeline? This resets level, items, gold, and re-seeds quests.')) return;
    
    try {
      setLoading(true);
      const res = await fetch(`${API_BASE}/user/reset`, {
        method: 'POST'
      });
      const data = await res.json();

      setUser(data.user);
      
      // Re-fetch remaining seeded tasks
      const tasksRes = await fetch(`${API_BASE}/tasks`);
      const tasksData = await tasksRes.json();
      setTasks(tasksData);

      addLog('🌌 Time-stream rewritten. Cosmic timeline re-seeded.');
    } catch (err) {
      console.error(err);
      addLog('❌ Paradox detected. Temporal reset blocked.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-height-screen pb-16 z-10 px-4 md:px-8 max-w-7xl mx-auto pt-8">
      {/* Starfield Backdrop (animated CSS shifts) */}
      <div className="starfield"></div>

      {/* 1. Header Stats Panel */}
      <StatsPanel user={user} onReset={handleReset} />

      {/* Rewards Micro-notification Popup */}
      <AnimatePresence>
        {recentRewards && (
          <motion.div
            initial={{ opacity: 0, y: 15, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            className="fixed top-24 left-1/2 transform -translate-x-1/2 z-50 glass-panel px-6 py-3 border-rpg-gold text-center shadow-gold-glow flex items-center gap-3 bg-black/80"
          >
            <Sparkles className="w-5 h-5 text-rpg-gold animate-spin-slow" />
            <div className="text-sm font-mono tracking-wide">
              QUEST RESOLVED! Eearned:{' '}
              <span className="text-rpg-xp font-bold">+{recentRewards.xp} XP</span> and{' '}
              <span className="text-rpg-gold font-bold">+{recentRewards.gold}G</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cosmic Game Overlay Effects */}
      <AnimatePresence>
        {/* Level Up Splash */}
        {levelUpTrigger && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-cosmic-darkest/90 backdrop-blur-md z-50 flex flex-col items-center justify-center text-center p-6"
          >
            <motion.div
              initial={{ scale: 0.5, rotate: -15, opacity: 0 }}
              animate={{ scale: 1, rotate: 0, opacity: 1, transition: { type: 'spring', damping: 10 } }}
              exit={{ scale: 0.8, opacity: 0 }}
              className="flex flex-col items-center"
            >
              <div className="relative w-36 h-36 rounded-full border-4 border-rpg-xp flex items-center justify-center shadow-xp-glow mb-6 bg-purple-950/20">
                <Award className="w-20 h-20 text-rpg-xp animate-bounce" />
                <div className="absolute inset-0 border-4 border-t-rpg-gold border-transparent rounded-full animate-spin"></div>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold tracking-widest text-transparent bg-clip-text bg-gradient-to-r from-rpg-xp via-white to-rpg-level mb-4 drop-shadow-md animate-pulse">
                LEVEL UP!
              </h1>
              <p className="text-lg md:text-xl font-mono text-purple-200 uppercase tracking-widest max-w-md">
                Stellar Resonance Attained! health fully restored.
              </p>
            </motion.div>
          </motion.div>
        )}

        {/* Fainted (Dead) Splash */}
        {faintTrigger && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-red-950/85 backdrop-blur-md z-50 flex flex-col items-center justify-center text-center p-6"
          >
            <motion.div
              initial={{ scale: 0.7, opacity: 0 }}
              animate={{ scale: 1, opacity: 1, transition: { duration: 0.4 } }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="flex flex-col items-center"
            >
              <div className="w-24 h-24 rounded-full border-4 border-rose-500 flex items-center justify-center shadow-hp-glow mb-6 bg-black/60">
                <ShieldAlert className="w-12 h-12 text-rose-500 animate-pulse" />
              </div>
              <h1 className="text-4xl md:text-6xl font-extrabold tracking-wider text-rose-500 mb-4 uppercase">
                Crest Destabilized
              </h1>
              <p className="text-md md:text-lg font-mono text-rose-200/90 tracking-widest max-w-lg mb-2">
                Quantum gravity pressure exceeded. Avatar reconstructed.
              </p>
              <span className="text-xs font-mono bg-black/40 text-rose-400 border border-rose-900/30 px-3.5 py-1.5 rounded-full mt-4">
                PENALTY: -50% AURUM RESERVES & SECTOR PROGRESS WIPED
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Grid: Quest Builder + Active Quests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        {/* Left Side Column: Quest Board Creator & Cockpit Logs */}
        <div className="lg:col-span-1 flex flex-col gap-6">
          <TaskForm onAddTask={handleAddTask} />

          {/* Simulated Cockpit Console / Logs (Highly RPG Immersive!) */}
          <div className="glass-panel p-5 border-white/5 bg-black/30 font-mono text-xs text-purple-300 relative overflow-hidden">
            <div className="absolute top-2 right-3 flex items-center gap-1.5 text-[9px] font-bold text-rpg-xp">
              <Terminal className="w-3.5 h-3.5 text-rpg-xp" />
              <span>COCKPIT TRANSCEIVER</span>
            </div>
            
            <h4 className="text-white/60 font-bold mb-3 border-b border-white/5 pb-1 flex items-center gap-1.5">
              <span>QUANTUM EVENT LOGS</span>
            </h4>
            
            <div className="space-y-1.5 min-h-36 max-h-36 overflow-y-auto pr-2 scrollbar-none flex flex-col-reverse justify-end">
              {consoleLogs.map((log, index) => (
                <div 
                  key={index} 
                  className={`leading-relaxed tracking-wide truncate ${
                    index === 0 ? 'text-rpg-xp font-bold animate-pulse' : 'text-purple-300/60'
                  }`}
                >
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Right Side Column: Active Quest Deck Grid */}
        <div className="lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h3 className="text-lg font-bold tracking-widest text-white/80 font-mono flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-rpg-xp animate-pulse shadow-xp-glow"></span>
              ACTIVE STELLAR DECK ({tasks.length})
            </h3>
            
            <div className="text-[10px] font-mono text-purple-400 flex items-center gap-1 bg-white/5 px-2.5 py-1 rounded-full border border-white/5">
              <Info className="w-3 h-3 text-purple-400" />
              <span>Aborting active quests inflicts gravity decay damage.</span>
            </div>
          </div>

          {loading ? (
            <div className="glass-panel p-20 flex flex-col items-center justify-center text-center gap-4">
              <div className="w-12 h-12 border-t-2 border-r-2 border-rpg-xp border-transparent rounded-full animate-spin"></div>
              <p className="text-sm font-mono text-purple-300 tracking-wider">ALIGNING ORBITAL TELEMETRIES...</p>
            </div>
          ) : tasks.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="glass-panel p-16 flex flex-col items-center justify-center text-center gap-4 border-dashed border-white/10"
            >
              <span className="text-5xl animate-bounce">🪐</span>
              <h4 className="text-base font-bold text-white font-mono tracking-wider">ALL SECTORS SECURED</h4>
              <p className="text-xs text-purple-300/60 max-w-sm font-mono leading-relaxed">
                Stellar deck is empty. Log a new quest to jumpstart the zero-gravity thrusters.
              </p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <AnimatePresence mode="popLayout">
                {tasks.map((task) => (
                  <TaskCard
                    key={task._id}
                    task={task}
                    onComplete={handleCompleteTask}
                    onDelete={handleDeleteTask}
                    completingId={completingId}
                  />
                ))}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
