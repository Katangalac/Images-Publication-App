import "@/styles/globals.css"
import { SpeedInsights } from "@vercel/speed-insights/next"
import { Analytics } from "@vercel/analytics/react"

import { TRPCReactProvider } from "@/trpc/react"
import { ClerkProvider } from "@clerk/nextjs"

import { Header } from "@/components/Header"
import Providers from "@/app/providers"

/**
 * Metadonnées de l'application (titre,icone et description)
 */
export const metadata = {
  title: "Uimages",
  description: "une application web de publication d'images",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
}

/**
 * MainLayout de l'application
 */
export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      publishableKey={process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY}
    >
      <html lang="en">
        <body className={`font-sans`}>
          <TRPCReactProvider>
            <Header />
            <Providers>
              {children}
              <SpeedInsights />
              <Analytics />
            </Providers>
          </TRPCReactProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
