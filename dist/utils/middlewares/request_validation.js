"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.emptybody_middleware = void 0;
/* Middleware to Validate Empty Payload Requests */
const emptybody_middleware = (req, res, next) => {
    if (!Object.keys(req.body).length) {
        res.status(400).json({ sts: 400, msg: 'Empty payload' });
        return;
    }
    next();
};
exports.emptybody_middleware = emptybody_middleware;
//# sourceMappingURL=request_validation.js.map