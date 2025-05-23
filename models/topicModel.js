const mongoose = require('mongoose')
require('./subTopicModel') 

const topicSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
})

topicSchema.virtual('subTopics', {
  ref: 'SubTopic',
  localField: '_id',
  foreignField: 'topic',
  justOne: false,
})

topicSchema.set('toObject', { virtuals: true })
topicSchema.set('toJSON', { virtuals: true })

module.exports = mongoose.model('Topic', topicSchema)
