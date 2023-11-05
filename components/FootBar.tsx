// LOL FootBar yes like the ./NavBar.tsx but FootBar instead
import Link from "next/link";
import React from "react";

const FootBar: React.FC = () => {
  return (
    <div className="flex flex-nowrap justify-center items-center mt-10 mb-4 text-center w-full">
      <span className="inline">{new Date().getFullYear()} </span>
      <Link href="/" className="mx-2">
        <img className="h-4 w-20 inline" src="/testr.png" alt="SocialTree" />
      </Link>
      <span className="inline">&copy; - Developed by&nbsp;</span>
      <a href="https://twitter.com/bankkroll_eth" className="underline inline">
        {" "}
        Bankkroll
      </a>
    </div>
  );
};

export default FootBar;
