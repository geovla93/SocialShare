import { join } from "path";
import { asNexusMethod, makeSchema } from "nexus";
import { DateTimeResolver } from "graphql-scalars";

import * as NexusTypes from "./types";

const DateTime = asNexusMethod(DateTimeResolver, "date");

const schema = makeSchema({
  types: [NexusTypes, DateTime],
  outputs: {
    schema: join(process.cwd(), "src/graphql/generated/schema.graphql"),
    typegen: join(process.cwd(), "src/graphql/generated/nexus.ts"),
  },
  contextType: {
    export: "Context",
    module: join(process.cwd(), "src/graphql/context.ts"),
  },
});

export default schema;
