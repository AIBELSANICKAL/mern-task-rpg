import React, { useState } from 'react';
import { PlusCircle, Compass, Rocket } from 'lucide-react';

const DIFFICULTIES = [
  { value: 'Easy', label: 'Easy (Green Sector)', color: 'text-emerald-400 border-emerald-500/30 hover:border-emerald-400 bg-emerald-500/5', activeColor: 'bg-emerald-500/20 border-emerald-400 text-emerald-300 ring-emerald-500/30 shadow-emerald-500/10' },
  { value: 'Medium', label: 'Medium (Nebula Ring)', color: 'text-cyan-400 border-cyan-500/30 hover:border-cyan-400 bg-cyan-500/5', activeColor: 'bg-cyan-500/20 border-cyan-400 text-cyan-300 ring-cyan-500/30 shadow-cyan-500/10' },
  { value: 'Hard', label: 'Hard (Void Core)', color: 'text-fuchsia-400 border-fuchsia-500/30 hover:border-fuchsia-400 bg-fuchsia-500/5', activeColor: 'bg-fuchsia-500/20 border-fuchsia-400 text-fuchsia-300 ring-fuchsia-500/30 shadow-fuchsia-500/10' },
  { value: 'Epic', label: 'Epic (Event Horizon)', color: 'text-amber-400 border-amber-500/30 hover:border-amber-400 bg-amber-500/5', activeColor: 'bg-amber-500/20 border-amber-400 text-amber-300 ring-amber-500/30 shadow-amber-500/10 shadow-gold-glow' }
];

const TaskForm = ({ onAddTask }) => {
  const [title, setTitle] = useState('');
  const [difficulty, setDifficulty] = useState('Easy');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;

    setIsSubmitting(true);
    const success = await onAddTask(title, difficulty);
    if (success) {
      setTitle('');
      setDifficulty('Easy');
    }
    setIsSubmitting(false);
  };

  // Get active border shadow based on selected difficulty
  const getPanelGlow = () => {
    switch (difficulty) {
      case 'Easy': return 'border-emerald-500/20 shadow-emerald-500/5';
      case 'Medium': return 'border-cyan-500/20 shadow-cyan-500/5';
      case 'Hard': return 'border-fuchsia-500/20 shadow-fuchsia-500/5';
      case 'Epic': return 'border-amber-500/40 shadow-amber-500/15 shadow-cosmic-glow';
      default: return 'border-cosmic-border';
    }
  };

  return (
    <div className={`glass-panel p-6 mb-8 transition-all duration-300 ${getPanelGlow()} border relative`}>
      {/* Decorative Star Radar Grid */}
      <div className="absolute top-4 right-4 text-purple-500/20 pointer-events-none">
        <Compass className="w-12 h-12 animate-spin-slow" />
      </div>

      <div className="flex items-center gap-2 mb-4">
        <Rocket className="w-5 h-5 text-rpg-xp animate-bounce" />
        <h3 className="text-base md:text-lg font-bold tracking-wide text-transparent bg-clip-text bg-gradient-to-r from-white to-purple-300">
          LOG STELLAR QUEST
        </h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-5">
        {/* Quest Title Input */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold font-mono text-purple-300/80 tracking-wider">
            QUEST DESCRIPTION / DESCRIPTION
          </label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g. Recalibrate antimatter reactors, Harvest cosmic dust from orbit..."
            className="cosmic-input w-full"
            maxLength={100}
            required
            disabled={isSubmitting}
          />
        </div>

        {/* Quest Difficulty Selector */}
        <div className="flex flex-col gap-2">
          <label className="text-xs font-semibold font-mono text-purple-300/80 tracking-wider">
            SECTOR DIFFICULTY & DANGER SPECIFICATION
          </label>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {DIFFICULTIES.map((d) => {
              const isActive = difficulty === d.value;
              return (
                <button
                  key={d.value}
                  type="button"
                  onClick={() => setDifficulty(d.value)}
                  disabled={isSubmitting}
                  className={`flex flex-col items-center justify-center p-3 rounded-xl border text-center font-mono transition-all duration-200 text-xs font-bold ${
                    isActive ? d.activeColor : d.color
                  } active:scale-95`}
                >
                  <span>{d.value}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={!title.trim() || isSubmitting}
          className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 via-cosmic-glow to-indigo-600 hover:from-purple-500 hover:to-indigo-500 disabled:from-purple-950/20 disabled:to-indigo-950/20 disabled:text-purple-400/40 text-white font-bold py-3 rounded-xl transition-all duration-300 border border-purple-500/20 hover:border-purple-400 hover:shadow-cosmic-glow disabled:border-transparent active:scale-[0.98]"
        >
          <PlusCircle className="w-4 h-4" />
          <span>{isSubmitting ? 'CHRONICLING QUEST...' : 'TRANSMIT NEW QUEST'}</span>
        </button>
      </form>
    </div>
  );
};

export default TaskForm;
