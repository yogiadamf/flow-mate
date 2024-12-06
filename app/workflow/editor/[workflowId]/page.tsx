import { getSessionFromCookie } from "@/lib/auth";
import prisma from "@/lib/prisma";
import Editor from "@/app/workflow/_components/Editor";

const page = async ({ params }: { params: { workflowId: string } }) => {
  const { workflowId } = params;

  const user = await getSessionFromCookie();
  if (!user) return <div>unauthenticated</div>;
  const workflow = await prisma.workflow.findUnique({
    where: {
      id: workflowId,
      userId: user.id,
    },
  });
  if (!workflow) return <div>workflow not found</div>;

  return <Editor workflow={workflow} />;
};

export default page;
