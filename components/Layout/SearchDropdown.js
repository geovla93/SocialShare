import { Menu, Transition } from "@headlessui/react";
import Link from "next/link";

import ProfilePic from "../Shared/ProfilePic";

const SearchDropdown = ({ users }) => {
	return (
		<Menu as="div" className="text-left">
			<Transition
				show={users?.length > 0 ? true : false}
				enter="transition duration-100 ease-out"
				enterFrom="transform scale-95 opacity-0"
				enterTo="transform scale-100 opacity-100"
				leave="transition duration-75 ease-out"
				leaveFrom="transform scale-100 opacity-100"
				leaveTo="transform scale-95 opacity-0"
			>
				<Menu.Items
					static
					className="absolute flex flex-col p-2 left-0 w-full mt-2 origin-top-right bg-white divide-y divide-gray-100 rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none"
				>
					{users?.length > 0 && (
						<Menu.Item as="div" className="w-full">
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
						</Menu.Item>
					)}
				</Menu.Items>
			</Transition>
		</Menu>
	);
};

export default SearchDropdown;
