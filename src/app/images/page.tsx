"use client"

import React, { useEffect, useState } from "react"
import ImageTeaser from "@components/ImageTeaser";
import { api } from "@/trpc/react"
import { LoadingPage } from "@components/loading"
import Pagination from "@/components/Pagination"
import { Button } from "@/components/ui/button"
import { z } from "zod";

/**
 * Strucutre des paramètre d'ordonnancement
 */
const SortType = z.enum(["asc", "desc"]);
type Sort = z.infer<typeof SortType>;

/**
 * Page des images de l'application
 */
const ImagesPage: React.FC = () => {
  const { data, isLoading } = api.images.getAllImagesOrderByDate.useQuery()
  const [images, setImages] = useState(data)
  const [currentPage, setCurrentPage] = useState(1);
  const [perPage] = useState(12);
  const [totalPages, setTotalPages] = useState(0);
  const [sort, setSort] = useState<Sort>("asc")
  const { data: imagesPerPage, isLoading: pageLoading, refetch: refetchPage } = api.images.getAllImagesOrderByDate.useQuery({ pagination: { page: currentPage, limit: perPage }, orderBy: sort })

  /**
   *
   */
  useEffect(() => {
    const fetchImages = () => {
      try {
        setImages(imagesPerPage)
      } catch (error) {
        console.error("Error fetching image IDs:", error)
      }
    }
    fetchImages()
  }, [imagesPerPage])

  /**
   * Effet pour mettre à jour le nombre total de page en fonction des images
   */
  useEffect(() => {
    if (data) {
      setTotalPages(Math.ceil(data.length / perPage));
    }
  }, [data]);

  /**
   * Effet pour recharger les images en fonction de la page courante
   */
  useEffect(() => {
    const fetchImages = async () => {
      await refetchPage()
    }
    void fetchImages().then()
  }, [currentPage]);

  /**
   * Fonction d'ordonnancement des images
   */
  function sortByDate() {
    if (sort === "asc") {
      setSort("desc")
    } else {
      setSort("asc")
    }
  }

  /**
   * Gère le changement de la page courante
   * @param page nouvelle valeur de la page courante.
   */
  const handlePaginationChange = (page: number) => {
    setCurrentPage(page);
  }

  if (isLoading) {
    return <LoadingPage />
  } else {
    return (
      <div>
        <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 md:grid-cols-4">
          {isLoading ?? <LoadingPage />}
          <div className="col-span-full mb-4 mt-6 flex flex-col items-start">
            <h1 className="text-3xl font-bold text-indigo-700">Posted Images</h1>
            <br />
            <Button onClick={() => sortByDate()} className="bg-indigo-600 focus:outline-indigo-400 hover:bg-indigo-700">
              Sort by {sort === "desc" ? "newest to oldest" : "oldest to newest"}
            </Button>
          </div>
          {images?.map((image, index: number) => (
            <a href={`/imageDetail/${image.id}`}  key={index}>
              <ImageTeaser
                  id={image.id}
                  description={image.description}
                  hashtags={image.hashtags}
                  mentionUser={image.mentionUser??undefined}
                  imageUuid={image.imageUuid}
                  fileName={image.fileName}
              />
            </a>
          ))}
        </div>
        {!isLoading && !pageLoading && (
          <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePaginationChange}></Pagination>
        )}
      </div>
    )
  }
}

export default ImagesPage