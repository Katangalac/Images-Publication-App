"use client"

import React, { useEffect, useState } from "react"
import { api } from "@/trpc/react";
import Pagination from "@/components/Pagination"
import { LoadingPage } from "@components/loading"
import { OpenSections } from "@/app/images/page";
import ImageTeaser from "@components/ImageTeaser";
import {useUser} from "@clerk/nextjs"

/**
 * Page de recherche d'images
 * Recherche par mot clé (hashtags=>#) ou description
 */
export default function SearchImages() {
    const {user}=useUser();
    const [search, setSearch] = useState(0)
    const [description, setDescription] = useState<string>("")
    const [keyword, setKeyword] = useState<string>("")
    const [currentPage, setCurrentPage] = useState(1);
    const [perPage] = useState(12);
    const [totalPages, setTotalPages] = useState(0);
    const [results, setResult] = useState(0)
    const [topKeyWord, setTopKeyWord] = useState<string[]>([])
    const [showDropdown, setShowDropdown] = useState(false);
    const { data: images } = api.images.getImages.useQuery()
    const { data: totalImages, isLoading: allOnLoad, refetch: refecthTotalResults } = api.images.getImages.useQuery({ description: description, hashtags: keyword }, { enabled: false })
    const { data: imagesBD, isLoading: onLoad, refetch: refetchImagesPerPage } = api.images.getImages.useQuery({ description: description, hashtags: keyword, pagination: { page: currentPage, limit: perPage } }, { enabled: false })

    /**
     * Gère le click d'un item du dropdown des suggestions (résultats)
     * @param keyword le mot clé (#) de l'image suggérée par l'item clické
     */
    const handleDropdownItemClick = (keyword: string) => {
        setKeyword(keyword)
        setShowDropdown(false);
    };

    /**
     * Empêche le clic dans le dropdown de déclencher le masquage via onBlur de l'input
     * @param e évenement de click
     */
    const handleDropdownMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
        e.preventDefault();
    };

    /**
     * Effet pour déterminé les 5 mots clés (hashtags) les plus utilisés
     */
    useEffect(() => {
        if (images) {
            const keyWordList = images.map((image) => image.hashtags);
            const keyWordCount: Record<string, number> = {};
            keyWordList.forEach((keyword) => {
                if (keyword) {
                    if (keyWordCount[keyword]) {
                        keyWordCount[keyword] += 1;
                    } else {
                        keyWordCount[keyword] = 1;
                    }
                }
            });

            const keyWordCountArray = Object.entries(keyWordCount).map(([keyWord, count]) => ({
                keyWord,
                count,
            }));

            keyWordCountArray.sort((a, b) => b.count - a.count);

            const top5KeyWord = keyWordCountArray.slice(0, 5);
            const top5List = top5KeyWord.map((keyword) => keyword.keyWord)
            setTopKeyWord(top5List)

        }
    }, [images]);

    /**
     * Gère la recherche des images
     */
    const searchImages = async () => {
        try {
            setSearch(1)
            await refecthTotalResults()
            await refetchImagesPerPage()
            setCurrentPage(1)
        } catch (error) {
            console.log("Error while fetching images", error)
        }
    }

    /**
     * Recharge les images
     */
    const reloadImagesPage = async () => {
        setSearch(1)
        try {
            await refetchImagesPerPage()
        } catch (error) {
            console.log("Error while fetching images", error)
        }
    }

    /**
     * Effet pour mettre à jour le nombre de résultats trouvés
     * et le nombre total de pages
     */
    useEffect(() => {
        if (totalImages && search === 1) {
            setResult(totalImages.length)
            setTotalPages(Math.ceil(totalImages.length / perPage));
        }
    }, [totalImages])


    /**
     * Effet pour recharger
     */
    useEffect(() => {
        if (search === 1) {
            // eslint-disable-next-line @typescript-eslint/no-empty-function
            void reloadImagesPage().then(r => { })
        }
    }, [currentPage]);


    /**
     * Met à jour la page courante
     * @param page nouvelle page courante
     */
    const handlePaginationChange = (page: number) => {
        setCurrentPage(page);
    };

    return (
        <div className={"align-middle justify-center py-5"}>
            <h1 className="md:text-2xl sm:text-xl font-bold mx-5 text-indigo-700">Search images by : </h1>
            <div className={"flex flex-row rounded items-end  w-full gap-10 mx-5 p-5"}>
                {/*Input pour le mot clé*/}
                {!(!!keyword) && (
                    <div className={"flex flex-col"}>
                        <label className="font-medium mb-1">Description</label>
                        <input
                            className={"border border-gray-300 rounded-md px-2 py-2 focus:outline-indigo-600"}
                            id={"descriptionInput"}
                            type={"text"}
                            onChange={(e) => {
                                setSearch(0)
                                setDescription(e.target.value)
                            }
                            }
                            readOnly={!!keyword}
                        />
                    </div>
                )}

                {/*Input pour la description*/}
                {!(!!description) && (
                    <div className={"flex flex-col relative"}>
                        <label className="font-medium mb-1">Keyword(#)</label>
                        <input
                            className={"border border-gray-300 rounded-md px-2 py-2 focus:outline-indigo-600"}
                            id={"keywordInput"}
                            type={"text"}
                            onChange={(e) => {
                                setSearch(0)
                                setKeyword(e.target.value)
                            }
                            }
                            value={keyword}
                            onFocus={() => setShowDropdown(true)}
                            onBlur={() => setShowDropdown(false)}
                            readOnly={!!description}
                        />
                        {showDropdown && (
                            <div className="flex flex-col absolute items-center top-full left-0 w-full bg-white border border-gray-300 shadow-lg rounded-b-lg mt-1" onMouseDown={handleDropdownMouseDown}>
                                <h1 className={"p-2 border-b text-indigo-400 w-full text-left text-sm"}>Most popular keywords</h1>
                                <hr />
                                {topKeyWord.map((keyword) => (
                                    <button
                                        key={keyword}
                                        className="block w-full p-2 text-sm text-left text-gray-900 hover:bg-gray-100"
                                        onClick={() => handleDropdownItemClick(keyword)}
                                    >
                                        {keyword}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                )}
                {(!!description || !!keyword) && (
                    <div className={"flex"}>
                        <button
                            onClick={async () => await searchImages()}
                            className={"flex mx-auto mb-0.5 text-white bg-indigo-600 py-2 px-4 focus:outline-indigo-400 hover:bg-indigo-700 rounded-md font-medium"}
                        >
                            Submit
                        </button>
                    </div>
                )}
            </div>
            <hr></hr>
            <div className={"flex-col m-5"}>
                {search === 1 && !onLoad && !allOnLoad && (
                    <h1 className="md:text-2xl sm:text-xl font-medium ">Results({results})</h1>
                )}
                {search === 1 && onLoad && (
                    <LoadingPage />
                )}
                {search === 1 && imagesBD && imagesBD.length > 0 && (
                    <div className="grid grid-cols-1 md:grid-cols-4 sm:grid-cols-2 gap-4 px-4 my-4">
                        {imagesBD?.map((image, index) => (
                            <a href={`/imageDetail/${image.id}`} key={index}>
                                <ImageTeaser
                                    id={image.id}
                                    description={image.description}
                                    hashtags={image.hashtags}
                                    mentionUser={image.mentionUser??undefined}
                                    imageUuid={image.imageUuid}
                                    fileName={image.fileName}
                                    isEditable={user !== null && user !== undefined && user.id === image.userId}
                                />
                            </a>
                        ))}
                    </div>
                )}
            </div>
            {search === 1 && !allOnLoad && !onLoad && results > 0 && (
                <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePaginationChange}></Pagination>
            )}
        </div>
    )
}
