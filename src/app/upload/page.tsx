"use client"

import { FC, useEffect, useRef, useState } from "react"
import * as LR from "@uploadcare/blocks"

import ImageList from "@/components/ImageList"
import {boolean} from "zod";

LR.registerBlocks(LR)
/**
 * Page de téléversement de nouvelles images
 * Chargement avec uploadcare
 */
const Upload: FC = () => {
  const [images, setNewImageProps] = useState<{id:string, fileName:string}[]> ([]);
  const ctxProviderRef = useRef<
    typeof LR.UploadCtxProvider.prototype & LR.UploadCtxProvider
  >(null)
  const [uploadedFiles, setUploadedFiles] = useState<LR.OutputFileEntry[]>([])

  useEffect(() => {
    const handleUpload = (e: CustomEvent<LR.OutputFileEntry[]>) => {
      if (e.detail) {
        setUploadedFiles(() => [...e.detail.map((file) => file)])
      }
    }

    ctxProviderRef.current?.addEventListener("data-output", handleUpload)

    return () => {
      ctxProviderRef.current?.removeEventListener("data-output", handleUpload)
    }
  }, [])

  useEffect(() => {
    const handleDone = () => {

      const newImageProps:{id:string, fileName:string}[] = uploadedFiles.map((file)=>({id:file.uuid, fileName:file.name}))
                                                                     .filter(Boolean) as {id:string, fileName:string}[];
      setNewImageProps((prev)=>[...prev, ...newImageProps]);
      setUploadedFiles([])
      ctxProviderRef.current?.uploadCollection.clearAll()
    }

    ctxProviderRef.current?.addEventListener("done-flow", handleDone)

    return () => {
      ctxProviderRef.current?.removeEventListener("done-flow", handleDone)
    }
  }, [uploadedFiles])

  return (
    <div className="w-full h-full">
      <br />
      <h1 className="text-3xl font-bold text-indigo-700 px-4">My images</h1>
      <br />
      <div className="flex w-full items-center space-x-4 px-4">
        <div className="bg-indigo-100">
          {/*<div>{data}</div>*/}
          <lr-config
            ctx-name="my-uploader"
            pubkey={process.env.NEXT_PUBLIC_UPLOADCARE_PUBLIC_KEY}
            maxLocalFileSizeBytes={5000000}
            imgOnly={true}
            sourceList="local, url, camera, dropbox, facebook, gdrive, gphotos, instagram"
          ></lr-config>
          <lr-file-uploader-regular
            ctx-name="my-uploader"
            class="my-config"
            css-src={`https://cdn.jsdelivr.net/npm/@uploadcare/blocks@0.30.8/web/lr-file-uploader-regular.min.css`}
          ></lr-file-uploader-regular>
          <lr-upload-ctx-provider ctx-name="my-uploader" ref={ctxProviderRef} />
          <br />
        </div>
      </div>
      <br />
      <hr />
      <div className="mt-4">
        <ImageList mode={"editMode"} imageProps={images} setImageProps={setNewImageProps}/>
      </div>
    </div>
  )
}

export default Upload
