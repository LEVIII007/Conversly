'use client';
import { useState, useEffect } from "react";
import { useSession, signOut, signIn } from "next-auth/react";
import { User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu";
import Link from "next/link";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import Hero from "./hero";

const NavbarHero = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { data: session } = useSession();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <section id="navbar_hero" className="min-h-screen bg-gradient-to-b from-neutral-900 via-neutral-900 to-neutral-800 relative overflow-hidden">
      <div className="absolute inset-0 opacity-20">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(99,102,241,0.15),transparent_50%)]"></div>
      </div>

      <nav className="fixed top-0 w-full z-50 bg-neutral-900/90 backdrop-blur-xl border-b border-neutral-800/50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-20">
            {/* Logo */}
            <div className="flex-shrink-0 hover:opacity-90 transition-opacity">
                <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-500 to-purple-500 dark:from-indigo-300 dark:to-purple-400">Conversly</h1>
                {/* <img
                className="h-10 transition-opacity duration-300 opacity-100"
                src="https://cdn.prod.website-files.com/66e2be2343a7c5501a5a7fe2/66ededfacf0375e0f8ae4c17_Kortex%20Logo.webp"
                alt="Kortex Logo"
                loading="lazy"
                /> */}
            </div>

            {/* Desktop Nav */}
            <div className="hidden lg:flex lg:space-x-10">
              <a href="#FaQs" className="text-neutral-300 hover:text-white hover:scale-105 transition-all duration-300 font-medium">FaQs</a>
              <a href="#features" className="text-neutral-300 hover:text-white hover:scale-105 transition-all duration-300 font-medium">Features</a>
              <a href="#pricing" className="text-neutral-300 hover:text-white hover:scale-105 transition-all duration-300 font-medium">Pricing</a>
            </div>

            {/* CTA Buttons */}
            <div className="hidden lg:flex lg:items-center lg:space-x-6">
              {session ? (
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={session.user?.image || ''} alt={session.user?.name || ''} />
                        <AvatarFallback>{session.user?.name?.[0] || 'U'}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <DropdownMenuItem asChild>
                      <Link href="/profile" className="flex items-center">
                        <User className="mr-2 h-4 w-4" />
                        <span>Profile</span>
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => signOut()}>
                      <LogOut className="mr-2 h-4 w-4" />
                      <span>Sign Out</span>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              ) : (
                <Button onClick={() => signIn('google')} className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-500 hover:scale-105 transition-all duration-300 font-semibold shadow-lg shadow-indigo-500/25">
                  Signin
                </Button>
              )}
              <a href="#" className="bg-indigo-600 text-white px-6 py-2.5 rounded-lg hover:bg-indigo-500 hover:scale-105 transition-all duration-300 font-semibold shadow-lg shadow-indigo-500/25">Get Kortex Free</a>
            </div>

            {/* Mobile menu button */}
            <div className="flex lg:hidden">
              <button
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="text-neutral-400 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500 rounded-lg p-2"
                aria-label="Toggle menu"
              >
                {!isOpen ? (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                  </svg>
                ) : (
                  <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                  </svg>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        {isOpen && (
          <div className="lg:hidden px-4 pt-3 pb-6 space-y-3 bg-neutral-900/95 backdrop-blur-xl border-b border-neutral-800/50">
            <a href="#FaQs" className="block px-4 py-3 text-neutral-300 hover:text-white hover:bg-neutral-800/50 rounded-lg transition-all duration-300">FaQs</a>
            <a href="#features" className="block px-4 py-3 text-neutral-300 hover:text-white hover:bg-neutral-800/50 rounded-lg transition-all duration-300">Features</a>
            <a href="#pricing" className="block px-4 py-3 text-neutral-300 hover:text-white hover:bg-neutral-800/50 rounded-lg transition-all duration-300">Pricing</a>
            <a href="#" className="block px-4 py-3 text-neutral-300 hover:text-white hover:bg-neutral-800/50 rounded-lg transition-all duration-300">Signin</a>
            <a href="#" className="block px-4 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition-all duration-300 text-center font-semibold shadow-lg shadow-indigo-500/25">
              Get Kortex Free
            </a>
          </div>
        )}
      </nav>
      <div>
      <Hero />
    </div>
    </section>
  );
};

export default NavbarHero;
