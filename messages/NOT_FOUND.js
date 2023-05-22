const PublicConstants = {
    'E4040001': {
        'code': 'E4040001',
        'message': 'Route not found.',
        'summary': 'The resource you are trying to access does not exist.',
        'action': 'Please retry the operation with an existent route.'
    },
    'E4040002': {
        'code': 'E4040002',
        'message': 'Resource not found.',
        'summary': 'The resource you are trying to access does not exist.',
        'action': 'Please retry the operation with an existing resource.'
    }
};

module.exports = { ...PublicConstants };