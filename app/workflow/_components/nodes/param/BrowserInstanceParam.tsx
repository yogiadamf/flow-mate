"use client";

import { ParamProps } from "@/types/appNode";

const BrowserInstanceParam = ({ param }: ParamProps) => {
  return <p className="text-xs">{param.name}</p>;
};

export default BrowserInstanceParam;
