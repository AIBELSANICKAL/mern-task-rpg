const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Models (loaded conditionally or used directly)
const User = require('./models/User');
const Task = require('./models/Task');

// RPG Progression Configurations
const REWARDS = {
  Easy: { xp: 10, gold: 5 },
  Medium: { xp: 20, gold: 10 },
  Hard: { xp: 45, gold: 25 },
  Epic: { xp: 100, gold: 60 }
};

const HP_PENALTY = 15; // Damage taken for deleting a pending quest

// Simulation Mode (Fallback) state
let isMockMode = false;
let mockUser = {
  _id: 'cosmic-avatar-id',
  username: 'Cosmic Adventurer',
  hp: 100,
  xp: 0,
  level: 1,
  gold: 0
};

let mockTasks = [
  { _id: 'quest-1', title: 'Navigate through Astroid Swarms', difficulty: 'Easy', status: 'pending' },
  { _id: 'quest-2', title: 'Exterminate the Nebular Parasites', difficulty: 'Medium', status: 'pending' },
  { _id: 'quest-3', title: 'Subdue the Black Hole Horizon Singularity', difficulty: 'Epic', status: 'pending' }
];

// Helper to level up character if XP threshold crossed
const applyProgression = (user, xpGain, goldGain) => {
  user.xp += xpGain;
  user.gold += goldGain;
  
  let leveledUp = false;
  let xpNeeded = user.level * 100;
  
  while (user.xp >= xpNeeded) {
    user.xp -= xpNeeded;
    user.level += 1;
    user.hp = 100; // Complete heal on level up!
    leveledUp = true;
    xpNeeded = user.level * 100;
  }
  
  return leveledUp;
};

// Helper to handle HP loss and death/fainting
const applyDamage = (user, damage) => {
  user.hp = Math.max(0, user.hp - damage);
  let fainted = false;
  
  if (user.hp <= 0) {
    fainted = true;
    user.level = 1;
    user.xp = 0;
    user.gold = Math.floor(user.gold / 2); // Penalty: lose half gold
    user.hp = 100; // Resurrection
  }
  
  return fainted;
};

// Database Connection
const mongoURI = process.env.MONGO_URI || 'mongodb://localhost:27017/cosmic-rpg';
console.log('Connecting to MongoDB...');

mongoose.connect(mongoURI, {
  serverSelectionTimeoutMS: 2500 // Quick timeout to fallback if no DB active
})
.then(async () => {
  console.log('🌌 Connected to Space Crypt (MongoDB Success!)');
  // Seed initial user if none exists
  try {
    const userCount = await User.countDocuments();
    if (userCount === 0) {
      await User.create({ username: 'Cosmic Adventurer' });
      console.log('💫 Initial Cosmic Adventurer profile generated in database.');
    }
  } catch (err) {
    console.error('Error seeding user:', err);
  }
})
.catch(err => {
  console.warn('\n⚠️  MongoDB connection timed out or failed.');
  console.warn('🌌 ACTIVATING COSMIC SIMULATION MODE (In-Memory Database Enabled)');
  console.warn('💡 You can run the app immediately! Changes will persist in memory.\n');
  isMockMode = true;
});

// --- API ROUTES ---

// 1. GET User Stats
app.get('/api/user', async (req, res) => {
  try {
    if (isMockMode) {
      return res.json(mockUser);
    }
    
    let user = await User.findOne();
    if (!user) {
      user = await User.create({ username: 'Cosmic Adventurer' });
    }
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch adventurer profile.' });
  }
});

// 2. POST Reset Profile & Tasks (Wipe)
app.post('/api/user/reset', async (req, res) => {
  try {
    if (isMockMode) {
      mockUser = {
        _id: 'cosmic-avatar-id',
        username: 'Cosmic Adventurer',
        hp: 100,
        xp: 0,
        level: 1,
        gold: 0
      };
      mockTasks = [
        { _id: 'quest-1', title: 'Navigate through Astroid Swarms', difficulty: 'Easy', status: 'pending' },
        { _id: 'quest-2', title: 'Exterminate the Nebular Parasites', difficulty: 'Medium', status: 'pending' },
        { _id: 'quest-3', title: 'Subdue the Black Hole Horizon Singularity', difficulty: 'Epic', status: 'pending' }
      ];
      return res.json({ user: mockUser, message: 'Simulation reset complete.' });
    }

    // MongoDB Mode
    await User.deleteMany({});
    await Task.deleteMany({});
    
    const user = await User.create({ username: 'Cosmic Adventurer' });
    
    // Seed default tasks
    await Task.create([
      { title: 'Navigate through Astroid Swarms', difficulty: 'Easy' },
      { title: 'Exterminate the Nebular Parasites', difficulty: 'Medium' },
      { title: 'Subdue the Black Hole Horizon Singularity', difficulty: 'Epic' }
    ]);

    res.json({ user, message: 'Database wiped and re-seeded successfully.' });
  } catch (err) {
    res.status(500).json({ error: 'Reset anomaly detected.' });
  }
});

