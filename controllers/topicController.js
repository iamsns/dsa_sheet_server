const Topic = require('../models/topicModel');
const SubTopic = require('../models/subTopicModel');
const UserProgress = require('../models/userProgressModel');

exports.getAllTopics = async (req, res) => {
  try {
    const userId = req.userId;
    const topics = await Topic.find().select('name').lean();
    const subTopics = await SubTopic.find().lean();

    const userProgressList = await UserProgress.find({ user: userId }).lean();

    const response = topics.map(topic => {
      const topicProgress = userProgressList.find(
        (up) => up.topicId.toString() === topic._id.toString()
      );

      const topicSubTopics = subTopics.filter(
        (st) => st.topic.toString() === topic._id.toString()
      );

      return {
        _id: topic._id,
        name: topic.name,
        status: topicProgress ? topicProgress.status : 'Pending',
        subTopics: topicSubTopics.map(st => {
          const subTopicProgress = topicProgress?.subTopics?.find(
            s => s.subTopicId.toString() === st._id.toString()
          )

          return {
            _id: st._id,
            name: st.name,
            leetCodeLink: st.leetCodeLink,
            youtubeLink: st.youtubeLink,
            articleLink: st.articleLink,
            level: st.level,
            isChecked: st.isChecked,
            status: subTopicProgress ? subTopicProgress.status : 'Pending',
          }
        }),
      }
    })

    res.json(response);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};