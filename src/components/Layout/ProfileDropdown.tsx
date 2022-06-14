import { FC } from "react";
import { useRouter } from "next/router";
import { useSession, signOut } from "next-auth/react";
import { Menu, Transition } from "@headlessui/react";
import { ChevronDownIcon, LogoutIcon } from "@heroicons/react/outline";

import ProfilePic from "../Shared/ProfilePic";

const ProfileDropdown: FC = () => {
  const { data: session } = useSession();
  const router = useRouter();

  const handleRedirect = () =>
    router.push(`/profile/${session?.user.username}`);

  return (
    <Menu as="div" className="relative inline-block text-left">
      {({ open }) => (
        <>
          <Menu.Button className="p-2 bg-blue-500 hover:bg-blue-400 text-gray-50 rounded-full cursor-pointer transition-colors duration-300 ease-in-out">
            <ChevronDownIcon className="h-6 w-6" aria-hidden="true" />
          </Menu.Button>
          {open && (
            <Transition
              show={open}
              enter="transition duration-100 ease-out"
              enterFrom="transform scale-95 opacity-0"
              enterTo="transform scale-100 opacity-100"
              leave="transition duration-75 ease-out"
              leaveFrom="transform scale-100 opacity-100"
              leaveTo="transform scale-95 opacity-0"
            >
              <Menu.Items
                static
                className="absolute flex flex-col p-2 right-0 w-56 mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
              >
                <Menu.Item
                  as="div"
                  className="flex items-center space-x-3 p-1 hover:bg-blue-500 rounded cursor-pointer group transition-colors duration-300 ease-in-out"
                  onClick={handleRedirect}
                >
                  {session && (
                    <ProfilePic
                      style="w-10 h-10"
                      src={session.user.image}
                      alt={session.user.name}
                    />
                  )}
                  <span className="flex flex-col">
                    <h3 className="text-lg text-gray-800 group-hover:text-gray-200 transition-colors duration-300 ease-in-out font-semibold">
                      {session?.user.name}
                    </h3>
                    <p className="text-gray-400 group-hover:text-gray-50 transition-colors duration-300 ease-in-out">
                      Visit Your Profile
                    </p>
                  </span>
                </Menu.Item>
                <Menu.Item
                  as="div"
                  className="flex items-center space-x-3 p-1 hover:bg-blue-500 rounded cursor-pointer group transition-colors duration-300 ease-in-out"
                >
                  <span className="p-2 bg-gray-300 rounded-full">
                    <LogoutIcon className="w-6 h-6 text-blue-400" />
                  </span>
                  <span
                    className="text-gray-800 group-hover:text-gray-50 text-lg transition-colors duration-300 ease-in-out"
                    onClick={() => signOut()}
                  >
                    Log Out
                  </span>
                </Menu.Item>
              </Menu.Items>
            </Transition>
          )}
        </>
      )}
    </Menu>
  );
};

export default ProfileDropdown;
