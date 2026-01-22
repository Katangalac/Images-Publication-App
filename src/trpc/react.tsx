"use client"

import { useState } from "react"
import { type AppRouter } from "@/server/api/root"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { loggerLink, unstable_httpBatchStreamLink } from "@trpc/client"
import { createTRPCReact } from "@trpc/react-query"
import { getUrl, transformer } from "./shared"

/**
 * React Client qui sera utilisé pour faire des  query et mutations
 * avec nos procédures tRPC en utilisant useQuery
 */
export const api = createTRPCReact<AppRouter>()

/**
 * Provider tRPC
 * @param props {React.ReactNode} => notre application que tRPC va wrapper
 */
export function TRPCReactProvider(props: { children: React.ReactNode }) {
  const [queryClient] = useState(() => new QueryClient())

  const [trpcClient] = useState(() =>
    api.createClient({
      transformer,
      links: [
        loggerLink({
          enabled: (op) =>
            process.env.NODE_ENV === "development" ||
            (op.direction === "down" && op.result instanceof Error),
        }),
        unstable_httpBatchStreamLink({
          url: getUrl(),
        }),
      ],
    })
  )

  return (
    <QueryClientProvider client={queryClient}>
      <api.Provider client={trpcClient} queryClient={queryClient}>
        {props.children}
      </api.Provider>
    </QueryClientProvider>
  )
}
