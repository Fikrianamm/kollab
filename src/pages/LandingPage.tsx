import React, { useEffect } from "react";
import useAuth from "@/stores/useAuth";
import { useTheme } from "@/components/theme-provider";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { Link, useNavigate } from "react-router";

const LandingPage: React.FC = () => {
  const { getUser, dataUser } = useAuth();
  const { theme } = useTheme();
  const logoSrc = theme === "light" ? "/LogoDark.svg" : "/LogoLight.svg";
  const navigate = useNavigate();

  useEffect(() => {
    getUser();
  }, [getUser]);

  return (
    <div className="relative flex flex-col min-h-screen h-full max-w-screen bg-background text-foreground px-4 md:px-8 py-4 overflow-x-hidden pb-40">
      <img
        src="/blob.svg"
        alt="blob"
        className="absolute top-0 z-0 blur-3xl opacity-25 h-screen"
      />
      <img
        src="/blob.svg"
        alt="blob"
        className="absolute right-0 z-0 blur-3xl opacity-25 h-3/5"
      />
      {/* header */}
      <div className="flex justify-between items-center w-full z-50">
        <img alt="Kollab Logo" className="w-16 md:w-20" src={logoSrc} />
        {dataUser ? (
          <Link
            to={"/dashboard"}
            className="flex items-center gap-2 text-xs md:text-sm cursor-pointer"
          >
            Dashboard
            <MoveRight size={12} />
          </Link>
        ) : (
          <Link
            to={"/auth/login"}
            className="flex items-center gap-2 text-xs md:text-sm cursor-pointer"
          >
            Login
            <MoveRight size={12} />
          </Link>
        )}
      </div>

      {/* headline */}
      <div className="flex flex-col gap-2 w-3/4 md:w-1/2 mx-auto mt-32 md:mt-36 z-50">
        <h1 className="font-bold text-3xl md:text-5xl text-foreground text-center">
          Visualize Your Workflow. Simplify Your Process.
        </h1>
        <p className="text-muted-foreground text-center text-sm md:text-base mt-2 md:mt-4">
          Where clarity meets productivity. With our powerful Kanban Board, you
          can easily manage tasks, assign priorities, and keep your team
          aligned. Streamline workflows, monitor progress in real-time, and
          bring your projects to life all in one place.
        </p>
        <Button
          variant={"blue"}
          className="w-max mx-auto mt-2 md:mt-4"
          onClick={() => navigate("/auth/login")}
        >
          Get Started
        </Button>
      </div>

      {/* Preview Feature */}
      <div className="z-50 w-full md:w-10/12 mx-auto flex flex-col items-center">
        <img
          src="preview.png"
          className="w-full mt-12 rounded-md md:rounded-lg"
          alt="preview app"
        />
      </div>
    </div>
  );
};

export default LandingPage;
