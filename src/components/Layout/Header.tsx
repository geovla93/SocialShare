import Link from "next/link";
import dynamic from "next/dynamic";
import { useSession } from "next-auth/react";

import ProfilePic from "../Shared/ProfilePic";
import SearchUsers from "./SearchUsers";

const ProfileDropdown = dynamic(() => import("./ProfileDropdown"));

const Header = () => {
  const { data: session } = useSession();

  return (
    <header className="w-full py-2 px-8 bg-white  border-b shadow-md">
      <nav className="h-12 flex items-center justify-between">
        <Link href="/">
          <a className="text-blue-500 hover:text-blue-400 p-3 text-xl transition-colors duration-300 ease-in-out">
            SocialShare
          </a>
        </Link>
        {session && <SearchUsers />}
        <div className="flex items-center space-x-4">
          {session ? (
            <Link href={`/profile/${session.user.username}`}>
              <a className="flex items-center space-x-2 cursor-pointer text-blue-500 p-2 hover:text-gray-50 hover:bg-blue-500 rounded-full transition-colors duration-300 ease-in-out">
                <ProfilePic
                  style="w-8 h-8"
                  src={session.user.image}
                  alt={session.user.name}
                />
                <h2>{session.user.name}</h2>
              </a>
              <ProfileDropdown />
            </Link>
          ) : (
            <>
              <Link href="/auth/signin">
                <a className="text-blue-500 hover:text-gray-50 hover:bg-blue-500 p-3 rounded text-xl transition-colors duration-300 ease-in-out">
                  Login
                </a>
              </Link>
              <Link href="/auth/signup">
                <a className="text-blue-500 hover:text-gray-50 hover:bg-blue-500 p-3 rounded text-xl transition-colors duration-300 ease-in-out">
                  Register
                </a>
              </Link>
            </>
          )}
        </div>
      </nav>
    </header>
  );
};

export default Header;
