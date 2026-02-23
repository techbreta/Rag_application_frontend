"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { useAuth } from "@/hooks/useAuth";
import Button from "@/components/ui/Button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center group">
            <div className="relative transition-transform group-hover:scale-105">
              <Image
                src="/rag.png"
                alt="RagAI Logo"
                width={140}
                height={140}
                priority
                className="h-40 mt-2 w-auto"
              />
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link
              href="/features"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Features
            </Link>
            <Link
              href="/how-it-works"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              How it Works
            </Link>
            <Link
              href="/pricing"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/free-images"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Free Images
            </Link>
            <Link
              href="/image-editor"
              className="text-sm text-slate-400 hover:text-white transition-colors"
            >
              Image Editor
            </Link>

            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button size="sm">Dashboard</Button>
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button variant="ghost" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button size="sm">Get Started</Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-slate-400 hover:text-white"
          >
            {mobileOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>

        {/* Mobile Nav */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden py-4 border-t border-slate-800 space-y-3"
          >
            <Link
              href="/features"
              className="block text-sm text-slate-400 hover:text-white py-2"
              onClick={() => setMobileOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/how-it-works"
              className="block text-sm text-slate-400 hover:text-white py-2"
              onClick={() => setMobileOpen(false)}
            >
              How it Works
            </Link>
            <Link
              href="/pricing"
              className="block text-sm text-slate-400 hover:text-white py-2"
              onClick={() => setMobileOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/free-images"
              className="block text-sm text-slate-400 hover:text-white py-2"
              onClick={() => setMobileOpen(false)}
            >
              Free Images
            </Link>
            <Link
              href="/image-editor"
              className="block text-sm text-slate-400 hover:text-white py-2"
              onClick={() => setMobileOpen(false)}
            >
              Image Editor
            </Link>
            {isAuthenticated ? (
              <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                <Button className="w-full" size="sm">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <div className="space-y-2">
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="ghost" className="w-full" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)}>
                  <Button className="w-full" size="sm">
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </motion.div>
        )}
      </div>
    </motion.nav>
  );
}
