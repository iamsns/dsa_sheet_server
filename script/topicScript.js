const mongoose = require('mongoose')
const dotenv = require('dotenv')
const fs = require('fs')
const path = require('path')

const Topic = require('../models/topicModel')
const SubTopic = require('../models/subTopicModel')
const UserProgress = require('../models/userProgressModel')

dotenv.config()
const rawTopics = JSON.parse(
  fs.readFileSync(path.join(__dirname, 'topics.json'), 'utf-8')
)

async function importData() {
  try {
    await Topic.deleteMany()
    await SubTopic.deleteMany()
    await UserProgress.deleteMany()

    for (const rawTopic of rawTopics) {
      const createdTopic = await Topic.create({
        name: rawTopic.name,
        status: rawTopic.status || 'Pending'
      })

      const subTopicsWithRef = rawTopic.subTopics.map(sub => ({
        ...sub,
        topic: createdTopic._id
      }))

      await SubTopic.insertMany(subTopicsWithRef)
    }

    console.log("++++++++ Data import successful +++++++")
  } catch (err) {
    console.error("Import error", err)
  }
}

async function deleteData() {
  try {
    await Topic.deleteMany()
    await SubTopic.deleteMany()
    await UserProgress.deleteMany()
    console.log("Data deletion successful")
  } catch (err) {
    console.error("Delete error ", err)
  }
}

module.exports = { importData, deleteData };