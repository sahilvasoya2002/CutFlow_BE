/* eslint-disable no-underscore-dangle */
const { CustomApolloError } = require('../../../lib/error-handler');
const {
  updateBranchData, getBranchById,
} = require('../../../repository/branch-repository');
const { getMessage } = require('../../../utils/messages');
const userLogger = require('../user-logger');

const updateBranch = async (_, { data }, ctx) => {
  try {
    const {
      branchId, name, address, openingTime, closingTime,
    } = data;

    const existingBranch = await getBranchById(branchId, ctx);
    if (!existingBranch) {
      throw new CustomApolloError(getMessage('BRANCH_NOT_FOUND'));
    }

    const branch = await updateBranchData(
      branchId,
      {
        name,
        address,
        openingTime,
        closingTime,
      },
      ctx,
    );

    return { branch };
  } catch (error) {
    userLogger(`Error from updateBranch > ${error.message}`, ctx, 'error');
    throw error;
  }
};

module.exports = updateBranch;
