import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Menu, X, Info, Home } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SimpleNotificationButton } from "@/components/notifications/simple-notification-button";

export function Navbar() {
  const [location, navigate] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigation = [
    { name: "Accueil", href: "/", icon: Home },
    { name: "À propos", href: "/about", icon: Info },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/anime-sama?search=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchOpen(false);
      setSearchQuery("");
      setIsMenuOpen(false);
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b border-white/6 bg-[var(--atomic-dark)]/95 backdrop-blur-xl">
      <div className="container mx-auto px-4">
        <div className="flex h-14 items-center justify-between gap-4">

          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 flex-shrink-0 group">
            <div className="relative">
              <img
                src="/assets/atomic-logo-round.png"
                alt="ATOMIC FLIX Logo"
                className="h-8 w-8 atomic-logo-round transition-all duration-300 group-hover:shadow-[0_0_16px_rgba(0,240,255,0.5)]"
                style={{ border: '1.5px solid rgba(0,240,255,0.25)' }}
              />
            </div>
            <span className="font-black text-base tracking-tight">
              <span className="atomic-gradient-text">ATOMIC</span>
              <span className="text-white/80 ml-1">FLIX</span>
              <span className="ml-1 text-sm">🇹🇬</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-1">
            {navigation.map((item) => {
              const Icon = item.icon;
              const isActive = location === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200",
                    isActive
                      ? "bg-white/10 text-white"
                      : "text-white/50 hover:text-white hover:bg-white/6"
                  )}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Search + Notif */}
          <div className="hidden md:flex items-center gap-2 flex-1 justify-end max-w-xs">
            <form onSubmit={handleSearch} className="relative flex-1">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30 pointer-events-none" />
              <Input
                type="search"
                placeholder="Rechercher un anime..."
                className="pl-9 h-9 bg-white/5 border-white/8 text-white placeholder:text-white/30 text-sm focus-visible:ring-1 focus-visible:ring-cyan-500/40 focus-visible:border-cyan-500/50 transition-all duration-200"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                data-testid="input-search-desktop"
              />
            </form>
            <SimpleNotificationButton />
          </div>

          {/* Mobile Icons */}
          <div className="md:hidden flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white/50 hover:text-cyan-400 hover:bg-white/6 transition-all duration-200"
              onClick={() => { setIsSearchOpen(!isSearchOpen); setIsMenuOpen(false); }}
              data-testid="button-search-mobile"
            >
              <Search className="h-4 w-4" />
            </Button>
            <SimpleNotificationButton />
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 text-white/50 hover:text-white hover:bg-white/6 transition-all duration-200"
              onClick={() => { setIsMenuOpen(!isMenuOpen); setIsSearchOpen(false); }}
              data-testid="button-menu-mobile"
            >
              {isMenuOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden pb-3">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-white/30 pointer-events-none" />
              <Input
                type="search"
                placeholder="Rechercher un anime..."
                className="pl-9 h-9 w-full bg-white/5 border-white/8 text-white placeholder:text-white/30 text-sm focus-visible:ring-1 focus-visible:ring-cyan-500/40 focus-visible:border-cyan-500/50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
                data-testid="input-search-mobile"
              />
            </form>
          </div>
        )}

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden pb-3 border-t border-white/6">
            <div className="flex flex-col gap-0.5 pt-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                const isActive = location === item.href;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className={cn(
                      "flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200",
                      isActive
                        ? "bg-white/10 text-white"
                        : "text-white/60 hover:text-white hover:bg-white/6"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.name}
                  </Link>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
