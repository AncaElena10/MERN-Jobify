const PrivateConstants = {

};

const PrivateMethods = {

};

const PublicMethods = {
    register: async (req, res) => {
        res.send('register user');
    },

    login: async (req, res) => {
        res.send('login user');
    },

    update: async (req, res) => {
        res.send('update user');
    },
};

module.exports = { ...PublicMethods };