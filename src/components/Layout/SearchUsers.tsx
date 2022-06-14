import { useState, useEffect, useCallback, FC } from "react";
import { SearchIcon } from "@heroicons/react/outline";
import { useRouter } from "next/router";

import { getUsers } from "@/utils/fetcher";
import SearchDropdown from "./SearchDropdown";

const SearchUsers: FC = () => {
  const [text, setText] = useState("");
  const [users, setUsers] = useState([]);
  const router = useRouter();

  const fetchUsers = useCallback(async () => {
    const users = await getUsers(text);
    setUsers(users);
  }, [text]);

  useEffect(() => {
    text.length === 0 && setUsers([]);
  }, [text.length]);

  useEffect(() => {
    text.length > 0 && fetchUsers();
  }, [fetchUsers, text.length]);

  useEffect(() => {
    const handleRouteChange = () => {
      setText("");
      setUsers([]);
    };

    router.events.on("routeChangeStart", handleRouteChange);

    return () => {
      router.events.off("routeChangeStart", handleRouteChange);
    };
  }, [router.events]);

  return (
    <div className="relative">
      <div className="flex items-center space-x-2 py-1 px-3 border rounded-full">
        <SearchIcon className="w-6 h-6 text-gray-400" />
        <input
          className="p-1 outline-none placeholder-gray-400"
          type="search"
          name="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Search..."
        />
      </div>
      <SearchDropdown users={users} />
      {/* {users?.length > 0 && (
				<div className="absolute top-11 left-0 border shadow-md p-2 rounded w-full flex flex-col space-y-4 bg-white z-10 h-60 overflow-y-auto">
					{users.map((user) => (
						<Link key={user._id} href={`/profile/${user.username}`}>
							<a className="flex items-center space-x-4 cursor-pointer p-2 rounded hover:bg-blue-500 transition-colors duration-300 ease-in-out">
								<ProfilePic
									styles="w-10 h-10"
									imageSrc={user.profilePicUrl}
									imageAlt={user.name}
								/>
								<h3 className="text-xl font-medium">{user.name}</h3>
							</a>
						</Link>
					))}
				</div>
			)} */}
    </div>
  );
};

export default SearchUsers;
