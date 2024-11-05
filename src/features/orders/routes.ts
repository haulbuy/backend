import { Router } from "../../../deps.ts";


const router = new Router();

router.post("/orders/create", createOrders);

export default router;
