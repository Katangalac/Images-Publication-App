'use client'

import Link from "next/link"
import React from "react"
import {Search} from "lucide-react"
import { cn } from "@/lib/utils"

import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faMagnifyingGlass} from "@fortawesome/free-solid-svg-icons"
import { Button } from "@/components/ui/button"
import { useUser } from "@clerk/nextjs"

/**
 * Bouton de recherche d'images
 * Rédirige vers la page de recherche
 */
export function SearchImagesButton(){
    const user = useUser();
    return (
        <Button title={"Search for specific images"}
                className={cn("rounded-full border-gray-300 text-gray-600 hover:bg-indigo-600 hover:text-white hover:border-indigo-600", !user.isSignedIn && "hidden")}
                variant="outline"
                size="icon" asChild>
            <Link href={'/SearchImages'}>
                <Search className={"size-5"}/>
            </Link>
        </Button>
    )
}