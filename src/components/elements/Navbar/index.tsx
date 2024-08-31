"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { type NavbarProps } from "./interface";
import { useEffect, useState } from "react";
import { UserAuth } from "@/components/context/AuthContext";

export const CustomNavbar: React.FC<NavbarProps> = () => {
  const [isShowDropdown, setIsShowDropdown] = useState<boolean>(false);
  const router = usePathname();
  const { user, googleSignIn, logOut } = UserAuth();
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
      className={`absolute z-50 mx-[5vw] my-6 flex w-[95vw] rounded-[15px] bg-white/90 px-[2vw] py-3 shadow-md transition-all duration-[1s] md:w-[90vw] md:px-[4vw] [&>*]:z-50`}
    >
      <div className="relative flex w-full items-center">
        <Link
          href="/"
          className="items-center text-primary drop-shadow-lg j ml-2"
        >
          <h4 className="font-bold">Quizyy</h4>
        </Link>
        <div className="flex w-full justify-end gap-x-[4vw] font-bold">
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
