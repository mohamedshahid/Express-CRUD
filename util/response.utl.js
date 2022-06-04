const successResponse = (data = []) => ({
    status: 'Success',
    data
});

const errorResponse = (message = '') => ({
    status: 'Failed',
    message
});

module.exports = {successResponse, errorResponse}