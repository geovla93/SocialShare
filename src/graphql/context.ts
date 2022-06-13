import { NextApiRequest, NextApiResponse } from "next";
import { Session } from "next-auth";
import { getSession } from "next-auth/react";

export type Context = {
  req: NextApiRequest;
  res: NextApiResponse;
  session?: Session;
};

export const createdContext = async ({
  req,
  res,
}: {
  req: NextApiRequest;
  res: NextApiResponse;
}) => {
  const session = await getSession({ req });
  return { req, res, session };
};
