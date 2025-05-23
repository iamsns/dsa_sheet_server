const mongoose = require('mongoose')

const subTopicSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true 
    },
    leetCodeLink: String,
    youtubeLink: String,
    articleLink: String,
    level: { 
        type: String, 
        enum: ['EASY', 'MEDIUM', 'HARD'], 
        default: 'EASY' 
    },
    isChecked: { 
        type: Boolean, 
        default: false 
    },
    topic: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Topic', 
        required: true
    }
})

module.exports = mongoose.model('SubTopic', subTopicSchema)
