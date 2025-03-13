const mongoose = require('mongoose');

const IdeaSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please add a title'],
    trim: true,
    maxlength: [100, 'Title cannot be more than 100 characters']
  },
  description: {
    type: String,
    trim: true,
    maxlength: [500, 'Description cannot be more than 500 characters']
  },
  status: {
    type: String,
    enum: ['New', 'In Progress', 'Completed', 'On Hold', 'Cancelled'],
    default: 'New'
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Critical'],
    default: 'Medium'
  },
  owner: {
    type: String,
    trim: true,
    default: 'Unassigned'
  },
  eta: {
    type: String,
    trim: true,
    default: ''
  },
  region: {
    type: String,
    trim: true,
    default: 'Global'
  },
  businessFunction: {
    type: String,
    trim: true,
    default: ''
  },
  application: {
    type: String,
    trim: true,
    default: ''
  },
  stackRank: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  },
  order: {
    type: Number,
    default: 0
  }
}, {
  // Enable virtuals
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
  // Disable version key
  versionKey: false
});

// Update the updatedAt field on save
IdeaSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

// Update the updatedAt field on update
IdeaSchema.pre('findOneAndUpdate', function(next) {
  this.set({ updatedAt: Date.now() });
  next();
});

module.exports = mongoose.model('Idea', IdeaSchema);
