import { Application } from "../deps.ts";
import paymentsRoutes from "./features/payments/routes.ts";
import { logger } from "./utils/logger.ts";

const app = new Application();

app.use(async (ctx, next) => {
  try {
    logger.info(
      `Received ${ctx.request.method} request for ${ctx.request.url}`,
    );
    await next();
  } catch (err) {
    if (err instanceof Error) {
      ctx.response.status = 500;
      ctx.response.body = { error: err.message };
      logger.error(`Error: ${err.message}`);
    } else {
      ctx.response.status = 500;
      ctx.response.body = { error: "An unknown error occured" };
      logger.error(`Error: An unknown error occured`);
    }
  }
});

app.use(paymentsRoutes.routes());
app.use(paymentsRoutes.allowedMethods());

console.log("Server running on http://localhost:8000");
await app.listen({ port: 8000 });
