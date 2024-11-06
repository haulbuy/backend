import { Router } from "../../../deps.ts";
import { balanceProcess } from "./controller.ts";

const router = new Router();

router.post("/payments/balance/process", balanceProcess);

export default router;
