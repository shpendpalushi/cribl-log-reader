import { Router } from "express";
import { getLogsEndpoint, getWorkerLogsEndpoint } from "../controllers/logger-data.controller";

const router = Router();
router.get('', getLogsEndpoint);
router.get('/worker', getWorkerLogsEndpoint);
export const LoggerDataRouter: Router = router;