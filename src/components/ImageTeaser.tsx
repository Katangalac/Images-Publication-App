'use client';

import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, ThumbsDown, Trash2, Pencil, X, FlipVertical, Save } from 'lucide-react';
import {uploadBaseUrl} from "../../utils/urls";
import {api} from "@/trpc/react";
import {useUser} from "@clerk/nextjs";
import {faPaperPlane} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {toast} from "sonner";
import {cn} from "@/lib/utils";
import {useQueryClient} from "@tanstack/react-query";
import {z} from "zod";

/**
 * Structure d'un commentaire
 */
type Comment = {
    id: number;
    content: string;
    userName: string|null;
    userImageUrl: string|null;
    createdAt: Date;
};

/**
 * Propriétés du composant
 */
type ImageTeaserProps = {
    id: number;
    description: string | undefined;
    hashtags: string | undefined;
    mentionUser: string | undefined;
    imageUuid: string;
    fileName?: string | null;
    haveToBeUploaded?: boolean;
    isEditable?: boolean;
    handleChange?:(key:string, value:string)=>void;
    onLike?: () => void;
    onDislike?: () => void;
    onDelete?: () => void;
    onSave?: (data: { description: string; hashtags: string; mentionUser: string }) => void;
}

/**
 * Carte d'affichage d'une image et ses informations (metadata)
 * @param id id de l'image
 * @param description description de l'image
 * @param hashtags hashtags de l'image
 * @param mentionUser mentions des utilisateurs sur l'images
 * @param imageUuid uuid de l'image
 * @param fileName nom de l'image
 * @param isEditable mode d'affichage : readonly ou editable
 * @param haveToBeUploaded  indique si l'image vient d'etre uploadée et doit être sauvegardée par le user
 * @param onLike  fonction à appeller lors du like de l'image
 * @param onDislike  fonction à appeller lors du dislike de l'image
 * @param onDelete  fonction à appeller lors de la suppression
 * @param onSave  fonction à appeller lors de la sauvegarde
 */
