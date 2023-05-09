const PrivateConstants = {

};

const PrivateMethods = {

}

const PublicMethods = {
    getAll: async (req, res) => {
        res.send('get all jobs');
    },

    create: async (req, res) => {
        res.send('get all jobs');
    },

    getStats: async (req, res) => {
        res.send('get jobs stats');
    },

    delete: async (req, res) => {
        res.send('delete job');
    },

    update: async (req, res) => {
        res.send('update job');
    },
};

module.exports = { ...PublicMethods };