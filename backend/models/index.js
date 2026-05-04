const mongoose = require('mongoose');

// ── Service ──────────────────────────────────────────────────────────────────
const serviceSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  category:    { type: String, required: true, enum: ['Digital Marketing', 'Visual & Communication', 'Tech Solution'] },
  description: { type: String, required: true },
  icon:        { type: String, default: '⚡' },
  features:    [String],
  isActive:    { type: Boolean, default: true },
  order:       { type: Number, default: 0 },
}, { timestamps: true });

// ── Portfolio ────────────────────────────────────────────────────────────────
const portfolioSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  category:    { type: String, required: true },
  description: { type: String, required: true },
  imageUrl:    { type: String, required: true },
  clientName:  { type: String },
  projectUrl:  { type: String },
  tags:        [String],
  isFeatured:  { type: Boolean, default: false },
  isActive:    { type: Boolean, default: true },
  completedAt: { type: Date },
}, { timestamps: true });

// ── Team Member ───────────────────────────────────────────────────────────────
const teamSchema = new mongoose.Schema({
  name:       { type: String, required: true },
  role:       { type: String, required: true },
  bio:        { type: String },
  imageUrl:   { type: String },
  email:      { type: String },
  linkedin:   { type: String },
  facebook:   { type: String },
  order:      { type: Number, default: 0 },
  isActive:   { type: Boolean, default: true },
}, { timestamps: true });

// ── Testimonial ───────────────────────────────────────────────────────────────
const testimonialSchema = new mongoose.Schema({
  clientName:    { type: String, required: true },
  clientRole:    { type: String },
  clientCompany: { type: String },
  clientImage:   { type: String },
  message:       { type: String, required: true },
  rating:        { type: Number, min: 1, max: 5, default: 5 },
  isFeatured:    { type: Boolean, default: false },
  isActive:      { type: Boolean, default: true },
}, { timestamps: true });

// ── Blog Post ─────────────────────────────────────────────────────────────────
const blogSchema = new mongoose.Schema({
  title:       { type: String, required: true },
  slug:        { type: String, unique: true },
  excerpt:     { type: String, required: true },
  content:     { type: String, required: true },
  coverImage:  { type: String },
  author:      { type: String, default: 'BrandLift Team' },
  tags:        [String],
  category:    { type: String },
  isPublished: { type: Boolean, default: false },
  publishedAt: { type: Date },
  views:       { type: Number, default: 0 },
}, { timestamps: true });

blogSchema.pre('save', function (next) {
  if (this.isModified('title') && !this.slug) {
    this.slug = this.title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  }
  if (this.isPublished && !this.publishedAt) this.publishedAt = new Date();
  next();
});

// ── Pricing ───────────────────────────────────────────────────────────────────
const pricingSchema = new mongoose.Schema({
  name:        { type: String, required: true },
  price:       { type: Number, required: true },
  currency:    { type: String, default: 'BDT' },
  period:      { type: String, default: 'month' },
  description: { type: String },
  features:    [String],
  isPopular:   { type: Boolean, default: false },
  isActive:    { type: Boolean, default: true },
  order:       { type: Number, default: 0 },
  category:    { type: String },
}, { timestamps: true });

// ── Contact ───────────────────────────────────────────────────────────────────
const contactSchema = new mongoose.Schema({
  name:     { type: String, required: true },
  email:    { type: String, required: true },
  phone:    { type: String },
  subject:  { type: String, required: true },
  message:  { type: String, required: true },
  status:   { type: String, enum: ['new', 'read', 'replied', 'closed'], default: 'new' },
  note:     { type: String },
}, { timestamps: true });

// ── Site Settings ─────────────────────────────────────────────────────────────
const settingsSchema = new mongoose.Schema({
  key:   { type: String, required: true, unique: true },
  value: { type: mongoose.Schema.Types.Mixed },
  group: { type: String, default: 'general' },
});

module.exports = {
  Service:     mongoose.model('Service', serviceSchema),
  Portfolio:   mongoose.model('Portfolio', portfolioSchema),
  Team:        mongoose.model('Team', teamSchema),
  Testimonial: mongoose.model('Testimonial', testimonialSchema),
  Blog:        mongoose.model('Blog', blogSchema),
  Pricing:     mongoose.model('Pricing', pricingSchema),
  Contact:     mongoose.model('Contact', contactSchema),
  Settings:    mongoose.model('Settings', settingsSchema),
};
