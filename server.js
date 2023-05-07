const express = require('express');
const app = express();
const dotenv = require('dotenv');

dotenv.config();

// setting the app port
const port = process.env.PORT || 4000;

// middleware
const notFoundMiddleware = require('./middleware/notFound.middleware');
const errorHandlerMiddleware = require('./middleware/error.middleware');

// database
const databaseService = require('./service/database/database.service');

app.get('/', (req, res) => {
    res.send('Welcome!');
});

app.use(notFoundMiddleware);
app.use(errorHandlerMiddleware);

const init = async () => {
    try {
        await databaseService.connectDB(process.env.MONGO_URL);

        app.listen(port, () => {
            console.log(`Server is listening on port ${port}...`);
        });
    } catch (error) {
        console.log(`Error occured while trying to connect to mongo db: ${error}\n ${error.stack}`);
    }
}

init();