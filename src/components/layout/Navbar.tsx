"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import Button from "@/components/ui/Button";
import { useAuth } from "@/hooks/useAuth";

export default function Navbar() {
  const { isAuthenticated } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <motion.nav
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="fixed top-0 left-0 right-0 z-50 bg-white/85 backdrop-blur-xl border-b border-slate-200/80 shadow-xs"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 sm:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 transition-transform hover:scale-[1.02]">
            <Image
              src="/rag.png"
              alt="RagAI Logo"
              width={160}
              height={62}
              priority
              className="h-11 sm:h-13 w-auto object-contain"
            />
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-7">
            <Link
              href="/features"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Features
            </Link>
            <Link
              href="/how-it-works"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              How it Works
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/free-images"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Free Images
            </Link>
            <Link
              href="/image-editor"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Image Studio
            </Link>
            <Link
              href="/document-converter"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
            >
              Converter
            </Link>
            <Link
              href="/blog"
              className="text-sm font-semibold text-violet-600 hover:text-violet-700 transition-colors flex items-center gap-1.5"
            >
              <span>Blog</span>
              <span className="px-1.5 py-0.2 text-[10px] font-bold rounded-full bg-violet-100 text-violet-700">
                New
              </span>
            </Link>

            {isAuthenticated ? (
              <Link href="/dashboard">
                <Button size="sm" className="bg-slate-900 hover:bg-slate-800 text-white shadow-xs">
                  Dashboard
                </Button>
              </Link>
            ) : (
              <div className="flex items-center gap-3">
                <Link href="/login">
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-slate-700 hover:text-slate-900 hover:bg-slate-100 font-medium"
                  >
                    Sign In
                  </Button>
                </Link>
                <Link href="/register">
                  <Button
                    size="sm"
                    className="bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white shadow-md shadow-violet-600/20 font-medium"
                  >
                    Get Started
                  </Button>
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden text-slate-600 hover:text-slate-900 p-2 rounded-lg hover:bg-slate-100 transition-colors"
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation Dropdown */}
        {mobileOpen && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="md:hidden py-4 border-t border-slate-200 bg-white/95 backdrop-blur-xl space-y-2 px-2 rounded-b-2xl shadow-xl"
          >
            <Link
              href="/features"
              className="block text-sm font-medium text-slate-700 hover:text-violet-600 hover:bg-slate-50 px-3 py-2 rounded-lg"
              onClick={() => setMobileOpen(false)}
            >
              Features
            </Link>
            <Link
              href="/how-it-works"
              className="block text-sm font-medium text-slate-700 hover:text-violet-600 hover:bg-slate-50 px-3 py-2 rounded-lg"
              onClick={() => setMobileOpen(false)}
            >
              How it Works
            </Link>
            <Link
              href="/pricing"
              className="block text-sm font-medium text-slate-700 hover:text-violet-600 hover:bg-slate-50 px-3 py-2 rounded-lg"
              onClick={() => setMobileOpen(false)}
            >
              Pricing
            </Link>
            <Link
              href="/free-images"
              className="block text-sm font-medium text-slate-700 hover:text-violet-600 hover:bg-slate-50 px-3 py-2 rounded-lg"
              onClick={() => setMobileOpen(false)}
            >
              Free Images
            </Link>
            <Link
              href="/image-editor"
              className="block text-sm font-medium text-slate-700 hover:text-violet-600 hover:bg-slate-50 px-3 py-2 rounded-lg"
              onClick={() => setMobileOpen(false)}
            >
              Image Studio
            </Link>
            <Link
              href="/document-converter"
              className="block text-sm font-medium text-slate-700 hover:text-violet-600 hover:bg-slate-50 px-3 py-2 rounded-lg"
              onClick={() => setMobileOpen(false)}
            >
              Doc Converter
            </Link>
            <Link
              href="/blog"
              className="block text-sm font-semibold text-violet-600 hover:bg-violet-50 px-3 py-2 rounded-lg"
              onClick={() => setMobileOpen(false)}
            >
              Blog
            </Link>

            {isAuthenticated ? (
              <Link href="/dashboard" onClick={() => setMobileOpen(false)}>
                <Button className="w-full mt-2" size="sm">
                  Go to Dashboard
                </Button>
              </Link>
            ) : (
              <div className="space-y-2 pt-2 border-t border-slate-100">
                <Link href="/login" onClick={() => setMobileOpen(false)}>
                  <Button variant="outline" className="w-full" size="sm">
                    Sign In
                  </Button>
                </Link>
                <Link href="/register" onClick={() => setMobileOpen(false)}>
                  <Button
                    className="w-full bg-gradient-to-r from-violet-600 to-indigo-600 hover:from-violet-700 hover:to-indigo-700 text-white"
                    size="sm"
                  >
                    Get Started Free
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