import Link from "next/link"
import { clerkClient, User } from "@clerk/nextjs/server"
import { LoadingPage } from "@components/loading"

/**
 * Page d'affichages des utilisateurs enregistrés
 */
const UsersPage: React.FC = async () => {
  const users: User[] = await clerkClient.users.getUserList()
  if (!users) {
    return <LoadingPage />
  }
  return (
    <div className="container mx-auto mt-8">
      <h1 className="mb-6 text-3xl font-bold text-indigo-700">User List</h1>
      <ul>
        {users?.map((user) => (
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

export default UsersPage
