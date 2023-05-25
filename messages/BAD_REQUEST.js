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
    'E4000004': {
        'code': 'E4000004',
        'message': 'Invalid body.',
        'summary': 'The following properties must be provided and must be valid: name, lastname, email, location.',
        'action': 'Please retry the operation with a valid body.'
    },
    'E4000005': {
        'code': 'E4000005',
        'message': 'Invalid body.',
        'summary': 'The following properties must be provided and must be valid: company, position.',
        'action': 'Please retry the operation with a valid body.'
    },
    'E4000006': {
        'code': 'E4000006',
        'message': 'Invalid value for status.',
        'summary': 'The status property must be provided and must have one of the values: interview, declined, pending.',
        'action': 'Please retry the operation with a valid body.'
    },
    'E4000007': {
        'code': 'E4000007',
        'message': 'Invalid value for jobType.',
        'summary': 'The jobType property must be provided and must have one of the values: full-time, part-time, remote, intership.',
        'action': 'Please retry the operation with a valid body.'
    },
    'E4000008': {
        'code': 'E4000008',
        'message': 'Invalid value for password.',
        'summary': 'The password must contain at least 5 letters and 1 number.',
        'action': 'Please retry the operation with a valid password.'
    }
};

module.exports = { ...PublicConstants };