// 3. GET Active Tasks
app.get('/api/tasks', async (req, res) => {
  try {
    if (isMockMode) {
      return res.json(mockTasks.filter(t => t.status === 'pending'));
    }
    const tasks = await Task.find({ status: 'pending' }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch cosmic quests.' });
  }
});

// 4. POST Create New Task
app.post('/api/tasks', async (req, res) => {
  const { title, difficulty } = req.body;
  if (!title || !difficulty) {
    return res.status(400).json({ error: 'A quest requires a Title and Difficulty classification.' });
  }

  try {
    if (isMockMode) {
      const newTask = {
        _id: 'quest-' + Date.now(),
        title,
        difficulty,
        status: 'pending'
      };
      mockTasks.push(newTask);
      return res.status(201).json(newTask);
    }

    const newTask = await Task.create({ title, difficulty });
    res.status(201).json(newTask);
  } catch (err) {
    res.status(500).json({ error: 'Failed to record quest logs.' });
  }
});

// 5. POST Complete Task (RPG Logic)
app.post('/api/tasks/:id/complete', async (req, res) => {
  const taskId = req.params.id;
  
  try {
    let taskDifficulty = 'Easy';
    let taskTitle = '';

    if (isMockMode) {
      const taskIndex = mockTasks.findIndex(t => t._id === taskId);
      if (taskIndex === -1) {
        return res.status(404).json({ error: 'Quest not found in simulation archives.' });
      }
      
      if (mockTasks[taskIndex].status === 'completed') {
        return res.status(400).json({ error: 'Quest is already completed.' });
      }
      
      mockTasks[taskIndex].status = 'completed';
      taskDifficulty = mockTasks[taskIndex].difficulty;
      taskTitle = mockTasks[taskIndex].title;
    } else {
      // MongoDB
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ error: 'Quest not found in database scrolls.' });
      }
      if (task.status === 'completed') {
        return res.status(400).json({ error: 'Quest is already completed.' });
      }
      
      task.status = 'completed';
      await task.save();
      taskDifficulty = task.difficulty;
      taskTitle = task.title;
    }

    // Award Progression
    const reward = REWARDS[taskDifficulty] || REWARDS.Easy;
    let user;
    let leveledUp = false;

    if (isMockMode) {
      leveledUp = applyProgression(mockUser, reward.xp, reward.gold);
      user = { ...mockUser };
    } else {
      user = await User.findOne();
      if (!user) {
        user = new User({ username: 'Cosmic Adventurer' });
      }
      leveledUp = applyProgression(user, reward.xp, reward.gold);
      await user.save();
    }

    res.json({
      message: `Quest Completed! Earned rewards for [${taskTitle}].`,
      rewards: {
        xp: reward.xp,
        gold: reward.gold,
        leveledUp
      },
      user,
      taskId
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Progression calculation error.' });
  }
});

// 6. DELETE Task (Inflicts Damage if Pending)
app.delete('/api/tasks/:id', async (req, res) => {
  const taskId = req.params.id;

  try {
    let wasPending = false;
    let taskTitle = '';

    if (isMockMode) {
      const taskIndex = mockTasks.findIndex(t => t._id === taskId);
      if (taskIndex === -1) {
        return res.status(404).json({ error: 'Quest not found in simulation archives.' });
      }
      wasPending = mockTasks[taskIndex].status === 'pending';
      taskTitle = mockTasks[taskIndex].title;
      // Remove task
      mockTasks = mockTasks.filter(t => t._id !== taskId);
    } else {
      const task = await Task.findById(taskId);
      if (!task) {
        return res.status(404).json({ error: 'Quest not found in database scrolls.' });
      }
      wasPending = task.status === 'pending';
      taskTitle = task.title;
      await Task.findByIdAndDelete(taskId);
    }

    // If task was pending, take gravity damage!
    let damageTaken = 0;
    let fainted = false;
    let user;

    if (wasPending) {
      damageTaken = HP_PENALTY;
      if (isMockMode) {
        fainted = applyDamage(mockUser, damageTaken);
        user = { ...mockUser };
      } else {
        user = await User.findOne();
        if (!user) {
          user = new User({ username: 'Cosmic Adventurer' });
        }
        fainted = applyDamage(user, damageTaken);
        await user.save();
      }
    } else {
      // Just fetch user
      if (isMockMode) {
        user = { ...mockUser };
      } else {
        user = await User.findOne();
        await user.save();
      }
    }

    res.json({
      message: wasPending 
        ? `Quest aborted! You suffered ${damageTaken} gravity damage for abandoning [${taskTitle}].` 
        : `Archived quest removed.`,
      damageTaken,
      fainted,
      user
    });
  } catch (err) {
    res.status(500).json({ error: 'Quest destruction anomaly.' });
  }
});

// Start Server
app.listen(PORT, () => {
  console.log(`📡 Cosmic Beacon listening on hyperwave port ${PORT}`);
});
