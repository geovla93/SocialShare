import { useState } from "react";
import NextNProgress from "nextjs-progressbar";
import { Provider } from "next-auth/client";
import { QueryClient, QueryClientProvider } from "react-query";
import { Hydrate } from "react-query/hydration";

import Layout from "@/components/Layout/Layout";

import "../styles/globals.css";

function MyApp({ Component, pageProps }) {
	const [queryClient] = useState(() => new QueryClient());

	return (
		<Provider session={pageProps.session}>
			<QueryClientProvider client={queryClient}>
				<Hydrate state={pageProps.dehydratedState}>
					<NextNProgress
						height={3}
						startPosition={0.2}
						showOnShallow={true}
						options={{ easing: "ease", speed: 500, showSpinner: false }}
					/>
					<Layout {...pageProps}>
						<Component {...pageProps} />
					</Layout>
				</Hydrate>
			</QueryClientProvider>
		</Provider>
	);
}

export default MyApp;
