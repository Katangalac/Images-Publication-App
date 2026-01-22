"use client"

import React, { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { useUser } from "@clerk/nextjs"
import {UserSearch} from "lucide-react";
import { cn } from "@/lib/utils"
import {api} from "@/trpc/react";

/**
 * Input de recherche d'utilisateur avec dropdown d'affichage des suggestions
 */
export default function SearchUserInput() {
    const {data:images} = api.images.getImages.useQuery()
    const [topMentionUsers, setTopMentionUsers] = useState<string[]>([])
    const router = useRouter()
    const [searchValue, setSearchValue] = useState("") // État pour suivre la valeur de recherche
    const [temp, setTemp] = useState("")
    const [showDropdown, setShowDropdown] = useState(false);
    const user = useUser() // Utilisez le hook useUser pour obtenir les informations de l'utilisateur actuellement connecté

    /**
     * Effet pour déterminé les 5 de mentions les plus utilisés
     */
    useEffect(() => {
        if(images){

            const mentionUsersList = images.map((image) => image.mentionUser);

            const mentionUserCount: Record<string, number> = {};
            mentionUsersList.forEach((mentionUser) => {
                if(mentionUser){
                    if (mentionUserCount[mentionUser]) {
                        mentionUserCount[mentionUser] += 1;
                    } else {
                        mentionUserCount[mentionUser] = 1;
                    }
                }
            });

            const mentionUserCountArray = Object.entries(mentionUserCount).map(([mentionUser, count]) => ({
                mentionUser,
                count,
            }));

            mentionUserCountArray.sort((a, b) => b.count - a.count);

            const top5MentionUsers = mentionUserCountArray.slice(0, 5);
            const top5List = top5MentionUsers.map((mentionUser) =>{
                const username  = mentionUser.mentionUser
                if (username.startsWith('@')){
                    return username.slice(1)
                }
                return username
            })
            setTopMentionUsers(top5List)
        }
    }, [images]);

    /**
     * Vérifie que le paramètre de recherche n'est pas vide et rédirige vers la page
     * des résultats
     */
    const handleSearch = () => {
        if (searchValue.trim()) {
            router.push(`/searchUsers/${encodeURIComponent(searchValue)}`)
            setTemp("")
        }
    }

    /**
     * Écoute les modification sur l'input de recherche
     * @param e évenement de saisi/modification de la valeur de l'input
     */
    const change = (e: React.ChangeEvent<HTMLInputElement>) => {
        if(!temp){
            setSearchValue(e.target.value)
        }else{
            setSearchValue(temp)
        }
    }

    /**
     * Gère le click d'un item du dropdown des suggestions (résultats)
     * @param username le username de l'utilisateur suggéré par l'item clické
     */
    const handleDropdownItemClick = (username:string) => {
        setSearchValue(username)
        setShowDropdown(false);
    };

    /**
     * Empêche le clic dans le dropdown de déclencher le masquage via onBlur de l'input
     * @param e évenement de click
     */
    const handleDropdownMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

  return (
    <div className={cn("flex", user.isSignedIn === false && "hidden")}>
        <div className={"relative"}>
            <input
                type="search"
                className="block w-full focus:outline-indigo-600 rounded-l-full border border-r-0 border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900"
                placeholder={"Search for user..."}
                value={searchValue}
                onChange={change}
                onFocus={() => setShowDropdown(true)}
                onBlur={() => setShowDropdown(false)}
            />
            {showDropdown && (
                <div className="flex flex-col absolute items-center top-full left-0 w-full bg-white border border-gray-300 shadow-lg rounded-b-lg mt-1 z-40" onMouseDown={handleDropdownMouseDown}>
                    <h1 className={"p-2 text-indigo-400 text-sm text-left w-full px-2 border-b"}>Most popular users</h1>
                    <hr/>
                    {topMentionUsers.map((username) => (
                        <button
                            key={username}
                            className="block w-full p-2 text-sm text-left text-gray-900 hover:bg-gray-100"
                            onClick={() => handleDropdownItemClick(username)}
                        >
                            @{username}
                        </button>
                    ))}
                </div>
            )}
        </div>
      <button
        type="submit"
        className="h-full rounded-r-full border border-indigo-600 bg-indigo-600 p-2.5 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none disabled:bg-gray-400"
        onClick={handleSearch}
      >
          <UserSearch className={"size-5 h-full"}/>
      </button>
    </div>
  )
}
