const PublicMethods = {
    notFound: (req, res) => {
        console.log(`Got the req PATH ${req.originalUrl} that does not exist.`);

        res.status(404).send('Route does not exist');
    },
    serverError: (error, req, res, next) => {
        console.log(`Error occured while processing the request: ${error}\n${error.stack}`);

        res.status(500).send('An error occurred while processing the request.');
    },
}

module.exports = { ...PublicMethods };