import fs from 'fs';
import { getLogs } from '../../src/services/logger-data.service'


// assuming file exists
test('it should return an array of reversed log lines with no filtering and no lastN', async () => {
  const logRequest = { filename: 'test.log' };
  const result = await getLogs(logRequest);
  expect(result).toEqual(['line3', 'line2', 'line1']);
});

test('getLogs throws error if file does not exist', async () => {
  const mockCreateReadStream = jest.fn(() => {
    throw new Error('File not found');
  });
  const logRequest = { filename: 'nonexistent.log' };
  await expect(getLogs(logRequest)).rejects.toThrow("ENOENT: no such file or directory, open '/var/log/nonexistent.log'");
});
