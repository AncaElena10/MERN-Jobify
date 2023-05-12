const PublicConstants = {
    'E4000001': {
        'errorCode': 'E4000001',
        'errorMessage': 'Invalid body.',
        'errorDescription': 'One following properties must be provided and must be valid: name, password, email.',
        'errorAction': 'Please retry the operation with a valid body.'
    },
    'E4000002': {
        'errorCode': 'E4000002',
        'errorMessage': 'Email already in use.',
        'errorDescription': 'We found an account with that email address.',
        'errorAction': 'Please use a different email address or try signing in.'
    },
};

module.exports = { ...PublicConstants };