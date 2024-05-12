"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "../Button";
import { type NavbarProps } from "./interface";
import { useEffect, useState } from "react";
// import { useSession } from "next-auth/react";
import Image from "next/image";
import { RiArrowDropDownFill, RiArrowDropRightFill } from "react-icons/ri";

export const CustomNavbar: React.FC<NavbarProps> = () => {
  const [isShowDropdown, setIsShowDropdown] = useState<boolean>(false);
  // const { data: sessionData } = useSession();
  const router = usePathname();

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

  return (
    <nav
      id="navbar"
      className={`absolute z-50 mx-[5vw] my-6 flex w-[95vw] rounded-[15px] bg-white/90 px-[2vw] py-3 shadow-md transition-all duration-[1s] md:w-[90vw] md:px-[4vw] [&>*]:z-50`}
    >
      <div className="relative flex w-full">
        <Link
          href="/"
          className="mx-[1vw] hidden w-fit text-primary drop-shadow-lg md:inline-block"
        >
          <h3>GradPrep</h3>
        </Link>
        <div className="flex w-full justify-center gap-x-[4vw] font-bold">
          <Link href={"/tests"} className="my-auto text-primary drop-shadow-lg">
            Mock Test
          </Link>
          <Link
            href={"/programs"}
            className="my-auto text-primary drop-shadow-lg"
          >
            Programs and Scholarship
          </Link>
          <Link
            href={"/mentors"}
            className="my-auto text-primary drop-shadow-lg"
          >
            Find a Mentor
          </Link>
          <Link
            href={"/podcasts"}
            className="my-auto text-primary drop-shadow-lg"
          >
            Daily Scholarship Podcast
          </Link>
        </div>
        <div className="relative my-auto inline-flex h-fit"></div>
      </div>
    </nav>
  );
};
