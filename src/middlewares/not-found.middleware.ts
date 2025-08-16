import { Request, Response } from 'express';
import { HttpStatus, ResponseMessage } from '@/constants';

export const notFoundMiddleware = (req: Request, res: Response) => {
    res.status(HttpStatus.NOT_FOUND).json({
        message: ResponseMessage.NOT_FOUND,
        path: req.originalUrl
    });
};