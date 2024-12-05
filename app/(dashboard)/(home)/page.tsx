import { getSessionFromCookie } from "@/lib/auth";
import React from "react";

const HomePage = async () => {  
  const session = await getSessionFromCookie();
  console.log(session);
  return <div>HomePage</div>;
};

export default HomePage;
