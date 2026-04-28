"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Menu, X } from "lucide-react";
import { useState } from "react";

interface HeaderProps {
  onLogin: () => void;
  onSignup: () => void;
}

export function Header({ onLogin, onSignup }: HeaderProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigation = [
    { href: "#features", label: "Features" },
    { href: "#preview", label: "Product" },
    { href: "#pricing", label: "Pricing" },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-border/80 bg-background/90 backdrop-blur-xl">
      <div className="mx-auto flex h-18 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-10">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-secondary shadow-sm">
              <span className="text-sm font-semibold text-foreground">G</span>
            </div>
            <span className="text-lg font-semibold tracking-tight text-foreground">
              Growcus
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-8">
            {navigation.map((item) => (
              <Link
                key={item.label}
                href={item.href}
                className="text-sm text-muted-foreground transition-colors hover:text-foreground"
              >
                {item.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Button variant="ghost" onClick={onLogin} className="text-sm">
            Sign in
          </Button>
          <Button
            onClick={onSignup}
            className="rounded-xl bg-accent px-5 text-sm text-accent-foreground shadow-sm hover:bg-accent/95"
          >
            Start free
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className="rounded-lg p-2 text-muted-foreground transition-colors hover:text-foreground md:hidden"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          aria-label="Toggle menu"
        >
          {mobileMenuOpen ? (
            <X className="h-5 w-5" />
          ) : (
            <Menu className="h-5 w-5" />
          )}
        </button>
      </div>

      {mobileMenuOpen && (
        <div className="border-t border-border md:hidden">
          <div className="mx-auto flex max-w-7xl flex-col gap-4 px-4 py-5 sm:px-6">
            <nav className="flex flex-col gap-4">
              {navigation.map((item) => (
                <Link
                  key={item.label}
                  href={item.href}
                  className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {item.label}
                </Link>
              ))}
            </nav>
            <div className="flex flex-col gap-2 border-t border-border pt-4">
              <Button variant="ghost" onClick={onLogin} className="justify-start">
                Sign in
              </Button>
              <Button
                onClick={onSignup}
                className="rounded-xl bg-accent text-accent-foreground hover:bg-accent/95"
              >
                Start free
              </Button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
