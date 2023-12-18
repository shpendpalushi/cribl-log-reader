import { Router } from "express";
import { getRemoteLogsEndpoint } from "../controllers/remote-logger-data.controller";

const router = Router();
router.get('', getRemoteLogsEndpoint);
export const RemoteLoggerDataRouter: Router = router;