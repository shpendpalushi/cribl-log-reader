import { Request, Response, NextFunction } from 'express';
import { getLogsEndpoint, getWorkerLogsEndpoint } from '../../src/controllers/logger-data.controller'; // Replace with the actual file name
import { LogRequest } from '../../src/types/log-request.type';
import { getLogs } from '../../src/services/logger-data.service';
// import * as loggerDataWorkerService from 'getWorkerLogs';

jest.mock('../../src/services/logger-data.service');
jest.mock('../../src/services/logger-data-worker.service');

describe('getLogsEndpoint', () => {
  it('should stream logs and handle errors', async () => {
    const req = {} as Request;
    const res = { write: jest.fn(), end: jest.fn() } as unknown as Response;
    const next = jest.fn();
    const logRequest = {} as LogRequest;
    const logStream = { on: jest.fn() };

    (getLogs as jest.Mock).mockResolvedValue(logStream);

    await getLogsEndpoint(req, res, next);

    expect(res.write).not.toHaveBeenCalled();
    expect(res.end).not.toHaveBeenCalled();
    expect(getLogs).not.toHaveBeenCalledWith(logRequest);
    expect(logStream.on).not.toHaveBeenCalledWith('data', expect.any(Function));
    expect(logStream.on).not.toHaveBeenCalledWith('end', expect.any(Function));

    (getLogs as jest.Mock).mockRejectedValue(new Error('Test error'));

    await getLogsEndpoint(req, res, next);

    expect(next).toHaveBeenCalledWith(expect.any(Error));
  });
});