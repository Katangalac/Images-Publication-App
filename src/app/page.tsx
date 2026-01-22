import { unstable_noStore as noStore } from "next/cache"

/**
 * Landing page
 */
export default async function Home() {
  noStore()

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-indigo-600 to-purple-700 text-white">
      <div className="container mb-20 flex flex-col items-center justify-center gap-12 px-4 py-16">
        <h1 className="text-5xl font-extrabold tracking-tight sm:text-[5rem]">
          <span className="text-[hsl(280,100%,70%)]">U</span>images
        </h1>
        <div className="flex flex-col items-center gap-2">
          <p className="text-2xl text-white">
            {}
          </p>
        </div>

        {}
      </div>
    </main>
  )
}
