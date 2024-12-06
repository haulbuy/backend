import { Router } from "../../../deps.ts";
import { shippingStatistics } from "./controller.ts";

const router = new Router();

router.get("/shipping/statistics", shippingStatistics);

export default router;
