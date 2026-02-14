/* eslint-disable no-underscore-dangle */
const { CustomApolloError } = require('../../../lib/error-handler');
const {
  getBranchById,
} = require('../../../repository/branch-repository');
const { getMessage } = require('../../../utils/messages');
const userLogger = require('../user-logger');

const getBranchWithId = async (_, args, ctx) => {
  try {
    const { branchId } = args;

    const existingBranch = await getBranchById(branchId, ctx);
    if (!existingBranch) {
      throw new CustomApolloError(getMessage('BRANCH_NOT_FOUND'));
    }

    return { branch: existingBranch };
  } catch (error) {
    userLogger(`Error from getBranchWithId > ${error.message}`, ctx, 'error');
    throw error;
  }
};

module.exports = getBranchWithId;
