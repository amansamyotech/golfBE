const axios = require('axios');

module.exports.handleError = function (error, req) {
    return new Promise((resolve, reject) => {
        if (error && error.response && error.response.status === 401) {
            if (req.tokendata) {
                resolve({ status: 2, message: trans.lang('message.auth_fail') }); return;
            }
            req.session.destroy(function () {
                resolve({ status: 401, message: trans.lang('message.something_went_wrong') }); return;
            });
        } else {
            resolve({ status: 0, message: trans.lang('message.something_went_wrong'), error }); return;
        }
    });
}
