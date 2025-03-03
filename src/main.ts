// deno-lint-ignore-file no-explicit-any

import { Application } from "../deps.ts";
import { logger } from "./utils/generalUtils.ts";
import ordersRoutes from "./features/orders/routes.ts";
import paymentsRoutes from "./features/payments/routes.ts";
import shippingRoutes from "./features/shipping/routes.ts";
import translateRoutes from "./features/translate/routes.ts";

const app = new Application();

// Logger middleware
app.use(async (ctx, next) => {
  const { method, url } = ctx.request;
  logger.info(`Received ${method} request for ${url}`);
  await next();
});

// Error handling middleware
app.use(async (ctx, next) => {
  try {
    await next();
  } catch (err: any) {
    ctx.response.status = err.status || 500;
    ctx.response.body = { error: err.message || "An unknown error occured " };
    logger.error(`Error: ${err.message} `);
  }
});

// Register routes
app.use(ordersRoutes.routes());
app.use(ordersRoutes.allowedMethods());
app.use(paymentsRoutes.routes());
app.use(paymentsRoutes.allowedMethods());
app.use(shippingRoutes.routes());
app.use(shippingRoutes.allowedMethods());
app.use(translateRoutes.routes());
app.use(translateRoutes.allowedMethods());

// Start the server
console.log("Server running on http://localhost:8000");
await app.listen({ port: 8000 });
