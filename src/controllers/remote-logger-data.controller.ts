import {Request, Response} from 'express';
import { getRemoteLogs } from '../services/remote-logger-data.service';

export const getRemoteLogsEndpoint = async(req: Request, res: Response) => {
    try {
      const { host, username, filename, lastN, filter } = req.query;
      const privateKey = process.env.PRIVATE_KEY_FILE
      const logs = await getRemoteLogs(
        host as string,
        username as string,
        privateKey as string,
        filename as string,
        parseInt(lastN as string) || undefined,
        filter as string
      );
      res.json({ logs });
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
}