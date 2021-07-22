import Header from "./Header";

const Layout = ({ children }) => {
	return (
		<div className="flex flex-col min-h-screen overflow-x-hidden bg-gray-200">
			<Header />
			<main className="flex-1 my-8 w-11/12 mx-auto">{children}</main>
		</div>
	);
};

export default Layout;
