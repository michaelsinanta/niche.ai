"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type NavbarProps } from "./interface";
import { useEffect, useState } from "react";
import { useAuth } from "@/components/context/AuthContext";

export const CustomNavbar: React.FC<NavbarProps> = () => {
  const [isShowDropdown, setIsShowDropdown] = useState<boolean>(false);
  const router = usePathname();
  const { user, googleSignIn, logOut } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    window.onscroll = function () {
      const currentScrollPos = window?.scrollY;
      if (200 > currentScrollPos) {
        document.getElementById("navbar")!.style.top = "0";
      } else {
        document.getElementById("navbar")!.style.top = "-120px";
      }
    };
  }, []);

  useEffect(() => {
    setIsShowDropdown(false);
  }, [router]);

  const handleSignIn = async () => {
    try {
      await googleSignIn();
    } catch (error) {
      console.log(error);
    }
  };

  const handleSignOut = async () => {
    try {
      await logOut();
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const checkAuthentication = async () => {
      await new Promise((resolve) => setTimeout(resolve, 50));
      setLoading(false);
    };
    checkAuthentication();
  }, [user]);

  return (
    <nav
      id="navbar"
      className={`absolute z-50 left-0 right-0 mx-auto my-4 flex w-[90vw] max-w-[1200px] rounded-[15px] bg-white/90 px-[4vw] py-3 shadow-md transition-all duration-[1s] md:w-[85vw] md:px-[2vw]`}
    >
      <div className="relative flex w-full items-center">
        <Link href="/" className="items-center text-primary ml-2">
          <h3 className="font-bold">niche.ai</h3>
        </Link>
        <div className="flex w-full justify-end gap-x-4 font-bold">
          {loading ? null : !user ? (
            <div
              onClick={handleSignIn}
              className="my-auto text-primary drop-shadow-lg cursor-pointer"
            >
              Login
            </div>
          ) : (
            <div className="flex items-center space-x-5 text-primary">
              <h4 className="hidden lg:block">
                Welcome, {user["displayName"]} 👋
              </h4>
              <div
                onClick={handleSignOut}
                className="my-auto text-primary cursor-pointer bg-blue-200 rounded-md p-2 px-5"
              >
                Logout
              </div>
            </div>
          )}
        </div>
        <div className="relative my-auto inline-flex h-fit"></div>
      </div>
    </nav>
  );
};
