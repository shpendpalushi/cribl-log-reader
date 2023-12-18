const { workerData, parentPort } = require('worker_threads');

function getLogData() {
    // console.log(workerData);
    const { chunk, filter } = workerData;
    const linesData = new TextDecoder().decode(chunk);
    const lines = linesData.toString().split('\n');
    console.log(lines);
    // @ts-ignore
    const filteredLines = filterLogLines(lines, { filter });
    parentPort?.postMessage(filteredLines);

}
// @ts-ignore
function filterLogLines(logLines, { lastN, filter }) {
    if (filter) {
        console.log(filter);
        // @ts-ignore
        logLines = logLines.filter(line => line.includes(filter));
    }

    if (lastN) {
        logLines = logLines.slice(-lastN);
    }
    return logLines;
}

getLogData();