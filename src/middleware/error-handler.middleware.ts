import { Request, Response, NextFunction } from "express";
export function ErrorHandler(error: any, request: Request, response: Response, next: NextFunction){
    response.status(error.status || 500);
    response.send({'error': true, message: error?.message || "Internal Server Error"});
}