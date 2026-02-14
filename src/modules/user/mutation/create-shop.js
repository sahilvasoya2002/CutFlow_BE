/* eslint-disable no-underscore-dangle */
const {
  addShop, updateShopData, addBranch, getShopById,
} = require('../../../repository/branch-repository');
const { updateUser } = require('../../../repository/user-repository');
const userLogger = require('../user-logger');

const createShop = async (_, { data }, ctx) => {
  try {
    const { id: userId } = ctx.user;
    const { name, logo, branches = [] } = data;

    const createdShop = await addShop({ name, logo }, ctx);
    const shopId = createdShop._id;

    const createdBranches = await Promise.all(
      branches.map(branchData => addBranch(
        {
          ...branchData,
          shopId,
          userId,
        },
        ctx,
      )),
    );

    await updateShopData(
      shopId,
      {
        noOfBranches: createdBranches.length,
        branches: createdBranches.map(branch => branch._id),
      },
      ctx,
    );

    await updateUser(userId, { shopId }, ctx);
    const shop = await getShopById(shopId, ctx);

    return { shop };
  } catch (error) {
    userLogger(`Error from createShop > ${error.message}`, ctx, 'error');
    throw error;
  }
};

module.exports = createShop;
