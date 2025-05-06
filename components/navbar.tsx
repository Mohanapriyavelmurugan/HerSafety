"use client"

import Link from "next/link"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Menu, X, LogOut } from "lucide-react"
import { useAuth } from "@/contexts/auth-context"

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const { user, logout } = useAuth()

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between">
        <Link href="/" className="flex items-center space-x-2">
          <span className="text-xl font-bold text-rose-600">HerSafety</span>
        </Link>

        <nav className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-sm font-medium transition-colors hover:text-rose-600">
            Home
          </Link>

          {user ? (
            <>
              <Link href="/dashboard" className="text-sm font-medium transition-colors hover:text-rose-600">
                Dashboard
              </Link>
              <Link href="/report-incident" className="text-sm font-medium transition-colors hover:text-rose-600">
                Report Incident
              </Link>
              <Link href="/track-case" className="text-sm font-medium transition-colors hover:text-rose-600">
                Track Case
              </Link>
              <Button variant="outline" onClick={logout} className="flex items-center gap-2">
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium transition-colors hover:text-rose-600">
                Login
              </Link>
              <Link href="/register">
                <Button variant="default" className="bg-rose-600 hover:bg-rose-700">
                  Register
                </Button>
              </Link>
            </>
          )}
        </nav>

        <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
          {isMenuOpen ? <X /> : <Menu />}
          <span className="sr-only">Toggle menu</span>
        </Button>
      </div>

      {isMenuOpen && (
        <div className="container md:hidden py-4 pb-6">
          <nav className="flex flex-col space-y-4">
            <Link
              href="/"
              className="text-sm font-medium transition-colors hover:text-rose-600"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>

            {user ? (
              <>
                <Link
                  href="/dashboard"
                  className="text-sm font-medium transition-colors hover:text-rose-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  href="/report-incident"
                  className="text-sm font-medium transition-colors hover:text-rose-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Report Incident
                </Link>
                <Link
                  href="/track-case"
                  className="text-sm font-medium transition-colors hover:text-rose-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Track Case
                </Link>
                <Button
                  variant="outline"
                  onClick={() => {
                    logout()
                    setIsMenuOpen(false)
                  }}
                  className="flex items-center gap-2"
                >
                  <LogOut className="h-4 w-4" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="text-sm font-medium transition-colors hover:text-rose-600"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Login
                </Link>
                <Link href="/register" onClick={() => setIsMenuOpen(false)}>
                  <Button variant="default" className="w-full bg-rose-600 hover:bg-rose-700">
                    Register
                  </Button>
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </header>
  )
}
