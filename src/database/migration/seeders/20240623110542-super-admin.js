const { Types } = require('mongoose');

const collectionName = 'admins';

const superAdmin = {
  name: 'Fakher Ghouili',
  email: 'fekhergh93@gmail.com',
  password: '$2a$10$m5bMcquEpiu2U71VUxLyM.A.icGGWbitYleaXhc9Z2Gi4XzdZAk6C',
  roles: [new Types.ObjectId('667464d83fd0a7741c14209d')],
  active: true,
  deleted: false,
  resetPasswordToken: null,
  resetPasswordExpiresAt: null,
  createdAt: new Date(),
  updatedAt: new Date(),
  __v: 0,
};

module.exports = {
  async up(db) {
    const filter = { email: superAdmin.email };
    const update = { $set: superAdmin };
    const options = { upsert: true };

    return await db.collection(collectionName).findOneAndUpdate(filter, update, options);
  },

  async down(db) {
    const filter = { email: superAdmin.email };
    return await db.collection(collectionName).findOneAndDelete(filter);
  },
};
