import Image from "next/image";
import React from "react";

const layout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="relative flex min-h-screen flex-col items-center overflow-hidden bg-gray-50 pb-10">
      <div className="absolute inset-0">
        <div className="absolute right-1/2 sm:top-5 aspect-[969/887] w-[969px]">
          <Image
            src="/images/circuit.webp"
            className="absolute inset-0 h-full w-full"
            alt="image-circuit"
            width={1938}
            height={1774}
          />
          <Image
            src="/images/circuit-point.webp"
            className="absolute inset-0 h-full w-full"
            alt="image-circuit-point"
            width={1938}
            height={1774}
          />
        </div>
        <div className="absolute right-1/2 origin-right -scale-x-100 sm:top-5 aspect-[969/887] w-[969px]">
          <Image
            src="/images/circuit.webp"
            className="absolute inset-0 h-full w-full"
            alt="image-circuit"
            width={1938}
            height={1774}
          />
          <Image
            src="/images/circuit-point.webp"
            className="absolute inset-0 h-full w-full"
            alt="image-circuit-point"
            width={1938}
            height={1774}
          />
        </div>
      </div>
      <div className="relative flex w-full max-w-[25rem] flex-1 flex-col justify-center gap-y-6">
        {children}
      </div>
    </div>
  );
};

export default layout;
