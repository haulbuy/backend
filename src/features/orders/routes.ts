import { Router } from "../../../deps.ts";

import { create } from "./controller.ts";

const router = new Router();

router.post("/orders/create", create);

export default router;
