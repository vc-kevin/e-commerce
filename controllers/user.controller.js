const User = require('../models/user.schema');

exports.getUsers = async (_, res) => {
  try {
    const userList = await User.find({}, { password: 0 });
    res.status(200).send({
      message: 'Users list get successfully!',
      data: userList,
    });
  } catch (error) {
    res.status(400).send({
      message: 'Bad request',
      error: [error],
    });
  }
};