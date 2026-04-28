import Link from "next/link";

export function Footer() {
  return (
    <footer className="border-t border-border bg-background">
      <div className="mx-auto max-w-7xl px-4 py-14 sm:px-6 lg:px-8">
        <div className="flex flex-col gap-10 md:flex-row md:items-start md:justify-between">
          <div className="max-w-sm">
            <Link href="/" className="flex items-center gap-2">
              <div className="flex h-10 w-10 items-center justify-center rounded-xl border border-border bg-secondary shadow-sm">
                <span className="text-sm font-semibold text-foreground">G</span>
              </div>
              <span className="text-lg font-semibold tracking-tight text-foreground">
                Growcus
              </span>
            </Link>
            <p className="mt-4 text-sm leading-6 text-muted-foreground">
              A client-finding and business growth platform for modern revenue
              teams that want sharper execution with less noise.
            </p>
          </div>

          <nav className="grid grid-cols-2 gap-8 text-sm text-muted-foreground sm:grid-cols-4">
            <Link href="#features" className="transition-colors hover:text-foreground">
              Features
            </Link>
            <Link href="#preview" className="transition-colors hover:text-foreground">
              Product
            </Link>
            <Link href="#pricing" className="transition-colors hover:text-foreground">
              Pricing
            </Link>
            <Link href="/" className="transition-colors hover:text-foreground">
              Contact
            </Link>
          </nav>
        </div>

        <div className="mt-10 flex flex-col gap-3 border-t border-border pt-6 text-sm text-muted-foreground md:flex-row md:items-center md:justify-between">
          <p>© 2026 Growcus. Built for focused growth.</p>
          <div className="flex items-center gap-6">
            <span>Privacy</span>
            <span>Terms</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
