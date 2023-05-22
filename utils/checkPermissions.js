const PublicMethods = {
    checkPermissions: (reqUser, resourceUserId) => {
        return (reqUser.userId === resourceUserId.toString()) ? true : false;
    },
};

module.exports = { ...PublicMethods };