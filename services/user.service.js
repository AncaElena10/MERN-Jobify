const User = require('../models/user');

const PublicMethods = {
    insertUser: async (body) => {
        try {
            return await User.model.create(body);
        } catch (error) {
            console.log(`Error occured while trying to insert user into db: ${error}\n ${error.stack}`);
        }
    },

    getUserByEmail: async (email) => {
        try {
            return await User.model.findOne({ email: email }).select('+password');
        } catch (error) {
            console.log(`Error occured while trying to get user from db: ${error}\n ${error.stack}`);
        }
    },

    deleteAllUsers: async () => {
        try {
            return await User.model.deleteMany({});
        } catch (error) {
            console.log(`Error occured while trying to delete all users: ${error}\n ${error.stack}`);
        }
    }
}

module.exports = { ...PublicMethods };