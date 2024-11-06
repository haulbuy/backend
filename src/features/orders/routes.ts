import { Router } from "../../../deps.ts";
import { create, process } from "./controller.ts";

const router = new Router();

router.post("/orders/create", create);
router.post("/orders/process", process);

export default router;
