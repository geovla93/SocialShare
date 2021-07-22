import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect } from "react";
import { useSession } from "next-auth/client";

import ProfileDropdown from "./ProfileDropdown";
import ProfilePic from "../Shared/ProfilePic";

const Header = () => {
	const [session] = useSession();
	const router = useRouter();

	useEffect(() => {
		router.prefetch(`/profile/${session.user.username}`);
	}, [router, session.user.username]);

	const handleRedirect = () => router.push(`/profile/${session.user.username}`);

	return (
		<header className="w-full py-2 px-8 bg-white  border-b shadow-md">
			<nav className="h-12 flex items-center justify-between">
				<Link href="/">
					<a className="text-blue-500 hover:text-blue-400 p-3 text-xl transition-colors duration-300 ease-in-out">
						SocialShare
					</a>
				</Link>
				<div className="flex items-center space-x-4">
					{session ? (
						<>
							<div
								className="flex items-center space-x-2 cursor-pointer text-blue-500 p-2 hover:text-gray-50 hover:bg-blue-500 rounded-full transition-colors duration-300 ease-in-out"
								onClick={handleRedirect}
							>
								<ProfilePic
									styles="w-8 h-8"
									imageSrc={session.user.profilePicUrl}
									imageAlt={session.user.name}
								/>
								<h2>{session.user.name}</h2>
							</div>
							<ProfileDropdown />
						</>
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
