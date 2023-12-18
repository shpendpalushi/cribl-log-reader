import { NextFunction, Request, Response } from 'express';
const getWorkerLogs = require('../services/logger-data-worker.service');
import { LogRequest } from '../types/log-request.type';
import { getLogs } from '../services/logger-data.service';

export const getLogsEndpoint = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const logRequest = req.query as unknown as LogRequest;
        const logs = await getLogs(logRequest);
        return res.json({ logs });
    } catch (error) {
        console.log(error);
        next(error);
    }
}

export const getWorkerLogsEndpoint = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const logRequest = req.query as unknown as LogRequest;
        const logs = await getWorkerLogs(logRequest);
        return res.json({ logs });
    } catch (error) {
        console.log(error);
        next(error);
    }
}