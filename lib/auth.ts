import { cookies } from "next/headers";
import prisma from "./prisma";

export const getSessionFromCookie = async () => {
  const sessionToken = cookies().get("session-token")?.value;
  if (!sessionToken) {
    return null; // No session token found
  }
  const session = await prisma.session.findUnique({
    where: { sessionToken },
    include: { user: true }, // Include user details in the session
  });
  if (!session || session.expires < new Date()) {
    return null; // Session expired or not found
  }

  return session;
};
