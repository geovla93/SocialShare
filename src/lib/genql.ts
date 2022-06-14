import { createClient } from "@/graphql/generated/genql";

const client = createClient({ url: "/api/graphql" });
export default client;
