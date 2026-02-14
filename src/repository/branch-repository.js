const defaultLogger = require('../logger');
const models = require('../schema');

const addShop = async (data, ctx) => {
  try {
    const { Shop: ShopModel } = models;
    const shop = await ShopModel.create(data);
    return shop;
  } catch (error) {
    defaultLogger(`Error from addShop > ${error}`, ctx, 'error');
    throw error;
  }
};

const addBranch = async (data, ctx) => {
  try {
    const { Branch: BranchModel } = models;
    const branch = await BranchModel.create(data);
    return branch;
  } catch (error) {
    defaultLogger(`Error from addBranch > ${error}`, ctx, 'error');
    throw error;
  }
};

const updateShopData = async (shopId, data, ctx) => {
  try {
    const { Shop: ShopModel } = models;
    const shop = await ShopModel.findByIdAndUpdate(shopId, data, { new: true });
    return shop;
  } catch (error) {
    defaultLogger(`Error from updateShopData > ${error}`, ctx, 'error');
    throw error;
  }
};

const updateBranchData = async (branchId, data, ctx) => {
  try {
    const { Branch: BranchModel } = models;
    const branch = await BranchModel.findByIdAndUpdate(branchId, data, { new: true });
    return branch;
  } catch (error) {
    defaultLogger(`Error from updateBranchData > ${error}`, ctx, 'error');
    throw error;
  }
};

const getShopById = async (shopId, ctx) => {
  try {
    const { Shop: ShopModel } = models;
    const shop = await ShopModel.findById(shopId);
    return shop;
  } catch (error) {
    defaultLogger(`Error from getShopById > ${error}`, ctx, 'error');
    throw error;
  }
};
const getBranchById = async (branchId, ctx) => {
  try {
    const { Branch: BranchModel } = models;
    const branch = await BranchModel.findById(branchId);
    return branch;
  } catch (error) {
    defaultLogger(`Error from getBranchById > ${error}`, ctx, 'error');
    throw error;
  }
};

const fetchBranches = async ({
  shopId,
  search,
  limit = 10,
  offset = 0,
  ctx,
}) => {
  try {
    const { Branch: BranchModel } = models;

    const condition = { isDeleted: false };

    if (shopId) {
      condition.shopId = shopId;
    }

    if (search) {
      condition.$or = [
        { name: { $regex: search, $options: 'i' } },
        { address: { $regex: search, $options: 'i' } },
      ];
    }

    const branches = await BranchModel
      .find(condition)
      .skip(offset)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalCount = await BranchModel.countDocuments(condition);

    return { branches, totalCount };
  } catch (error) {
    defaultLogger(`Error from fetchBranches > ${error.message}`, ctx, 'error');
    throw error;
  }
};

module.exports = {
  addShop,
  addBranch,
  updateShopData,
  updateBranchData,
  getShopById,
  getBranchById,
  fetchBranches,
};
