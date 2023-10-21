import AboutUs from "../../components/About";
import Features from "../../components/Features";

export default function Home() {
  return (
    <div className="bg-background max-w-3xl m-auto flex flex-col items-center justify-center min-h-screen">
      {/* TODO: Add Hero Section with GSAP or Framer Motion Animation */}
      
      <AboutUs />
      <Features />
      {/* TODO: Add Contact Us Section */}
      {/* TODO: Add Footer Section */}

      {/* TODO: Add Scroll-based Animations */}
      {/* TODO: Add Hover-based Interactions */}
      {/* TODO: Add Parallax Effects */}
      <div className="flex flex-nowrap justify-center items-center mt-10 mb-4 text-center w-full">
  <span className="inline">{new Date().getFullYear()} </span>
  <a href="https://socialfeeds.vercel.com" target="_blank" rel="noopener noreferrer" className="mx-2">
    <img className="h-4 w-20 inline" src="/testr.png" alt="SocialTree" />
  </a>
  <span className="inline">&copy; - Developed by&nbsp;</span>
  <a href="http://twitter.com/bankkroll_eth" className="underline inline">{" "}Bankkroll</a>
</div>

    </div>
  );
}
