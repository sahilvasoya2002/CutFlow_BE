
const defaultLogger = require('../logger');
const models = require('../schema');

const createUser = async (data, ctx) => {
  try {
    const { User: UserModel } = models;
    const user = await UserModel.create(data);
    return user;
  } catch (error) {
    defaultLogger(`Error from createUser > ${error}`, ctx, 'error');
    throw error;
  }
};

const checkUserExistsByEmail = async (email, ctx) => {
  try {
    const { User: UserModel } = models;
    const user = await UserModel.findOne({ email });
    return user;
  } catch (error) {
    defaultLogger(`Error from checkUserExistsByEmail > ${error}`, ctx, 'error');
    throw error;
  }
};

const updateUser = async (userId, data, ctx) => {
  try {
    const { User: UserModel } = models;
    const user = await UserModel.findByIdAndUpdate(userId, data, { new: true });
    return user;
  } catch (error) {
    defaultLogger(`Error from updateUser > ${error}`, ctx, 'error');
    throw error;
  }
};

module.exports = {
  createUser,
  checkUserExistsByEmail,
  updateUser,
};
