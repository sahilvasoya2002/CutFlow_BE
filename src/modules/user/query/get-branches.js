/* eslint-disable no-underscore-dangle */
const {
  fetchBranches,
} = require('../../../repository/branch-repository');
const userLogger = require('../user-logger');

const getBranches = async (_, { data }, ctx) => {
  try {
    const {
      shopId, limit, offset, search,
    } = data;

    const { branches, totalCount } = await fetchBranches({
      shopId, limit, offset, search, ctx,
    });

    return { branches, totalCount };
  } catch (error) {
    userLogger(`Error from getBranches > ${error.message}`, ctx, 'error');
    throw error;
  }
};

module.exports = getBranches;
