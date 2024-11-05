import { Router } from "../../../deps.ts";
import { handleCapturePayment } from "./controller.ts";

const router = new Router();

router.post("/payments/capture/cart", handleCapturePayment);

export default router;
