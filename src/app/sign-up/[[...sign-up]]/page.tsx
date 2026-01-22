"use client"

import { SignUp } from "@clerk/nextjs"

import useHideClerk from "@/hooks/hide-clerk"

/**
 * Page de signup
 * Gérer par Clerk
 */
export default function Page() {
  return (
    <div className="flex justify-center py-24 [&>*>*>*:nth-child(4)]:hidden">
      <SignUp signInUrl={"/sign-in"} />
    </div>
  )
}
