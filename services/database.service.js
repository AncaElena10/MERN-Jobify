const mongoose = require('mongoose')

const PublicMethods = {
    connectDB: async (url) => {
        try {
            return mongoose.connect(url);
        } catch (error) {
            console.log(`Error occured while trying to connect to mongo db: ${error}\n ${error.stack}`);
        }
    },
}

module.exports = { ...PublicMethods };