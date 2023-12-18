import { Request, Response, NextFunction } from 'express';
import { getLogsEndpoint, getWorkerLogsEndpoint } from '../../src/controllers/logger-data.controller'; // Replace with the actual file name
import * as loggerDataService from '../../src/services/logger-data.service';
// import * as loggerDataWorkerService from 'getWorkerLogs';

jest.mock('../../src/services/logger-data.service');
jest.mock('../../src/services/logger-data-worker.service');

describe('getLogsEndpoint', () => {
  const mockRequest = {} as Request;
  const mockResponse = { json: jest.fn() } as unknown as Response;
  const mockNext = jest.fn() as NextFunction;

  beforeEach(() => jest.clearAllMocks());

  it('handles getLogs successfully', async () => {
    (loggerDataService.getLogs as jest.Mock).mockResolvedValueOnce([{ message: 'Log message 1' }]);

    await getLogsEndpoint(mockRequest, mockResponse, mockNext);

    expect(mockResponse.json).toHaveBeenCalledWith({ logs: expect.any(Array) });
    expect(mockNext).not.toHaveBeenCalled();
  });

  it('handles getLogs errors', async () => {
    (loggerDataService.getLogs as jest.Mock).mockRejectedValueOnce(new Error('An error occurred'));

    await getLogsEndpoint(mockRequest, mockResponse, mockNext);

    expect(mockResponse.json).not.toHaveBeenCalled();
    expect(mockNext).toHaveBeenCalledWith(expect.any(Error));
  });
});
