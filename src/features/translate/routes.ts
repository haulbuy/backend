import { Router } from "../../../deps.ts";
import { translate } from "./controller.ts";

const router = new Router();

router.post("/translate", translate);

export default router;
