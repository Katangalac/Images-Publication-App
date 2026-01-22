"use client"
import { FC, useState } from "react"
import ImageList from "@/components/ImageList"

/**
 * Propriétés du composant
 */
interface ImageGetterProps {
  userId: string
}

/**
 * Récupère les images d'un utilisateur en mode readOnly
 * @param userId id de l'utilsiateur

 */
const ImageGetter: FC<ImageGetterProps> = ({ userId }:ImageGetterProps) => {
    const [imageProps, setImageProps]=useState<{id:string, fileName:string}[]>([])
  return (
      <ImageList
          imageProps={imageProps}
          mode={"readOnlyMode"}
          setImageProps={setImageProps}
          userId={userId}
      />
  )
}

export default ImageGetter
