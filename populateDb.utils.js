const { readFile } = require('fs/promises');
const path = require('path');
const filePath = path.join(__dirname, 'mock_jobs.json');

const dotenv = require('dotenv');
dotenv.config();

const databaseService = require('./services/database.service');
const Job = require('./models/job');

const start = async () => {
    try {
        await databaseService.connectDB(process.env.MONGO_URL);
        await Job.model.deleteMany();

        const jsonProducts = JSON.parse(
            await readFile(filePath)
        );

        await Job.model.create(jsonProducts);

        console.debug('Success!!!');
        process.exit(0);
    } catch (error) {
        console.error(error);
        process.exit(1);
    }
};

start();