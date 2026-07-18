const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName:         { type: String, required: true, trim: true },
  lastName:          { type: String, required: true, trim: true },
  email:             { type: String, required: true, unique: true, lowercase: true, trim: true },
  password:          { type: String, required: true, select: false },
  phone:             { type: String, default: '' },
  role:              { type: String, enum: ['Buyer', 'Realtor', 'Hotel', 'Admin'], default: 'Buyer' },
  onboardingDone:    { type: Boolean, default: false },
  onboardingAnswers: { type: mongoose.Schema.Types.Mixed, default: {} },
  subscriptionPlan:  { type: String, enum: ['basic', 'plus', 'premium', 'super'], default: 'basic' },
  subscriptionExpiry:{ type: Date, default: null },
}, { timestamps: true });

// Hash password before saving
userSchema.pre('save', async function () {
  if (!this.isModified('password')) return;
  this.password = await bcrypt.hash(this.password, 12);
});

// Instance method to check password
userSchema.methods.correctPassword = async function (candidatePassword, userPassword) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

module.exports = mongoose.model('User', userSchema);