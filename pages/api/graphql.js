import { ApolloServer } from "apollo-server-micro";
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
});

export default apolloServer.createHandler({ path: "/api/graphql" });

export const config = {
	api: {
		bodyParser: false,
	},
};
