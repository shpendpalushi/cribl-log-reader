import { NextFunction, Request, Response } from 'express';
const getWorkerLogs = require('../services/logger-data-worker.service');
import { LogRequest } from '../types/log-request.type';
import { getLogs } from '../services/logger-data.service';

export const getLogsEndpoint = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const logRequest = req.query as unknown as LogRequest;
        const logStream = await getLogs(logRequest);

        logStream.on('data', (chunk: any) => {
            res.write(chunk);
            console.log(chunk);
            // Process the received chunk (e.g., convert to string, display)
        });

        logStream.on('end', () => {
            console.log("end");
            res.end();
            // Stream completed processing
        });

        //   const logStream = await getLogs(logRequest);

        //   // Set appropriate response headers for streaming
        //   res.setHeader('Content-Type', 'text/plain'); // Adjust based on actual log format
        //   res.setHeader('Transfer-Encoding', 'chunked');

        //   // Handle data events from the log stream
        //   logStream.on('data', (chunk: any) => {
        //     // Process and modify the chunk if needed
        //     // (e.g., apply additional filtering, formatting)
        //     const processedChunk = chunk.toString(); // Example processing

        //     // Push the processed data to the response stream
        //     res.write(processedChunk);
        //   });

        //   // Handle completion and errors
        //   logStream.on('end', () => res.end());
        //   logStream.on('error', (error: any) => {
        //     console.error(error);
        //     next(error);
        //   });
    } catch (error) {
        console.log(error);
        next(error);
    }
};


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