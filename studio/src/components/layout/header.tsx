import Link from "next/link";
import { Logo } from "@/components/icons/logo";
import { Button } from "@/components/ui/button";
import { BookOpenText } from "lucide-react";

export default function Header() {
  return (
    <header className="py-3 sm:py-4 bg-background/90 backdrop-blur-sm shadow-lg sticky top-0 z-50 border-b border-border/70">
      <div className="container mx-auto flex justify-between items-center px-4">
        <Link href="/" aria-label="Diagnosify Home">
          <Logo />
        </Link>
        <nav className="flex items-center gap-2 sm:gap-4">
          <Button variant="ghost" asChild className="text-sm sm:text-base text-muted-foreground hover:text-primary hover:bg-primary/10 px-2 sm:px-3 py-1 sm:py-1.5 rounded-md transition-colors">
            <Link href="/diseases">
              <BookOpenText className="mr-1.5 h-4 w-4 sm:h-5 sm:w-5" />
              Довідник
            </Link>
          </Button>


        </nav>
      </div>
    </header>
  );
}
