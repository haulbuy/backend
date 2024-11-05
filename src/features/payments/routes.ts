import { Router } from "../../../deps.ts";
import { handleCapturePayment } from "./controller.ts";

const router = new Router();

router.post("/payments/capture", handleCapturePayment);

export default router;
