import ImageGetter from "@components/ImageGetter";
import { clerkClient } from '@clerk/nextjs/server';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

/**
 * Page des images d'un utilisateur
 * @param params identifiant de l'utilsiateur dont on veut récupérer les images
 */
const UserImagesPage =  async ({ params }: { params: { userId:string } }) => {

    const user =  await clerkClient.users.getUser(params.userId)
    let email = user.emailAddresses.pop()?.emailAddress
    let telephone = user.phoneNumbers.pop()?.phoneNumber

    if(!email){
        email = "-"
    }

    if(!telephone){
        telephone = "-"
    }
    return (
        <div>
            <div className="flex flex-col space-x-10 justify-center align-middle">
                <br />
                <h1 className="md:text-3xl sm:text-2xl font-bold text-indigo-700">Profile</h1>
                <br />
                <div className="flex flex-col px-5">
                    <div>
                        <Avatar>
                            <AvatarImage src={user.imageUrl}/>
                            <AvatarFallback>CN</AvatarFallback>
                        </Avatar>
                    </div>
                    <div className="flex gap-2">
                        <span className="font-semibold text-gray-700">
                            Name :
                        </span>
                        <span>
                            {user.firstName} {user.lastName}
                        </span>
                    </div>

                    <div className="flex gap-2">
                         <span className="font-medium text-gray-700">
                            Username :
                        </span>
                        <span className={user.username && user.username.trim() !== "" && user.username !== "-" ? "text-gray-800":"text-gray-800 italic"}>
                            {
                                user.username && user.username.trim() !== "" && user.username !== "-" ? `${user.username}`:'"None"'
                            }
                        </span>
                    </div>
                    <div className="flex gap-2">
                         <span className="font-semibold text-gray-700">
                            Email :
                        </span>
                        <span className={email.trim() !== "" && email !== "-" ? "text-gray-800":"text-gray-800 italic"}>
                            {
                                email.trim() !== "" && email !== "-" ? `${email}`:'"None"'
                            }
                        </span>
                    </div>

                    <div className="flex gap-2">
                        <span className="font-semibold text-gray-700">
                            Phone number :
                        </span>
                        <span className={telephone.trim() !== "" && telephone !== "-" ? "text-gray-800":"text-gray-800 italic"}>
                            {
                                telephone.trim() !== "" && telephone !== "-" ? `${telephone}`:'"None"'
                            }
                        </span>
                    </div>
                    <br/>
                    <hr></hr>
                    <br />
                </div>
                <h1 className="md:text-3xl sm:text-2xl font-bold text-indigo-700">Images</h1>
                <br />
                <div>
                    <ImageGetter userId={user.id}/>
                </div>
            </div>
        </div>
    )
}

export default UserImagesPage;