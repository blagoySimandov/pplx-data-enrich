import { enrichmentQuery, validateApiKey } from "./procedures";
import { router } from "./trpc";

export const appRouter = router({
  validateApiKey: validateApiKey,
  enrichmentQuery: enrichmentQuery,
});

export type AppRouter = typeof appRouter;
