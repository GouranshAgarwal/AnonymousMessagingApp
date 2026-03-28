'use client'

import { useSession, signOut } from 'next-auth/react'
import Link from 'next/link'
import { MessageCircle, Menu, X, User as UserIcon } from 'lucide-react'
import React, { useState } from 'react'
import { Button } from '@/components/ui/button'

const navLinks = [
  { name: 'Home', href: '/' },
]

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { data: session } = useSession()

  const toggleMenu = () => setIsMenuOpen((prev) => !prev)

  const handleSignOut = async () => {
    await signOut()
    setIsMenuOpen(false)
  }

  return (
    <nav className="w-full py-4 backdrop-blur-md bg-purple-950/70 border-b border-white/10 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between">

          {/* Logo */}
          <div className="flex items-center">
            <div className="h-10 w-10 rounded-full bg-gradient-to-br from-pink-500 to-purple-500 flex items-center justify-center mr-3">
              <MessageCircle className="h-5 w-5 text-white" />
            </div>
            <Link href="/">
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-pink-400 to-purple-400">
                Whisper
              </span>
            </Link>
          </div>

          {/* Desktop Links */}
          <div className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-white hover:text-pink-300 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Desktop Auth */}
          <div className="hidden md:flex items-center space-x-4">
            {session ? (
              <div className="relative group">
                <button className="flex items-center">
                  <div className="h-8 w-8 rounded-full bg-gradient-to-br from-purple-500 to-pink-400 flex items-center justify-center">
                    <UserIcon className="h-4 w-4 text-white" />
                  </div>
                </button>

                <div className="absolute right-0 mt-2 w-40 bg-indigo-900/95 rounded-lg shadow-lg py-2 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all">
                  <Button
                    onClick={handleSignOut}
                    className="w-full text-pink-300 hover:bg-purple-800/50"
                    variant="ghost"
                  >
                    Logout
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <Link href="/sign-in">
                  <Button variant="ghost" className="text-white hover:text-pink-300">
                    Log In
                  </Button>
                </Link>
                <Link href="/sign-up">
                  <Button className="bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full px-6">
                    Sign Up
                  </Button>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Toggle */}
          <div className="md:hidden">
            <button onClick={toggleMenu} className="text-white p-2">
              {isMenuOpen ? <X /> : <Menu />}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden mt-4 py-4 border-t border-white/10">
            <div className="flex flex-col space-y-4">

              {navLinks.map((link) => (
                <Link
                  key={link.name}
                  href={link.href}
                  className="text-white hover:text-pink-300 py-2"
                >
                  {link.name}
                </Link>
              ))}

              <div className="pt-4 border-t border-white/10">
                {session ? (
                  <Button
                    onClick={handleSignOut}
                    className="w-full text-pink-300"
                    variant="ghost"
                  >
                    Logout
                  </Button>
                ) : (
                  <div className="flex flex-col space-y-4">
                    <Link href="/sign-in">
                      <Button className="w-full" variant="ghost">
                        Log In
                      </Button>
                    </Link>
                    <Link href="/sign-up">
                      <Button className="w-full bg-gradient-to-r from-purple-500 to-pink-500">
                        Sign Up
                      </Button>
                    </Link>
                  </div>
                )}
              </div>

            </div>
          </div>
        )}
      </div>
    </nav>
  )
}

export default Navbar