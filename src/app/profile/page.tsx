"use client"

import { type FC } from "react"
import { UserProfile } from "@clerk/nextjs"
import useHideClerk from "@/hooks/hide-clerk"

/**
 * Page de profile de l'utilisateur
 * Gérer par Clerk
 */
const ProfilePage: FC = () => {
  useHideClerk()
  return (
    <div className="flex items-center justify-center py-8">
      <UserProfile />
    </div>
  )
}

export default ProfilePage
