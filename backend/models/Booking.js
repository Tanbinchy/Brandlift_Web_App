const mongoose = require('mongoose');

const bookingSchema = new mongoose.Schema({
  user:        { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  service:     { type: mongoose.Schema.Types.ObjectId, ref: 'Service' },
  serviceName: { type: String, required: true },
  date:        { type: Date, required: true },
  time:        { type: String, required: true },
  message:     { type: String },
  status:      { type: String, enum: ['pending','confirmed','in-progress','completed','cancelled'], default: 'pending' },
  adminNote:   { type: String },
  // Invoice
  invoice: {
    amount:    { type: Number },
    currency:  { type: String, default: 'BDT' },
    isPaid:    { type: Boolean, default: false },
    paidAt:    { type: Date },
    invoiceNo: { type: String },
  },
}, { timestamps: true });

module.exports = mongoose.model('Booking', bookingSchema);
