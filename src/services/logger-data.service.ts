import { createReadStream } from 'fs';
import { LogRequest } from '../types/log-request.type';
import { Transform } from 'stream';
import { pipeline } from 'stream/promises';

export async function getLogs(logRequest: LogRequest) {
    const logFileStream = createReadStream(`/var/log/${logRequest.filename}`);
    const logLines: string[] = [];

    const lineTransform = new Transform({
        objectMode: true,
        transform(chunk, _, callback) {
            const lines: string[] = chunk.toString().split('\n');
            lines.forEach(line => logLines.push(line));
            callback();
        }
    });

    await pipeline(logFileStream, lineTransform);

    const filteredLogLines = filterLogLines(logLines, logRequest);
    const reversedLogLines = filteredLogLines.reverse();
    return reversedLogLines;

}

function filterLogLines(logLines: string[], { lastN, filter }: LogRequest): string[] {
    if (filter) {
        logLines = logLines.filter(line => line.includes(filter));
    }

    if (lastN) {
        logLines = logLines.slice(-lastN);
    }
    return logLines;
}

