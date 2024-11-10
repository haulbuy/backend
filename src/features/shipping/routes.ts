import { Router } from "../../../deps.ts";
import { calculateShipping } from "./controller.ts";

const router = new Router();

router.post("/shipping/calculate", calculateShipping);

export default router;
