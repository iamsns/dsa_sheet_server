const mongoose = require('mongoose')
require('./authModel') 

const subTopicStatusSchema = new mongoose.Schema({
  subTopicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SubTopic',
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Done'],
    default: 'Pending',
  }
}, { _id: false })


const userProgressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  topicId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Topic',
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Done'],
    default: 'Pending',
  },
  subTopics: [subTopicStatusSchema],
}, { timestamps: true })

module.exports = mongoose.model('UserProgress', userProgressSchema)
