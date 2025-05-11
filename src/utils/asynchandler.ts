import { Request, Response, NextFunction } from "express";



export const async_errorhandler = (func: Function) => {
    return (req: Request, res: Response, next: NextFunction) => {
        func(req, res, next)
            .catch((error: any) => {
                if (error.isAxiosError && error?.code === 'ECONNREFUSED') {
                    console.log('Something Went to Wrong');
                } if (error.sts && error.msg) {
                    next(error);
                } else {
                    console.log(error);
                    let err = {sts:'500',msg:'Something Went to Wrong'}
                    next(err);
                }
            })
    }
}