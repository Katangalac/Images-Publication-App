"use client"

import { type FC } from "react"
import Link from "next/link"
import { useAuth } from "@clerk/nextjs"
import { Menu, Home, Image, Info, Users, ImagePlusIcon, Mail} from "lucide-react"
import { cn } from "@/lib/utils"
import { usePathname } from 'next/navigation';

import { Button } from "@/components/ui/button"

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu"

/**
 * Propriétés du composant
 */
type AuthMenuProps = {
  classname?: string
}

/**
 * Metadonnées sur les liens du navbar du header
 */
const links = [
  { href: "/", label: "Home", icon:<Home className={"size-4"}/> },
  { href: "/images", label: "Images", icon:<Image className={"size-4"}/> },
  { href: "/upload", label: "My images", icon:<ImagePlusIcon className={"size-4"}/> },
  { href: "/users", label: "Users", icon:<Users className={"size-4"}/> },
  { href: "/contact", label: "Contact", icon:<Mail className={"size-4"}/> },
  { href: "/about", label: "About", icon:<Info className={"size-4"}/> },
];

/**
 * Menu de navigation pour un utilisateur authentifié
 * @param classname style css
 */
const AuthMenu: FC<AuthMenuProps> = ({ classname }) => {
  const { isSignedIn } = useAuth()
  const pathname = usePathname();

  return (
    <>
      {isSignedIn === true ? (
        <>
          <div className={cn("hidden flex-wrap justify-center sm:flex sm:justify-start", classname)}>
            <nav className={"flex gap-6 items-center"}>
              {links.map((link) => {
                const isActive = pathname === link.href;

                return (
                    <Link
                        key={link.href}
                        href={link.href}
                        className={cn("flex gap-1 items-center",isActive ? "text-indigo-600 font-medium" : "text-gray-500 hover:text-indigo-600")}
                    >
                      {link.icon}
                      {link.label}
                    </Link>
                );
              })}
            </nav>
          </div>

          <div className={"mx-2 sm:hidden flex items-center"}>
            <DropdownMenu>
              <DropdownMenuTrigger>
                <Menu className={"h-full"} size={30} />
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Menu</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {links.map((link) => {
                  const isActive = pathname === link.href;

                  return (
                      <Link
                          key={link.href}
                          href={link.href}
                          className={isActive ? "text-indigo-600 font-medium" : "text-gray-500 hover:text-indigo-600"}
                      >
                        <DropdownMenuItem className="hover:bg-gray-100 flex gap-1 items-center">
                          {link.icon}
                          {link.label}
                        </DropdownMenuItem>
                      </Link>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </>
      ) : (
        <Link href="/sign-in">
          <Button className={"mx-1 sm:h-11 sm:px-8"} size={"default"}>
            Sign in
          </Button>
        </Link>
      )}
    </>
  )
}

export default AuthMenu
