import { cn } from "@/lib/utils";
import { SquareDashedMousePointer } from "lucide-react";
import Link from "next/link";

const Logo = () => {
  return (
    <Link href="/" className={cn("flex items-center gap-2")}>
      <div className="flex aspect-square size-8  items-center justify-center rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600">
        <SquareDashedMousePointer size={20} className="stroke-white" />
      </div>
      <div className="grid flex-1 text-left text-sm leading-tight">
        <div>
          <span className="font-extrabold bg-gradient-to-r from-emerald-500 to-emerald-600 bg-clip-text text-transparent">
            Flow
          </span>
          <span className="font-extrabold text-stone-700 dark:text-stone-300">
            Mate
          </span>
        </div>
        <span className="truncate text-[10px] text-muted-foreground font-semibold">
          Workflows
        </span>
      </div>
    </Link>
  );
};

export default Logo;
