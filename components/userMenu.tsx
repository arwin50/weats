"use client";
import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import { User, LogOut, LogIn, UserPlus } from "lucide-react";

interface UserMenuProps {
  isLoggedIn?: boolean;
  onLogout?: () => void;
  className?: string;
}

export function UserMenu({
  isLoggedIn = false,
  onLogout,
  className = "",
}: UserMenuProps) {
  const [open, setOpen] = useState(false);
  const menuRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

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

  return (
    <div className={`fixed top-6 left-6 z-50 ${className}`} ref={menuRef}>
      <button
        onClick={() => setOpen(!open)}
        className="h-16 w-16 rounded-full bg-[#1BCC98] hover:bg-[#129C73] text-white shadow-lg flex items-center justify-center"
      >
        <User className="h-8 w-8 text-[#FEF5E3]" />
        <span className="sr-only">User menu</span>
      </button>

      {open && (
        <div className="mt-2 w-36 bg-[#5A9785] border border-[#5A9785] text-white rounded-lg shadow-lg">
          {!isLoggedIn ? (
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
              onClick={() => {
                onLogout?.();
                setOpen(false);
              }}
              className="flex items-center cursor-pointer py-3 px-4 hover:bg-emerald-700"
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
