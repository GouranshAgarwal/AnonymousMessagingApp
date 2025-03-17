'use client'
import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { User } from 'next-auth'
import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { MessageCircle, Menu, X, Settings, Bell, ChevronDown, User as UserComponent } from 'lucide-react';

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Toggle this based on auth state

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const {data : session} = useSession();
  const user:User = session?.user as User; 

  const handleSignOut = async () => {
    await signOut();
    setIsMenuOpen(false);
  };
  

  useEffect(() => {
    if (session && user) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  }, [session, user]);
  
  return (
    <nav className="w-full py-4 backdrop-blur-md bg-purple-950/70 border-b border-white/10 sticky top-0 z-50">
    <div className="container mx-auto px-4">
      <div className="flex items-center justify-between">

        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center shadow-lg shadow-purple-500/20 mr-3">
            <MessageCircle className="h-5 w-5 text-white" />
          </div>
          <Link href={"/"}><span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">Whisper</span></Link>
        </div>

        <div className="hidden md:flex items-center space-x-8">
          <Link href="/" className="text-white hover:text-pink-300 transition-colors">Home</Link>
          <Link href="#" className="text-white hover:text-pink-300 transition-colors">Features</Link>
          <Link href="#" className="text-white hover:text-pink-300 transition-colors">Pricing</Link>
          <Link href="#" className="text-white hover:text-pink-300 transition-colors">About</Link>
          
          <div className="relative group">
            <button className="flex items-center text-white hover:text-pink-300 transition-colors">
              Resources <ChevronDown className="ml-1 h-4 w-4" />
            </button>
            <div className="absolute right-0 mt-2 w-48 bg-indigo-900/95 backdrop-blur-md rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-purple-800/50">
              <Link href="#" className="block px-4 py-2 text-white hover:bg-purple-800/50 transition-colors">Blog</Link>
              <Link href="#" className="block px-4 py-2 text-white hover:bg-purple-800/50 transition-colors">FAQ</Link>
              <Link href="#" className="block px-4 py-2 text-white hover:bg-purple-800/50 transition-colors">Support</Link>
            </div>
          </div>
        </div>

        
        {
          session?(<>
          <div className="hidden md:flex items-center space-x-4">
              {/* <button className="text-white hover:text-pink-300 transition-colors relative">
                <Bell className="h-5 w-5" />
                <span className="absolute -top-1 -right-1 h-4 w-4 bg-pink-500 rounded-full text-xs flex items-center justify-center">3</span>
              </button> */}
              <div className="relative group">
                <button className="flex items-center space-x-2">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center">
                    <UserComponent className="h-4 w-4 text-white" />
                  </div>
                </button>
                <div className="absolute right-0 mt-2 w-48 bg-indigo-900/95 backdrop-blur-md rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 border border-purple-800/50">
                  {/* <Link href="#" className="flex items-center px-4 py-2 text-white hover:bg-purple-800/50 transition-colors">
                    <UserComponent className="h-4 w-4 mr-2" /> Profile
                  </Link>
                  <Link href="/settings" className="flex items-center px-4 py-2 text-white hover:bg-purple-800/50 transition-colors">
                    <Settings className="h-4 w-4 mr-2" /> Settings
                  </Link> */}
                  <hr className="my-1 border-purple-800/50" />
                  <Link href={"/"}><Button className="flex w-full items-center px-4 py-2 text-pink-300 hover:bg-purple-800/50 transition-colors" onClick={handleSignOut}>Logout</Button>
                  </Link></div>
              </div>
            </div>
            </>
          ):(
            <div className="hidden md:flex items-center space-x-4">
              <Link href={"/sign-in"}>
              <Button variant="ghost" className="text-white hover:text-pink-300 hover:bg-white/5">
                Log In
              </Button>
              </Link>
              <Link href={"/sign-up"}><Button className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full px-6 shadow-lg shadow-purple-500/25 transition-all hover:shadow-xl hover:shadow-purple-500/30">
                Sign Up
              </Button></Link>
            </div>
         )
        }

         <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white p-2">
              {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-white/10">
            <div className="flex flex-col space-y-4">
              <Link href="/" className="text-white hover:text-pink-300 transition-colors py-2">Home</Link>
              <Link href="#" className="text-white hover:text-pink-300 transition-colors py-2">Features</Link>
              <Link href="#" className="text-white hover:text-pink-300 transition-colors py-2">Pricing</Link>
              <Link href="#" className="text-white hover:text-pink-300 transition-colors py-2">About</Link>
              
              <div className="py-2">
                <button className="flex items-center text-white hover:text-pink-300 transition-colors mb-2">
                  Resources <ChevronDown className="ml-1 h-4 w-4" />
                </button>
                <div className="pl-4 border-l border-purple-800/50 space-y-2">
                  <Link href="#" className="block py-1 text-white hover:text-pink-300 transition-colors">Blog</Link>
                  <Link href="#" className="block py-1 text-white hover:text-pink-300 transition-colors">FAQ</Link>
                  <Link href="#" className="block py-1 text-white hover:text-pink-300 transition-colors">Support</Link>
                </div>
              </div>
              
              <div className="pt-4 border-t border-white/10">
                {isLoggedIn ? (
                  <div className="space-y-2">
                    <Link href="#" className="flex items-center text-white hover:text-pink-300 transition-colors py-2">
                      <UserComponent className="h-4 w-4 mr-2" /> Profile
                    </Link>
                    <Link href="#" className="flex items-center text-white hover:text-pink-300 transition-colors py-2">
                      <Settings className="h-4 w-4 mr-2" /> Settings
                    </Link>
                    <Link href={"/"}><Button className='className="flex items-center px-4 py-2 text-pink-300 hover:bg-purple-800/50 transition-colors"' onClick={()=>signOut()}>Logout</Button>
                    </Link></div>
                ) : (
                  <div className="flex flex-col space-y-4">
                    <Link href={"/sign-in"}>
                    <Button variant="ghost" className="justify-center text-white hover:text-pink-300 hover:bg-white/5 w-full">
                      Log In
                    </Button></Link>
                    <Link href={"/sign-up"}>
                    <Button className="justify-center bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white rounded-full shadow-lg shadow-purple-500/25 transition-all hover:shadow-xl hover:shadow-purple-500/30 w-full">
                      Sign Up
                    </Button>
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )
        }
      </div>
    </nav>
  )
}

export default Navbar


