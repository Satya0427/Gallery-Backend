import { Request,Response,NextFunction } from "express";


/* Middleware to Validate Empty Payload Requests */
export const emptybody_middleware = (req: Request, res: Response, next: NextFunction) => {
    if (!Object.keys(req.body).length) {
        res.status(400).json({sts:400,msg:'Empty payload'});
        return;
    }
    next();
}