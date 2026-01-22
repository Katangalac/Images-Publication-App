"use client"

import { SignIn } from "@clerk/nextjs"

import useHideClerk from "@/hooks/hide-clerk"

/**
 * Page de signin
 * Gérer par Clerk
 */
export default function Page() {

  return (
    <div className="flex justify-center py-24">
      <SignIn signUpUrl={"/sign-up"} />
    </div>
  )
}
