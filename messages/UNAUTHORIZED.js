const PublicConstants = {
    'E4010001': {
        'code': 'E4010001',
        'message': 'Invalid credentials.',
        'summary': 'The following properties were found invalid: email or password.',
        'action': 'Please retry the operation with valid credentials.'
    },
    'E4010002': {
        'code': 'E4010002',
        'message': 'Invalid token.',
        'summary': 'You are not authorized to perform the action, because the token is either expired or invalid.',
        'action': 'Please login and retry the operation.'
    },
};

module.exports = { ...PublicConstants };