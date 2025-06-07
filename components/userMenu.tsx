"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, LogOut, LogIn, UserPlus, ArrowLeft } from "lucide-react";
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

  const handleBackToDashboard = () => {
    router.push("/dashboard");
  };

  const handleLogout = async () => {
    try {
      await dispatch(logoutUser()).unwrap();
      setOpen(false);
      router.push("/");
    } catch (error) {
      console.error("Logout failed:", error);
      // Still close the menu and redirect even if logout fails
      setOpen(false);
      router.push("/");
    }
  };

  return (
    <div
      className="fixed top-4 left-4 sm:top-6 sm:left-6 z-50 flex items-center gap-2 sm:gap-4"
      ref={menuRef}
    >
      <button
        onClick={() => setOpen(!open)}
        className={`cursor-pointer h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-[#1BCC98] hover:bg-[#129C73] text-white shadow-lg flex items-center justify-center ${className}`}
      >
        <User className="h-6 w-6 sm:h-8 sm:w-8 text-[#FEF5E3]" />
        <span className="sr-only">User menu</span>
      </button>

      <button
        onClick={handleBackToDashboard}
        className="flex items-center gap-1 sm:gap-2 bg-[#5A9785] hover:bg-[#477769] text-white py-2 px-3 sm:py-3 sm:px-6 rounded-lg shadow-lg transition-colors text-sm sm:text-base cursor-pointer"
      >
        <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
        <span className="hidden xs:inline sm:inline">Back to Dashboard</span>
        <span className="inline xs:hidden sm:hidden">Back</span>
      </button>

      {open && (
        <div className="absolute top-full left-0 mt-2 w-32 sm:w-36 bg-[#5A9785] border border-[#5A9785] text-white rounded-lg shadow-lg">
          {!isAuthenticated ? (
            <>
              <div
                onClick={() => {
                  setOpen(false);
                  router.push("/login");
                }}
                className="flex items-center cursor-pointer py-3 px-4 hover:bg-[#477769] rounded-lg"
              >
                <LogIn className="mr-2 h-4 w-4" />
                Log-in
              </div>
              <div
                onClick={() => {
                  setOpen(false);
                  router.push("/register");
                }}
                className="flex items-center cursor-pointer py-3 px-4 hover:bg-[#477769] rounded-lg"
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Sign-up
              </div>
            </>
          ) : (
            <div
              onClick={handleLogout}
              className="flex items-center cursor-pointer py-3 px-4 hover:bg-[#477769] rounded-lg"
            >
              <LogOut className="mr-3 h-4 w-4" />
              Log-out
            </div>
          )}
        </div>
      )}
    </div>
  );
}
