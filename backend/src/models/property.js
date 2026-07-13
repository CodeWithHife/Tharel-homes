const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema({
  name:        { type: String, required: true, trim: true },
  slug:        { type: String, required: true, unique: true, lowercase: true },
  location:    { type: String, required: true, trim: true },
  price:       { type: String, required: true },
  priceLabel:  { type: String, default: '' },
  type:        { type: String, required: true },
  beds:        { type: Number, default: null },
  baths:       { type: Number, default: null },
  size:        { type: String, default: '' },
  image:       { type: String, default: '' },
  gallery:     { type: [String], default: [] },
  description: { type: String, default: '' },
  features:    { type: [String], default: [] },
  phone:       { type: String, default: '' },
  realtorId:   { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  views:       { type: Number, default: 0 },
  featured:    { type: Boolean, default: false },
  status:      { type: String, enum: ['Active', 'Sold', 'Pending'], default: 'Active' },
}, { timestamps: true });

// Auto-generate slug from name before saving if not set
propertySchema.pre('validate', function (next) {
  if (!this.slug && this.name) {
    this.slug = this.name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
  }
  next();
});

module.exports = mongoose.model('Property', propertySchema);
