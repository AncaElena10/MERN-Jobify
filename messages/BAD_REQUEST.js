const PublicConstants = {
    'E4000001': {
        'code': 'E4000001',
        'message': 'Invalid body.',
        'summary': 'The following properties must be provided and must be valid: name, password, email.',
        'action': 'Please retry the operation with a valid body.'
    },
    'E4000002': {
        'code': 'E4000002',
        'message': 'Email already in use.',
        'summary': 'We found an account with that email address.',
        'action': 'Please use a different email address or try signing in.'
    },
    'E4000003': {
        'code': 'E4000003',
        'message': 'Invalid body.',
        'summary': 'The following properties must be provided and must be valid: password, email.',
        'action': 'Please retry the operation with a valid body.'
    },
};

module.exports = { ...PublicConstants };