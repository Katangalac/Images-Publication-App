import { imagesRouter } from "@/server/api/routers/images"
import { createTRPCRouter } from "@/server/api/trpc"

/**
 * Primary router for the server
 */
export const appRouter = createTRPCRouter({
  images: imagesRouter,
})

export type AppRouter = typeof appRouter
