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
            console.log(`Error occured while trying to get user by email from db: ${error}\n ${error.stack}`);
        }
    },

    getUserById: async (id) => {
        try {
            return await User.model.findOne({ _id: id });
        } catch (error) {
            console.log(`Error occured while trying to get user by id from db: ${error}\n ${error.stack}`);
        }
    },

    deleteAllUsers: async () => {
        try {
            return await User.model.deleteMany({});
        } catch (error) {
            console.log(`Error occured while trying to delete all users: ${error}\n ${error.stack}`);
        }
    },

    updateUser: async (body, id) => {
        try {
            return await User.model.updateOne({ _id: id }, { $set: body });
        } catch (error) {
            console.log(`Error occured while trying to update the user: ${error}\n ${error.stack}`);
        }
    },
}

module.exports = { ...PublicMethods };