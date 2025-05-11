"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.async_errorhandler = void 0;
const async_errorhandler = (func) => {
    return (req, res, next) => {
        func(req, res, next)
            .catch((error) => {
            if (error.isAxiosError && error?.code === 'ECONNREFUSED') {
                console.log('Something Went to Wrong');
            }
            if (error.sts && error.msg) {
                next(error);
            }
            else {
                console.log(error);
                let err = { sts: '500', msg: 'Something Went to Wrong' };
                next(err);
            }
        });
    };
};
exports.async_errorhandler = async_errorhandler;
//# sourceMappingURL=asynchandler.js.map