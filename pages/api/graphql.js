import { ApolloServer, gql } from "apollo-server-micro";
import { ApolloServerPluginLandingPageGraphQLPlayground } from "apollo-server-core";
import { getSession } from "next-auth/client";

import dbConnect from "@/lib/db/dbConnect";
import { schema } from "@/apollo/schema";

const apolloServer = new ApolloServer({
	schema,
	context: async ({ req }) => {
		const session = await getSession({ req });

		await dbConnect();

		return { session };
	},
	plugins: [ApolloServerPluginLandingPageGraphQLPlayground()],
	playground: {
		settings: { "request.credentials": "include" },
	},
});

const startServer = apolloServer.start();

export default async function handler(req, res) {
	if (req.method === "OPTIONS") {
		res.end();
		return false;
	}
	res.setHeader("Access-Control-Allow-Credentials", "true");
	res.setHeader(
		"Access-Control-Allow-Origin",
		"https://studio.apollographql.com"
	);

	await startServer;
	await apolloServer.createHandler({
		path: "/api/graphql",
	})(req, res);
}

export const config = {
	api: {
		bodyParser: false,
	},
};
