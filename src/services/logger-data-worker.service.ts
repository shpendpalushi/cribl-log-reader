// @ts-check
const { fs, createReadStream } = require('fs');
const { ReadStream, Transform } = require('stream');
const { pipeline } = require('stream/promises');
const { Worker, isMainThread } = require('worker_threads');

const WORKER_COUNT = 4; // Adjust the number of worker threads as needed, based on server/PC specs

// @ts-ignore
async function getWorkerLogs(logRequest) {
    const logFileStream = createReadStream(`/var/log/${logRequest.filename}`);
    // @ts-ignore
    const logLines = [];

    if (isMainThread) {
        console.log("LOG REQUEST: ", logRequest);
        // @ts-ignore
        await processWithWorkers(logFileStream, logLines, logRequest);
    }

}

// @ts-ignore
async function processWithWorkers(logFileStream, logLines, logRequest) {
    const lineTransform = new Transform({
        objectMode: true,
        // @ts-ignore
        transform(chunk, encoding, callback) {
            const workerData = { chunk, filter: logRequest.filter };
            const workerPromises = [];
            for (let i = 0; i < WORKER_COUNT; i++) {
                workerPromises.push(new Promise((resolve, reject) => {
                    // In a real world scenario absolute path should be used
                    // JS version of it as well. Build will interpret JS files to TS
                    const worker = new Worker("./src/workers/logger.worker.ts", { workerData });
                    // @ts-ignore
                    worker.on('message', (filteredLines) => {
                        logLines.push(...filteredLines);
                        resolve(filteredLines);
                    });
                    // @ts-ignore
                    worker.on('error', (err) => {
                        console.error('Worker error:', err);
                        reject(err);
                    });
                }))
            }

            // Resolve the promises when all worker threads are done
            Promise.all(workerPromises)
                .then(() => callback())
                .catch((err) => callback(err));
        }
    });

    await pipeline(logFileStream, lineTransform);
    return logLines;
}

module.exports = getWorkerLogs;