"use client"

import React, { useEffect, useState } from "react"
import { api } from "@/trpc/react"
import { LoadingPage } from "@components/loading"
import ImageTeaser from "@components/ImageTeaser";


/**
 * Structure d'une image
 */
interface ImageData {
  id: number
  description: string | undefined
  hashtags: string | undefined
  mentionUser: string | null
  imageUuid: string
  fileName?:string|null
  haveToBeUploaded?: boolean
}

/**
 * Propriétés du composant
 */
interface ImageListProps {
  mode: 'editMode' | 'readOnlyMode';
  imageProps:{id:string, fileName:string}[];
  setImageProps:(imageProps:{id:string, fileName:string}[])=>void;
  userId?: string,
}

/**
 * Affiche la liste d'images d'un utilisateur
 * @param mode mode d'affichae : readOnly vs editMode
 * @param imageProps liste des propriétés de base (uuid et filename) des nouvelles images uploadées
 * @param setImageProps fonction de modification du imageProps
 * @param userId id de l'utilisateur dont on veut récupérer les images, si undefined => utilisateur courant
 */
export default function ImageList({
  mode,
    imageProps,
    setImageProps,
  userId
}: ImageListProps) {
  const { data: imagesBD } = api.images.getUserImages.useQuery(userId ? { userId } : undefined)
  const [images, setImages] = useState<ImageData[] | undefined>(imagesBD ?? [])
  const [newImagesIds, setNewImagesIds]=useState<string[]>([]);

  useEffect(() => {
    if (imageProps && imageProps.length > 0) {
      // Create an array of new images based on imageUUID
      const newImagesData = imageProps.map((imgProp) => ({
        description: "",
        hashtags: "",
        id: 0,
        mentionUser: "",
        imageUuid: imgProp.id,
        fileName:imgProp.fileName,
        haveToBeUploaded: true,
      }))

      //Save the new IDs for checking for new image state (must be saved or not)
      const newIds = newImagesData.map((data)=>data.imageUuid);
      setNewImagesIds((prev)=>[...prev, ...newIds]);
      // Combine the existing imagesBD with the new images
      const updatedImages = imagesBD
        ? [...imagesBD, ...newImagesData]
        : newImagesData

      setImages(updatedImages)

    } else {
      setImages(imagesBD)
    }
  }, [imagesBD, imageProps])


  if (!images) {
    return <LoadingPage />
  }
  return (
    <div className="flex flex-col">
      <div className="grid grid-cols-1 gap-4 px-4 sm:grid-cols-2 md:grid-cols-4">
        {images && images.length === 0 && <span className={"text-left text-lg font-medium"}>No images yet!</span>}
        {images.length > 0 && images.map((image, index) => (
            <ImageTeaser
                id={image.id}
                description={image.description}
                hashtags={image.hashtags}
                mentionUser={image.mentionUser??undefined}
                imageUuid={image.imageUuid}
                fileName={image.fileName}
                isEditable={mode==="editMode"}
                onDelete={()=>{
                  setImages((prev) =>
                      prev?.filter(item => item.imageUuid !== image.imageUuid))
                  setNewImagesIds((prev)=>prev?.filter(item => item !== image.imageUuid));
                  setImageProps(imageProps.filter(item=>item.id !== image.imageUuid));
                }}
                haveToBeUploaded={newImagesIds.includes(image.imageUuid)}
            />
        ))}
      </div>
    </div>
  )
}
