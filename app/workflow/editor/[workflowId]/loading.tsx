import { Loader2Icon } from "lucide-react";

const Loading = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center">
      <Loader2Icon className="animate-spin stroke-primary" size={20} />
    </div>
  );
};

export default Loading;
