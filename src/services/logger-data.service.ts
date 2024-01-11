import { createReadStream } from 'fs';
import { LogRequest } from '../types/log-request.type';
import { Readable, Transform } from 'stream';
import backwardsStream from '../helpers/backwards-stream'

export async function getLogs(logRequest: LogRequest) {
    let currentCount = 0;
    const logFileStream = backwardsStream(`/var/log/${logRequest.filename}`, null);
    const customReadable = new Readable({
        objectMode: true,
        read() {},
    });

    const lineTransform = new Transform({
        objectMode: true,
        transform(chunk, _, callback) {
            let lines: string[] = chunk.toString().split('\n').reverse();
            for (const line of lines) {
                if(!logRequest.filter && !logRequest.lastN){
                    customReadable.push(line);
                }
                if (!filterLogLines(line, currentCount, { filter: logRequest.filter, lastN: logRequest.lastN })) {
                    continue;
                }
                ++currentCount;
                if(logRequest.lastN && currentCount > +logRequest.lastN){
                    logFileStream.emit('end');
                    logFileStream.destroy();
                }
                if(logRequest.lastN && currentCount <= + logRequest.lastN){
                    customReadable.push(line);
                }
            }
            callback();
        },
    });

    logFileStream.pipe(lineTransform).on('finish', () => {
        customReadable.push(null); // Signal the end of the readable stream
    });

    return customReadable;

}

function filterLogLines(logLine: string, currentCount: number, { lastN, filter }: Partial<LogRequest>): string | null {
    let filteredLine: string | null = logLine;
    if (filter) {
        filteredLine = logLine.includes(filter) ? logLine : null;
    }

    if (lastN && +lastN > currentCount) {
        filteredLine = logLine;
    }
    return filteredLine;
}