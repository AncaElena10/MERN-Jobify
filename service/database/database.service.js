const mongoose = require('mongoose')

const PublicMethods = {
    connectDB: async (url) => {
        return mongoose.connect(url);
    },
}

module.exports = { ...PublicMethods };