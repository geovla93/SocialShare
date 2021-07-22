import NextNProgress from "nextjs-progressbar";
import { Provider } from "next-auth/client";

import Layout from "@/components/Layout/Layout";

import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
	return (
		<Provider session={pageProps.session}>
			<NextNProgress
				height={3}
				startPosition={0.2}
				showOnShallow={true}
				options={{ easing: "ease", speed: 500, showSpinner: false }}
			/>
			<Layout {...pageProps}>
				<Component {...pageProps} />
			</Layout>
		</Provider>
	);
}

export default MyApp;
