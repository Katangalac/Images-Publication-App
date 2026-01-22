import {createTRPCRouter, protectedProcedure} from "@/server/api/trpc"
import {z} from "zod"

/**
 * Structure des paramètres de pagination
 */
const pagination = z.object({
    page: z.number().min(1).optional(),
    limit: z.number().min(1).optional(),
});

/**
 * Router pour les requetes CRUD des images
 * Les procédures trPC utilisent zod pour valider leurs inputs
 */
export const imagesRouter = createTRPCRouter({
    /**
     * Crée une une nouvelle image dans la BD
     */
    create: protectedProcedure
    .input(
      z.object({
        description: z.string().optional(),
        hashtags: z.string().optional(),
        mentionUser: z.string().optional(),
        imageUuid: z.string().min(1),
          fileName:z.string().optional(),
        userId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return ctx.db.image.create({
        data: {
          description: input.description!,
          hashtags: input.hashtags!,
          mentionUser: input.mentionUser!,
          imageUuid: input.imageUuid,
            fileName:input.fileName,
          userId: ctx.auth.userId,
        },
      })
    }),

/**
 * Met à jour une image
 */
  updateImage: protectedProcedure
    .input(
      z.object({
        id: z.number(),
        description: z.string().optional(),
        hashtags: z.string().optional(),
        mentionUser: z.string().optional(),
        userId: z.string().optional(),
      })
    )
    .mutation(async ({ ctx, input }) => {
      return await ctx.db.image.update({
        where: {
          id: input.id,
        },
        data: {
          description: input.description,
          hashtags: input.hashtags,
          mentionUser: input.mentionUser,
        },
      })
    }),


    /**
     * Supprime une image
     */
    deleteImageById: protectedProcedure
    .input(
      z.object({
        id: z.number(),
      })
    ).mutation(async ({ ctx, input }) => {
      // eslint-disable-next-line @typescript-eslint/no-unsafe-call
      await ctx.db.reaction?.deleteMany({
        where: {
          imageId: input.id
        },
      })

      await ctx.db.comment?.deleteMany({
        where: {
          imageId: input.id
        },
      })

      await ctx.db.image.delete({
        where: {
          id: input.id,
          userId: ctx.auth.userId,
        },
      })
      return true
    }),

    /**
     * Récupère les images d'un utilisateur via son ID
     */
  getUserImages: protectedProcedure
    .input(
      z.object({
          userId: z.string().optional(),
          pagination: pagination.optional(),
        }).optional()
    )
    .query(async ({ ctx, input }) => {
      const { page , limit } = (input?.pagination) ?? {};
      let offset = 0
      if(page && limit){
         offset = (page - 1) * limit;
      }
      const userIdToUse = input?.userId ?? ctx.auth.userId
      return await ctx.db.image.findMany({
        where: {
          userId: userIdToUse,
        },
        select: {
          id: true,
          imageUuid: true,
          description: true,
          mentionUser: true,
          hashtags: true,
            fileName: true,
        },
        take: limit,
        skip: offset,
      })
    }),

    /**
     * Récupère une image selon son ID
     */
  getImageById: protectedProcedure
    .input(
      z.object({
        imageId: z.string(),
      })
    )
    .query(async ({ ctx, input }) => {
      const image = await ctx.db.image.findUnique({
        where: {
          id: parseInt(input.imageId),
        },
      })
      if (!image) {
        throw new Error("Image not found")
      }
      return image
    }),

    /**
     * Recupère toutes les images de l'application
     */
  getImages: protectedProcedure
      .input(
          z.object({
              description: z.string(),
              hashtags: z.string(),
              pagination: pagination.optional(),
          }).optional()
      )
      .query(async ({ctx, input}) => {
          let where = {}
          if(input?.description){
              where = {
                  ...where,
                  OR: [{description: {contains: input.description}}]
              }
          }

          if(input?.hashtags){
              where = {
                  ...where,
                  OR: [{hashtags: {contains: input.hashtags}}]
              }
          }

          const { page , limit } = (input?.pagination) ?? {};
          let offset = 0
          if(page && limit){
              offset = (page - 1) * limit;
          }


          return await ctx.db.image.findMany({
              where: where,
              take: limit,
              skip: offset,
          })
  }),

    /**
     * Récupère toutes les images avec un paramètre pour ordonner
     * la liste
     */
  getAllImagesOrderByDate: protectedProcedure
      .input(
          z.object({
              pagination: pagination.optional(),
              orderBy: z.enum(["asc", "desc"]).optional(),
          }).optional()
      )
      .query(async ({ ctx, input }) => {
            const orderBy = (input?.orderBy) ?? "asc";
            const { page , limit } = (input?.pagination) ?? {};
            let offset = 0
            if(page && limit){
                offset = (page - 1) * limit;
            }
            const images = await ctx.db.image.findMany({
                take: limit,
                skip: offset,
                orderBy: {createdAt: orderBy},
            })
            if (!images) {
                throw new Error("Images not found")
            }
            return images
      }),

    /**
     * Ajoute une reaction à une image
     * Deux types de réaction (reactionType) : "like" ou "dislike"
     */
    addLikeToImage: protectedProcedure
        .input(
            z.object({
                imageId: z.number(),
                reactionType: z.enum(["like", "dislike"])
            })
        )
        .mutation(async ({ctx, input}) => {
            const {userId} = ctx.auth
            const image = await ctx.db.image.findUnique({
                where: {id: input.imageId}
            })
            if(!image){
                throw new Error("Image not found")
            }

            const existingLike = await ctx.db.reaction.findFirst({
                where:{
                    imageId: input.imageId,
                    userId: userId,
                }
            })

            if(existingLike && existingLike.reactionType === input.reactionType){
                await ctx.db.reaction.delete({
                    where: {id: existingLike.id}
                })
                return true
            }else{
                if(existingLike && !(existingLike.reactionType === input.reactionType)){
                    await ctx.db.reaction.delete({
                        where: {id: existingLike.id}
                    })
                }
                await ctx.db.reaction.create({
                    data:{
                        imageId: input.imageId,
                        userId: userId,
                        reactionType: input.reactionType
                    }
                })
                return true
            }

        }),

    /**
     * Récupère toutes reactions (likes et dislikes) d'une image
     */
    getImageLikes:protectedProcedure
        .input(
            z.object({
                imageId: z.number()
            })
        )
        .query(async({ctx, input})=>{
            return ctx.db.reaction.findMany({
                where:{
                    imageId: input.imageId
                }
            })
        }),

    /**
     * Récupère toutes les réactions d'une image image de l'utilisateur courant
     */
    getImageUserLikes: protectedProcedure
        .input(
            z.object({
                imageId: z.number()
            })
        )
        .query(async({ctx, input})=>{
            const {userId} = ctx.auth
            return ctx.db.reaction.findFirst({
                where: {
                    imageId: input.imageId,
                    userId: userId
                },
            });
        }),

    /**
     * Ajoute un commentaire à une image
     */
    addCommentToImage:protectedProcedure
        .input(
            z.object({
                imageId: z.number(),
                content: z.string(),
                userImageUrl: z.string(),
                userName: z.string().nullable()
            })
        )
        .mutation(async({ctx, input}) => {
            const {userId} = ctx.auth
            const image = await ctx.db.image.findUnique({
                where: {id: input.imageId}
            })
            if(!image){
                throw new Error("Image not found")
            }
            if(input.content && input.content != " " && input.content != ""){
                await ctx.db.comment.create({
                    data:{
                        imageId:input.imageId,
                        userId:userId,
                        content: input.content,
                        userName: input.userName,
                        userImageUrl: input.userImageUrl
                    }
                })
                return true
            }
            else{
                return false
            }

        }),

    /**
     * Récupère les commentaires d'une image
     */
    getImageComments:protectedProcedure
        .input(
            z.object({
                imageId: z.number(),
            })
        )
        .query(async ({ctx, input}) => {
            return ctx.db.comment.findMany({
                where:{
                    imageId:input.imageId
                }
            })
        }),

    /**
     * Supprime tous les commentaires d'une image
     */
    deleteAllComments: protectedProcedure
        .mutation(async ({ ctx }) => {
            await ctx.db.comment.deleteMany({
                where: {
                    userId: ctx.auth.userId,
                },
            })
            return true
        }),

})
