const dotenv = require('dotenv');
dotenv.config();

const DatabaseService = require('./services/database.service');
const WebService = require('./services/web.service');

const initialSetup = async () => {
    console.log('------------------');
    console.log('Starting Server...');
    console.log('------------------');

    await DatabaseService.connectDB(process.env.MONGO_URL);
    await WebService.initialSetup();
}

initialSetup();