"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, LogOut, LogIn, UserPlus } from "lucide-react";
import { useAppDispatch, useAppSelector } from "@/lib/redux/hooks";
import { logoutUser } from "@/lib/redux/slices/authSlice";

export function UserMenu({ className = "" }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      setOpen(false);
      router.push("/login");
    } catch (error) {
      console.error("Logout failed:", error);
      // Still close the menu and redirect even if logout fails
      setOpen(false);
      router.push("/");
    }
  };

  return (
    <div
      className="fixed top-3 left-3 xs:top-4 xs:left-4 sm:top-6 sm:left-6 z-50 flex items-center gap-2 sm:gap-4"
      ref={menuRef}
    >
      <button
        onClick={() => setOpen(!open)}
        className={`cursor-pointer h-9 w-9 xs:h-10 xs:w-10 sm:h-12 sm:w-12 rounded-full bg-[#5feac1] hover:bg-[#32e4b0] text-gray-800 shadow-lg flex items-center justify-center ${className}`}
      >
        <User className="h-4 w-4 xs:h-5 xs:w-5 sm:h-6 sm:w-6 text-gray-800" />
        <span className="sr-only">User menu</span>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-28 xs:w-32 sm:w-36 bg-[#81eece] text-gray-800 rounded-lg shadow-lg">
          {!isAuthenticated ? (
            <>
              <div
                onClick={() => {
                  setOpen(false);
                  router.push("/login");
                }}
                className="flex items-center cursor-pointer py-2 xs:py-3 px-3 xs:px-4 hover:bg-[#5feac1] rounded-lg text-xs xs:text-sm sm:text-base text-gray-800"
              >
                <LogIn className="mr-2 h-3 w-3 xs:h-4 xs:w-4 text-gray-800" />
                Log-in
              </div>
              <div
                onClick={() => {
                  setOpen(false);
                  router.push("/register");
                }}
                className="flex items-center cursor-pointer py-2 xs:py-3 px-3 xs:px-4 hover:bg-[#5feac1] rounded-lg text-xs xs:text-sm sm:text-base text-gray-800"
              >
                <UserPlus className="mr-2 h-3 w-3 xs:h-4 xs:w-4 text-gray-800" />
                Sign-up
              </div>
            </>
          ) : (
            <div
              onClick={handleLogout}
              className="flex items-center cursor-pointer py-2 xs:py-3 px-3 xs:px-4 hover:bg-[#5feac1] rounded-lg text-xs xs:text-sm sm:text-base text-gray-800"
            >
              <LogOut className="mr-2 h-3 w-3 xs:h-4 xs:w-4 text-gray-800" />
              Log-out
            </div>
          )}
        </div>
      )}
    </div>
  );
}
