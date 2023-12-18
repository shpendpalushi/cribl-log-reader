import { Client, ExecOptions } from 'ssh2';
import fs from 'fs';
import path from 'path';

async function readRemoteLogs(
  host: string,
  username: string,
  privateKey: string,
  filePath: string,
  lastN?: number,
  filter?: string
): Promise<string[]> {
  return new Promise<string[]>((resolve, reject) => {
    const conn = new Client();

    const execOptions: ExecOptions = {
      pty: false, // Disable pseudo-terminal
    };

    conn
      .on('ready', () => {
        const fullFilePath = path.join('/var/log', filePath);
        conn.exec(`cat ${fullFilePath}`, execOptions, (err, stream) => {
          if (err) {
            reject(err);
            return conn.end();
          }

          let content = '';

          stream
            .on('data', (data: Buffer) => {
              content += data.toString();
            })
            .on('end', () => {
              const lines = content.split('\n').filter(Boolean);

              if (filter) {
                resolve(lines.filter(line => line.includes(filter)));
              } else if (lastN) {
                resolve(lines.slice(-lastN));
              } else {
                resolve(lines);
              }

              conn.end();
            })
            .stderr.on('data', errData => {
              reject(new Error(`Error reading logs: ${errData.toString()}`));
              conn.end();
            });
        });
      })
      .connect({
        host,
        port: 22,
        username,
        privateKey: fs.readFileSync(privateKey),
      })
      .on('error', (err: Error) => {
        reject(new Error(`Error connecting to the server: ${err.message}`));
      });
  });
}

export async function getRemoteLogs(
  host: string,
  username: string,
  privateKey: string,
  filename: string,
  lastN?: number,
  filter?: string
): Promise<string[]> {
  try {
    const logs = await readRemoteLogs(host, username, privateKey, filename, lastN, filter);
    return logs.reverse(); // Reverse to present newest logs first
  } catch (error) {
    throw new Error(`Error reading logs: ${error.message}`);
  }
}
