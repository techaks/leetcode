"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, Code2 } from "lucide-react";
import { motion } from "framer-motion";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";

const navItems = [
  { name: "Problems", href: "/problems" },
  { name: "Discuss", href: "/discuss" },
  { name: "Profile", href: "/profile" },
  { name: "Admin", href: "/admin" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  const { data: session } = useSession();

  const initials = session?.user?.name
    ? session.user.name.charAt(0).toUpperCase()
    : "?";

  return (
    <nav className="w-full sticky top-0 z-50">
      
      {/* Background Glow */}
      <div className="absolute inset-0 bg-linear-to-r from-yellow-500/10 via-transparent to-yellow-500/10 blur-2xl opacity-40" />

      <div className="relative backdrop-blur-xl bg-white/5 border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <Code2 className="text-yellow-400 group-hover:scale-110 transition" />
            <span className="font-bold text-lg tracking-wide text-white group-hover:text-yellow-400 transition">
              CodeJudge
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-10">
            {navItems.map((item) => {
              const active = pathname === item.href;

              return (
                <Link key={item.name} href={item.href} className="relative group">
                  <span
                    className={`text-sm font-medium transition-all duration-300 ${
                      active
                        ? "text-yellow-400"
                        : "text-gray-300 group-hover:text-white"
                    }`}
                  >
                    {item.name}
                  </span>

                  <span className="absolute inset-0 opacity-0 group-hover:opacity-100 blur-md bg-yellow-400/30 transition-all duration-300 rounded-md" />

                  {active && (
                    <motion.div
                      layoutId="underline"
                      className="absolute left-0 -bottom-1 h-0.5 w-full bg-linear-to-r from-yellow-400 to-orange-500"
                    />
                  )}
                </Link>
              );
            })}
          </div>

          {/* 🔥 Right side */}
          <div className="hidden md:flex items-center gap-4 relative">

            {session ? (
              <div className="relative group">
                
                {/* Avatar */}
                <div className="w-9 h-9 flex items-center justify-center rounded-full bg-yellow-400 text-black font-bold cursor-pointer hover:scale-105 transition">
                  {initials}
                </div>

                {/* Dropdown (hover based) */}
                <div className="absolute right-0 top-12 w-48 bg-black/90 border border-white/10 rounded-xl shadow-lg backdrop-blur-lg overflow-hidden opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200">

                  <div className="px-4 py-3 border-b border-white/10">
                    <p className="text-sm text-white font-semibold">
                      {session.user?.name}
                    </p>
                    <p className="text-xs text-gray-400">
                      {session.user?.email}
                    </p>
                  </div>

                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-sm hover:bg-white/10 transition"
                  >
                    Profile
                  </Link>

                  <button
                    onClick={() => signOut()}
                    className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/10 transition"
                  >
                    Logout
                  </button>

                </div>
              </div>
            ) : (
              <Link
                href="/login"
                className="px-5 py-2 rounded-xl bg-linear-to-r from-yellow-400 to-orange-500 text-black font-semibold shadow-lg hover:scale-105 transition"
              >
                Login
              </Link>
            )}
          </div>

          {/* Mobile Button */}
          <button
            className="md:hidden text-white"
            onClick={() => setOpen(!open)}
          >
            {open ? <X /> : <Menu />}
          </button>
        </div>

        {/* Mobile Menu */}
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden px-6 pb-6 flex flex-col gap-5 bg-black/80 backdrop-blur-xl"
          >
            {navItems.map((item) => (
              <Link
                key={item.name}
                href={item.href}
                onClick={() => setOpen(false)}
                className="text-gray-300 hover:text-yellow-400 transition"
              >
                {item.name}
              </Link>
            ))}

            {session ? (
              <>
                <div className="text-sm text-gray-300">
                  {session.user?.name}
                </div>

                <button
                  onClick={() => signOut()}
                  className="px-5 py-2 rounded-xl bg-red-500 text-white"
                >
                  Logout
                </button>
              </>
            ) : (
              <Link
                href="/login"
                onClick={() => setOpen(false)}
                className="px-5 py-2 rounded-xl bg-linear-to-r from-yellow-400 to-orange-500 text-black"
              >
                Login
              </Link>
            )}
          </motion.div>
        )}
      </div>
    </nav>
  );
}