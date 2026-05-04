const mongoose = require('mongoose');

const messageSchema = new mongoose.Schema({
  user:       { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  subject:    { type: String, required: true },
  thread: [{
    sender:    { type: String, enum: ['user','admin'], required: true },
    text:      { type: String, required: true },
    sentAt:    { type: Date, default: Date.now },
  }],
  status:     { type: String, enum: ['open','replied','closed'], default: 'open' },
  isReadByAdmin: { type: Boolean, default: false },
  isReadByUser:  { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model('Message', messageSchema);
