const { Types } = require('mongoose');

const collectionName = 'roles';

const role = {
  _id: new Types.ObjectId('667464d83fd0a7741c14209d'),
  name: 'Administrator',
  type: 'SUPER_ADMIN',
  permissions: [],
  active: true,
  deleted: false,
  createdAt: new Date(),
  updatedAt: new Date(),
  __v: 0,
};

module.exports = {
  async up(db) {
    const filter = { _id: role._id };
    const update = { $set: role };
    const options = { upsert: true };

    return await db.collection(collectionName).findOneAndUpdate(filter, update, options);
  },

  async down(db) {
    const filter = { _id: role._id };
    return await db.collection(collectionName).findOneAndDelete(filter);
  },
};
