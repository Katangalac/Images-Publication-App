import { clerkClient, User } from "@clerk/nextjs/server"
import {LoadingPage} from "@components/loading";
import Link from "next/link";
import {Info} from "lucide-react"

/**
 * Page d'affichage des résultats de recherche d'utilisateurs
 * @param params  information pour rechercher l'utilisateur => mention
 */
const SearchUser = async ({ params }: { params: { userIdentification: string } }) => {

    const myParam = params.userIdentification.toLowerCase();
    const userList: User[] = await clerkClient.users.getUserList();
    const filteredUsers: User[] = userList.filter(user =>
        (user.username ?? '').toLowerCase().includes(myParam) || 
        (user.firstName ?? '').toLowerCase().includes(myParam) ||
        (user.lastName ?? '').toLowerCase().includes(myParam)
    );
    if (!userList) {
        return <LoadingPage />
    }
    if(filteredUsers.length === 0){
        return <span className="md:text-xl sm:text-xl font-medium m-5 flex gap-1 items-center"><Info className=""/> No matching users found!</span>
    }
    return (
        <div className="container mx-auto mt-8">
            <h1 className="mb-6 text-2xl font-bold text-indigo-700">User(s) found :</h1>
            <ul>
                {filteredUsers?.map((user) => (
                    <Link key={user.id} href={`/userImages/${user.id}`}>
                        <li
                            key={user.id}
                            className="mb-6 w-full rounded-md bg-white p-4 shadow-md border shadow-indigo-500"
                        >
                            <div className="flex w-full min-w-full flex-row items-center justify-between space-x-4">
                                <div className={"flex flex-row items-center space-x-4"}>
                                    {user.imageUrl && (
                                        <img
                                            src={user.imageUrl}
                                            alt={`${user.firstName} ${user.lastName}`}
                                            className="h-12 w-12 rounded-full border-2 border-indigo-500 object-cover"
                                        />
                                    )}
                                    <div>
                                        <p className="text-lg font-semibold text-indigo-800">
                                            {user.firstName} {user.lastName}
                                        </p>
                                        <p className="ml-auto justify-end text-gray-600">
                                            {user.username}
                                        </p>
                                    </div>
                                </div>
                                {user.createdAt && (
                                    <p className="ml-auto">
                                        Joined on {new Date(user.createdAt).toLocaleDateString()}
                                    </p>
                                )}
                            </div>
                        </li>
                    </Link>
                ))}
            </ul>
        </div>
    )
}
export default SearchUser