export default function ImageTeaser({
                                        id,
                                        description,
                                        hashtags,
                                        mentionUser,
                                        imageUuid,
                                        fileName,
                                        isEditable = false,
                                        haveToBeUploaded,
                                        onLike,
                                        onDislike,
                                        onDelete,
                                        onSave
                                    }: ImageTeaserProps) {

    // Queries pour les likes/dislikes
    const { data: image } = api.images.getImageById.useQuery({ imageId: id.toString() });
    const { data: imageLikes, refetch: refetchImageLikes } = api.images.getImageLikes.useQuery({ imageId: id });
    const { data: userReaction, refetch: refetchUserReaction } = api.images.getImageUserLikes.useQuery({ imageId: id });
    const { data: imageComments, refetch: refetchImageComments } = api.images.getImageComments.useQuery({ imageId: id });
    const {user} = useUser()
    const queryClient = useQueryClient();

    // États pour likes/dislikes
    const [likes, setLikes] = useState(0);
    const [disLikes, setDisLikes] = useState(0);

    //États pour les commentaires
    const [showComments, setShowComments] = useState(false);
    const [newComment, setNewComment] = useState('');
    const [comments, setComments] = useState<Comment[]>([]);

    const [isEditMode, setIsEditMode] = useState(false);
    const [hideEditButon, setHideEditButon] = useState(false);
    const [showDescription, setShowDescription] = useState(false);

    // États pour l'édition
    const [editDescription, setEditDescription] = useState(description || '');
    const [editHashtags, setEditHashtags] = useState(hashtags || '');
    const [editMentions, setEditMentions] = useState(mentionUser || '');

    // Construction de l'URL de l'image
    const imageUrl = fileName
        ? `${uploadBaseUrl}${imageUuid}/-/preview/1000x625`
        : `${uploadBaseUrl}${imageUuid}/`;

    //Mutation de création d'image
    const imgCreate = api.images.create.useMutation({
        onSuccess: () => {
            toast.success("Image created successfully",{position:"top-right"});
        },
        onError: (error) => {
            toast.error("Something went wrong", {position:"top-right"});
            console.error("Error creating image:", error);
        },
    })

    //Mutation de modification d'image
    const imgUpdate = api.images.updateImage.useMutation({
        onSuccess: () => {
            toast.success("Image updated successfully",{position:"top-right"});
        },
        onError: (error) => {
            toast.error("Something went wrong", {position:"top-right"});
            console.error("Error updating image:", error);
        },
    })

    //Mutation de suppression d'image
    const imgDelete = api.images.deleteImageById.useMutation({
        onSuccess: () => {
            toast.success("Image deleted successfully",{position:"top-right"});
        },
        onError: (error) => {
            toast.error("Something went wrong", {position:"top-right"});
            console.error("Error updating image:", error);
        },
    })



    // Mutation pour les likes/dislikes
    const likeImg = api.images.addLikeToImage.useMutation({
        onSuccess: () => {
            toast.success("Reaction added successfully",{position:"top-right"});
        },
        onError: (error) => {
            toast.error("Something went wrong", {position:"top-right"});
            console.error("Error reacting to image:", error);
        },
    });

    // Mutations pour les commentaires
    const commentImg = api.images.addCommentToImage.useMutation({
        onSuccess: () => {
           toast.success("Comment added successfully",{position:"top-right"});
        },
        onError: (error) => {
            toast.error("Something went wrong",{position:"top-right"});
            console.error("Error commenting image:", error);
        },
    });

    const deleteComment = api.images.deleteAllComments.useMutation({
        onSuccess: () => {
            toast.success("Comments deleted successfully",{position:"top-right"});
        },
        onError: (error) => {
            toast.error("Something went wrong",{position:"top-right"});
            console.error("Error deleting comments:", error);
        },
    });

    // Effet pour compter les likes et dislikes
    useEffect(() => {
        if (imageLikes) {
            const likesCount = imageLikes.filter(like => like.reactionType === "like");
            const dislikesCount = imageLikes.filter(like => like.reactionType === 'dislike');
            setLikes(likesCount.length);
            setDisLikes(dislikesCount.length);
        }
    }, [imageLikes]);

    // Effet pour charger les commentaires
    useEffect(() => {
        if (imageComments) {
            setComments(imageComments);
        }
    }, [imageComments]);

    //Hanler pour l'update d'image
    const handleSave  = async()=>{
        const descIsNotEmpty = editDescription.trim()!=="";
        const hashtagsISNotEmpty = editHashtags.trim()!=="";
        const mentionsIsNotEmpty = editMentions.trim()!=="";
        if(user && haveToBeUploaded){
            const imageData = {
                description: editDescription,
                hashtags: editHashtags,
                mentionUser: editMentions,
                imageUuid: imageUuid,
                fileName:fileName??undefined,
            }
            await imgCreate.mutateAsync(imageData);
            onDelete?.();
        }
        else if(user && isEditable){
            const imgDesc = descIsNotEmpty? editDescription:description;
            const imgHashtags = hashtagsISNotEmpty? editHashtags:hashtags;
            const imgMentions = mentionsIsNotEmpty? editMentions:mentionUser;
            await imgUpdate.mutateAsync({id:id, description:imgDesc, hashtags:imgHashtags, mentionUser:imgMentions, userId:user.id } )
        }
        await queryClient.invalidateQueries([
            ["images", "getUserImages"],
            {
                type: "query",
            },
        ])
        setIsEditMode(false);
    }

    //Hanler pour la suppression d'image
    const handleDelete  = async()=>{
        if(user && haveToBeUploaded){
            onDelete?.();
        }
        else if(user && isEditable){
           await imgDelete.mutateAsync({id:id})
            await queryClient.invalidateQueries([
                ["images", "getUserImages"],
                {
                    type: "query",
                },
            ])
        }
    }

    // Handler pour le like
    const handleLike = async () => {
        await likeImg.mutateAsync({ imageId: id, reactionType: "like" });
        await refetchImageLikes();
        await refetchUserReaction();
    };

    // Handler pour le dislike
    const handleDislike = async () => {
        await likeImg.mutateAsync({ imageId: id, reactionType: "dislike" });
        await refetchImageLikes();
        await refetchUserReaction();
    };

    // Handler pour ajouter un commentaire
    const handleCommentClick = async () => {
        if (newComment.trim() !== '' && user) {
            await commentImg.mutateAsync({
                imageId: id,
                content: newComment,
                userImageUrl: user.imageUrl,
                userName: user.username
            });
            await refetchImageComments();
            setNewComment('');
        }
    };

    // Handler pour supprimer tous les commentaires (pour les admins/propriétaires)
    const deleteAllComments = async () => {
        await deleteComment.mutateAsync();
        await refetchImageComments();
    };

    // Handler pour envoyer avec Enter
    const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === 'Enter') {
            handleCommentClick();
        }
    };

    const handleCancelEdit = () => {
        setEditDescription(description || '');
        setEditHashtags(hashtags || '');
        setEditMentions(mentionUser || '');
        setIsEditMode(false);
    };

    return (
        <div className={cn("relative w-full max-w-2xl mx-auto border border-gray-300 shadow-indigo-500 bg-white rounded-lg shadow-lg overflow-hidden", haveToBeUploaded && "shadow-red-500")}>
            {/* Panel de commentaires en mode étendu */}
            {showComments ? (
                <div className="h-[600px] flex flex-col">
                    <div className="flex items-center justify-between p-4 border-b">
                        <h3 className="font-semibold">
                            Comments {comments.length > 0 && `(${comments.length})`}
                        </h3>
                        <div className="flex items-center gap-2">
                            <button
                                onClick={() => setShowComments(false)}
                                className="p-2 hover:bg-gray-100 rounded-full transition"
                            >
                                <X className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Liste des commentaires */}
                    <div className="flex-1 overflow-y-auto p-4 space-y-4">
                        {comments.length === 0 ? (
                            <p className="text-gray-500 text-center mt-8">No comments yet!</p>
                        ) : (
                            comments.map((comment) => (
                                <div key={comment.id} className="flex gap-2 items-center">
                                    {/* Avatar de l'utilisateur */}
                                    <img
                                        src={comment.userImageUrl || '/default-avatar.png'}
                                        alt={comment.userName||"Unknown"}
                                        className="w-6 h-6 rounded-full object-cover flex-shrink-0"
                                    />
                                    <div className="flex-1 items-center flex flex-col">
                                        <div className="bg-indigo-100 rounded-lg px-3 py-2 w-full">
                                            <p className="font-semibold text-xs text-gray-900">{comment.userName ?? "unknown"}</p>
                                            <p className="text-gray-700 mt-1 text-xs">{comment.content}</p>
                                        </div>
                                        <p className="text-xs text-left text-gray-500 mt-1 ml-3 w-full">
                                            {new Date(comment.createdAt).toLocaleDateString('en-EN', {
                                                day: 'numeric',
                                                month: 'short',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>

                    {/* Zone de saisie de commentaire */}
                    <div className="px-2 py-4 border-t w-full">
                        <div className="flex gap-2 w-full">
                            <div className="flex items-center w-full max-w-full pr-1 rounded-full border border-gray-300 focus:outline-indigo-600">
                                <input
                                    type="text"
                                    value={newComment}
                                    onChange={(e) => setNewComment(e.target.value)}
                                    onKeyPress={handleKeyPress}
                                    placeholder="Add a comment..."
                                    className="flex-1 px-4 py-2 w-full border-none rounded-full focus:outline-none"
                                />
                                <button
                                    onClick={handleCommentClick}
                                    disabled={newComment.trim() === ''}
                                    className="flex justify-center items-center p-2 bg-indigo-600 rounded-2xl border border-indigo-300 hover:bg-indigo-700  font-medium transition disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    <FontAwesomeIcon icon={faPaperPlane} className={"text-white h-3 w-3"}/>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ) : (
                <>
                    {/* Conteneur principal de l'image */}
                    <div className="relative aspect-square bg-gray-100">
                        {/* Image ou Description */}
                        <div className={`w-full h-full transition-all duration-500 ${showDescription ? 'rotate-180' : ''}`}>
                            {!showDescription ? (
                                <img
                                    src={imageUrl}
                                    alt={description || 'Image'}
                                    className="w-full h-full object-cover"
                                />
                            ) : (
                                <div className={cn("w-full h-full bg-gradient-to-br from-gray-900 to-gray-700 px-4 pt-14 flex flex-col justify-center items-start text-white rotate-180", !isEditable || hideEditButon ? 'justify-start':'')}>
                                    {description && (
                                        <p className="mb-6 text-center">{description}</p>
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Bouton pour basculer description */}
                        <button
                            onClick={() => {setShowDescription(!showDescription); setHideEditButon(!hideEditButon)}}
                            className="absolute top-4 right-4 p-2 bg-black/50 hover:bg-black/70 text-white rounded-full transition"
                        >
                            <FlipVertical className="w-5 h-5" />
                        </button>

                        {/* Bouton d'édition (mode éditable uniquement) */}
                        {!hideEditButon && isEditable && !isEditMode && (
                            <button
                                onClick={() => setIsEditMode(true)}
                                className="absolute top-4 left-4 p-3 bg-white border hover:bg-gray-100 hover:text-indigo-600 rounded-full shadow-lg transition"
                            >
                                {
                                    haveToBeUploaded ? (<span className="flex items-center font-bold text-red-600 gap-0.5"><Save className="w-5 h-5 text-red-700 hover:text-red-700"/>!</span>):
                                        (<Pencil className="w-5 h-5 text-gray-700 hover:text-indigo-700" />)
                                }
                            </button>
                        )}
                    </div>

                    {/* Mode édition */}
                    {isEditMode && (
                        <div className="p-6 bg-gray-50 border-t space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Description
                                </label>
                                <textarea
                                    value={editDescription}
                                    onChange={(e) => setEditDescription(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    rows={3}
                                    placeholder="Describe your image..."
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Hashtags
                                </label>
                                <input
                                    type="text"
                                    value={editHashtags}
                                    onChange={(e) => setEditHashtags(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="#nature #voyage #photo"
                                />
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">
                                    Mentions
                                </label>
                                <input
                                    type="text"
                                    value={editMentions}
                                    onChange={(e) => setEditMentions(e.target.value)}
                                    className="w-full px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                                    placeholder="@user1 @user2"
                                />
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={handleSave}
                                    className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-medium transition"
                                >
                                    Save
                                </button>
                                <button
                                    onClick={handleCancelEdit}
                                    className="flex-1 px-4 py-2 bg-gray-300 hover:bg-gray-200 text-gray-700 rounded-lg font-medium transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Barre d'actions */}
                    <div className="flex relative z-10 items-center justify-between px-2.5 py-2 border-t">
                        <div className="flex items-center gap-4">
                            {/* Bouton Like */}
                            <div className="flex flex-col items-center">
                                <button
                                    onClick={handleLike}
                                    className={`p-1.5 rounded-full transition ${
                                        likes>0
                                            ? 'bg-red-100 text-red-600'
                                            : 'hover:bg-red-100 hover:text-red-600 text-gray-700'
                                    }`}
                                >
                                    <Heart className={`w-5 h-5 ${likes > 0 ? 'fill-current' : ''}`} />
                                </button>
                                <span className="text-sm font-medium">{likes}</span>
                            </div>

                            {/* Bouton Commentaires */}
                            <div className="flex flex-col items-center">
                                <button
                                    onClick={() => setShowComments(true)}
                                    className="p-1.5 hover:bg-gray-200 rounded-full transition text-gray-700"
                                >
                                    <MessageCircle className="w-5 h-5" />
                                </button>
                                <span className="text-sm font-medium">{comments.length}</span>
                            </div>

                            {/* Bouton Dislike */}
                            <div className="flex flex-col items-center">
                                <button
                                    onClick={handleDislike}
                                    className={`p-1.5 rounded-full transition ${
                                        disLikes>0
                                            ? 'bg-indigo-100 text-indigo-600'
                                            : 'hover:bg-indigo-100 hover:text-indigo-600 text-gray-700'
                                    }`}
                                >
                                    <ThumbsDown className={`w-5 h-5 ${disLikes > 0 ?'fill-current' : ''}`} />
                                </button>
                                <span className="text-sm font-medium">{disLikes}</span>
                            </div>
                        </div>

                        {/* Bouton Supprimer (mode éditable uniquement) */}
                        {isEditable && (
                            <button
                                onClick={handleDelete}
                                className="p-1.5 hover:bg-red-100 rounded-full transition text-red-600"
                            >
                                <Trash2 className="w-5 h-5" />
                            </button>
                        )}
                    </div>

                    {/* Informations sous l'image (quand pas en mode édition) */}
                    {!isEditMode && (
                        <div className="px-4 pb-4 space-y-2">
                            {hashtags && (
                                <div className="text-blue-600 font-medium text-sm">
                                    {hashtags}
                                </div>
                            )}

                            {mentionUser && (
                                <div className="text-purple-600 font-medium text-sm">
                                    {mentionUser}
                                </div>
                            )}
                        </div>
                    )}
                </>
            )}
        </div>
    );
}