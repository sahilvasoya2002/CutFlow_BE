/* eslint-disable no-underscore-dangle */
const { CustomApolloError } = require('../../../lib/error-handler');
const {
  getShopById,
} = require('../../../repository/branch-repository');
const { getMessage } = require('../../../utils/messages');
const userLogger = require('../user-logger');

const getShopWithId = async (_, args, ctx) => {
  try {
    const { shopId } = args;

    const existingShop = await getShopById(shopId, ctx);
    if (!existingShop) {
      throw new CustomApolloError(getMessage('SHOP_NOT_FOUND'));
    }

    return { shop: existingShop };
  } catch (error) {
    userLogger(`Error from getShopWithId > ${error.message}`, ctx, 'error');
    throw error;
  }
};

module.exports = getShopWithId;
