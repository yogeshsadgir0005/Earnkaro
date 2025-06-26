// controllers/userController.js
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// ✅ Get Logged-in User Profile
const getProfile = async (req, res) => {
  res.json(req.user);
};

// ✅ Update User Profile
const updateProfile = async (req, res) => {
  const { name, contact, upiId, bank } = req.body;

  try {
    const updated = await User.findByIdAndUpdate(
      req.user._id,
      {
        ...(name && { name }),
        ...(contact && { contact }),
        ...(upiId && { upiId }),
        ...(bank && { bank }),
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error("Update Error:", err.message);
    res.status(500).json({ message: 'Update failed', error: err.message });
  }
};

// ✅ Get Rewards
const getRewards = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('rewards');
    const rewards = user.rewards || [];

    const taskRewards = rewards.filter(
      r => !r.title.toLowerCase().includes('referral')
    );

    const totalEarned = rewards.reduce(
      (sum, r) => r.credited && r.status === 'completed' ? sum + (r.amount || 0) : sum,
      0
    );

    res.status(200).json({ rewards, taskRewards, totalEarned });
  } catch (err) {
    console.error("Rewards Fetch Error:", err.message);
    res.status(500).json({ message: 'Failed to fetch rewards' });
  }
};

// ✅ Get Referrals
const getReferrals = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('referralCode referrals rewards');
    const referralRewards = user.rewards || [];

    const referralEarnings = referralRewards
      .filter(r => r.title.toLowerCase().includes('referral') && r.credited && r.status === 'completed')
      .reduce((sum, r) => sum + (r.amount || 0), 0);

    res.status(200).json({
      referralCode: user.referralCode,
      referrals: user.referrals,
      points: referralEarnings
    });
  } catch (err) {
    console.error("Referrals Error:", err.message);
    res.status(500).json({ message: 'Failed to fetch referrals' });
  }
};

// ✅ Get Leaderboard
const getLeaderboard = async (req, res) => {
  const range = req.query.range || 'overall';
  let startDate = null;

  if (range === 'weekly') {
    const now = new Date();
    startDate = new Date(now.setDate(now.getDate() - now.getDay()));
  } else if (range === 'monthly') {
    const now = new Date();
    startDate = new Date(now.getFullYear(), now.getMonth(), 1);
  }

  try {
    const users = await User.find({ isAdmin: { $ne: true } });

    const leaderboard = users.map(user => {
      const rewards = user.rewards || [];

      const filtered = startDate
        ? rewards.filter(r => new Date(r.createdAt) >= startDate)
        : rewards;

      const totalPoints = filtered.reduce(
        (sum, r) => r.credited && r.status === 'completed' ? sum + (r.amount || 0) : sum,
        0
      );

      return {
        _id: user._id,
        name: user.name,
        points: totalPoints
      };
    });

    leaderboard.sort((a, b) => b.points - a.points);
    leaderboard.forEach((u, i) => (u.rank = i + 1));

    let currentUser = null;
    const authHeader = req.headers.authorization;
    if (authHeader?.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      currentUser = leaderboard.find(u => u._id.toString() === decoded.id);
    }

    res.json({ top: leaderboard.slice(0, 10), currentUser });
  } catch (err) {
    console.error("Leaderboard Error:", err.message);
    res.status(500).json({ message: 'Failed to load leaderboard' });
  }
};

// ✅ Export all
module.exports = {
  getProfile,
  updateProfile,
  getRewards,
  getReferrals,
  getLeaderboard
};
