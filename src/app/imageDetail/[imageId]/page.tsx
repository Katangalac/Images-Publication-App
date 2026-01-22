"use client"

import React, { useEffect, useState } from "react"
import { api } from "@/trpc/react"
import { LoadingPage } from "@components/loading"
import ImageTeaser from "@components/ImageTeaser";
import {useUser} from "@clerk/nextjs";

/**
 * Page des détails d'une image
 * Affiche l'image en grand
 * @param params identifiant de l'image
 */
const DetailImagePage = ({ params }: { params: { imageId: string } }) => {
  const { data, isLoading } = api.images.getImageById.useQuery(params)
  const [image, setImage] = useState(data)
  const [openComment, setOpenComment] = useState(false)
  const {user} = useUser();

  useEffect(() => {
    const fetchImages = () => {
      try {
        setImage(data)
      } catch (error) {
        console.error("Error fetching image IDs:", error)
      }
    }

    fetchImages()
  }, [data])

  return (
    <div className="flex h-full items-center justify-center">
      {isLoading ? (
        <LoadingPage />
      ) : (
        <div className="mt-16 rounded-lg bg-white  p-3 md:w-96  sm:w-80 w-11/12">
          {image && <ImageTeaser
              id={image.id}
              description={image.description}
              hashtags={image.hashtags}
              mentionUser={image.mentionUser??undefined}
              imageUuid={image.imageUuid}
              fileName={image.fileName}
              isEditable={user !== null && user!==undefined && user.id === image.userId}
          />
          }
          <div className="mt-6">
            <a href="/images">
              <a className="text-indigo-600 hover:underline">Go Back</a>
            </a>
          </div>
        </div>
      )}
    </div>
  )
}

export default DetailImagePage
