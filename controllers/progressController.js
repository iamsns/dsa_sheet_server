const SubTopic = require("../models/subTopicModel");
const UserProgress = require("../models/userProgressModel");

exports.updateSubTopicStatus = async (req, res) => {
  try {
    const userId = req.userId;
    const { topicId, subTopicId, status } = req.body;

    if (!topicId || !subTopicId || !status) {
      return res.status(400).json({ message: 'topicId, subTopicId and status are required' });
    }

    
    const updateResult = await UserProgress.updateOne(
      { user: userId, topicId, 'subTopics.subTopicId': subTopicId },
      { $set: { 'subTopics.$.status': status } }
    );

    if (updateResult.matchedCount === 0) {
      await UserProgress.updateOne(
        { user: userId, topicId },
        { $addToSet: { subTopics: { subTopicId, status } } },
        { upsert: true }
      );
    }

    res.json({ message: 'SubTopic status updated successfully' });

  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: error.message });
  }
};

exports.updateTopicStatus = async (req, res) => {
  try {
    const userId = req.userId;
    const { topicId, status } = req.body;

    if (!topicId || !status) {
      return res.status(400).json({ message: 'topicId and status are required' });
    }

    const result = await UserProgress.updateOne(
      { user: userId, topicId },
      { $set: { status } },
      { upsert: true }
    );

    res.json({ message: 'Topic status updated successfully', result });
  } catch (error) {
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).json({ message: 'Invalid token' });
    }
    res.status(500).json({ message: error.message });
  }
};



exports.getProgressReport = async (req, res) => {
  try {
    const userId = req.userId;
    const userProgressList = await UserProgress.find({ user: userId }).lean();
    const doneSubTopicIds = [];

    userProgressList.forEach(up => {
      up.subTopics.forEach(st => {
        if (st.status === 'Done') {
          doneSubTopicIds.push(st.subTopicId.toString());
        }
      });
    });

    if (doneSubTopicIds.length === 0) {
      return res.json({ EASY: 0, MEDIUM: 0, HARD: 0});
    }

    const doneSubTopics = await SubTopic.find({ _id: { $in: doneSubTopicIds } }).select('level').lean();

    const doneCountByLevel = doneSubTopics.reduce((acc, subTopic) => {
      acc[subTopic.level] = (acc[subTopic.level] || 0) + 1;
      return acc;
    }, {});

    const totalDone = doneSubTopics.length;

    const report = {};
    ['EASY', 'MEDIUM', 'HARD'].forEach(level => {
      const count = doneCountByLevel[level] || 0;
      report[level] = ((count / totalDone) * 100).toFixed(2);
    });

    res.json(report);

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};