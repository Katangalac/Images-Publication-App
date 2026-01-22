import Image from "next/image"
import Link from "next/link"
import { UserButton } from "@clerk/nextjs"
import { SearchImagesButton } from "@components/searchImagesButton"
import SearchUserInput from "@components/searchUserInput"
import AuthMenu from "./auth-menu"

/** Header de l'application*/
export function Header() {
  return (
    <header>
      <nav className="shadow-md border-b-4 border-indigo-600">
        <div className="mx-auto max-w-7xl">
          <div className="flex h-16 items-center justify-between gap-1 px-2">
            <div className="hidden sm:block">
              <Link className="flex-shrink-0" href="/">
                <Image
                  priority
                  src="/favicon.ico"
                  alt="Uimages"
                  width={48}
                  height={48}
                />
              </Link>
            </div>
            <div className={"flex gap-4"}>
              <SearchUserInput></SearchUserInput>
              <SearchImagesButton></SearchImagesButton>
            </div>
            <div className="flex flex-row gap-4 justify-between">
              <AuthMenu />
              <UserButton userProfileUrl="/profile" afterSignOutUrl="/" />
            </div>
          </div>
        </div>
      </nav>
    </header>
  )
}
