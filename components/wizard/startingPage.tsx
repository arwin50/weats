"use client";

import Image from "next/image";
import Link from "next/link";
import logo from "@/assets/images/logo.svg";
import { UserMenu } from "@/components/userMenu";

export default function StartingPage() {
  return (
    <div className="animate-gradient h-screen flex flex-col justify-center items-center bg-[#fdf1dc] text-cente px-4 overflow-hidden">
      <UserMenu />
      <p className="text-[2.1rem] sm:text-[4rem] text-green-700 text-lg ">
        Hungry?
      </p>

      <h1 className="text-[3.5rem] sm:text-[10rem] text-[#cc4d4d] -mt-8 sm:-mt-24">
        Where do
      </h1>
      <h1 className="text-[3.5rem] sm:text-[10rem] text-orange-500 font-extrabold -mt-8 sm:-mt-24">
        YOU
      </h1>
      <h1 className="text-[3rem] sm:text-[8rem] text-[#cc4d4d] -mt-10 sm:-mt-32">
        wanna eat?
      </h1>

      <Link
        href="/startingWizard"
        className="font-playfair sm:-mt-10 px-8 py-4 bg-[#d3d8a3] text-m sm:text-l text-green-900 rounded-lg shadow-md hover:shadow-lg hover:bg-[#c3d891] transition"
      >
        Let Choosee choose it!
      </Link>

      <div className="absolute top-3 right-3 sm:top-4 sm:right-4 md:top-4 md:right-8">
        <Image
          src={logo}
          alt="Logo"
          width={80}
          height={80}
          className="object-contain sm:w-[100px] sm:h-[100px] md:w-[130px] md:h-[130px]"
        />
      </div>
    </div>
  );
}
