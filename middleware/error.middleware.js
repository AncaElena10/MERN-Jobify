const serverError = (error, req, res, next) => {
    console.log(`Error occured while processing the request: ${error}\n${error.stack}`);
    res.status(500).send('An error occurred while processing the request.');
};

module.exports = serverError;