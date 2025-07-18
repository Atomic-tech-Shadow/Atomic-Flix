import { Link, useLocation } from "wouter";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search, Home, Film, BookOpen, Menu, X, Info } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { SimpleNotificationButton } from "@/components/notifications/simple-notification-button";
// Logo is now served from public/assets

export function Navbar() {
  const [location, navigate] = useLocation();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navigation = [
    { name: "Accueil", href: "/", icon: Home },
    { name: "Animes", href: "/anime-sama", icon: Film },
    { name: "Mangas", href: "/manga", icon: BookOpen },
    { name: "À propos", href: "/about", icon: Info },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      const searchUrl = `/anime-sama?search=${encodeURIComponent(searchQuery.trim())}`;
      navigate(searchUrl);
      setIsSearchOpen(false);
      setSearchQuery("");
    }
  };

  return (
    <nav className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-4">
            <img 
              src="/assets/atomic-logo-round.png" 
              alt="ATOMIC FLIX Logo" 
              className="h-10 w-10 atomic-logo-round with-border flex-shrink-0"
            />
            <span className="text-xl font-bold whitespace-nowrap">
              <span className="atomic-gradient-text">ATOMIC FLIX</span> <span className="text-2xl">🇹🇬</span>
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {navigation.map((item) => {
              const Icon = item.icon;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors hover:bg-accent hover:text-accent-foreground",
                    location === item.href
                      ? "bg-accent text-accent-foreground"
                      : "text-muted-foreground"
                  )}
                >
                  <Icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-2">
            <SimpleNotificationButton />
          </div>

          {/* Mobile Icons */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Search Button */}
            <Button
              variant="ghost"
              size="icon"
              className="atomic-hover-scale hover:text-cyan-400 transition-all duration-300 relative"
              onClick={() => setIsSearchOpen(!isSearchOpen)}
            >
              <Search className="h-5 w-5" />
              <div className="absolute -inset-1 bg-gradient-to-r from-cyan-500/20 to-blue-500/20 rounded-lg opacity-0 hover:opacity-100 transition-opacity duration-300 -z-10" />
            </Button>

            {/* Notification Button */}
            <SimpleNotificationButton />

            {/* Menu Button */}
            <Button
              variant="ghost"
              size="icon"
              className="atomic-hover-scale hover:text-cyan-400 transition-all duration-300"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              {isMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </Button>
          </div>
        </div>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t bg-background/95 backdrop-blur">
            <div className="space-y-1 pb-3 pt-2 px-2">
              {navigation.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.name}
                    href={item.href}
                    className={cn(
                      "flex items-center space-x-3 px-4 py-3 rounded-lg text-base font-medium transition-all duration-200 hover:bg-gray-800/50 hover:text-cyan-400",
                      location === item.href
                        ? "bg-cyan-500/20 text-cyan-400 border border-cyan-500/30"
                        : "text-gray-300"
                    )}
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <Icon className="h-5 w-5" />
                    <span>{item.name}</span>
                  </Link>
                );
              })}


            </div>

          </div>
        )}

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden border-t bg-background/95 backdrop-blur atomic-fade-in">
            <div className="container mx-auto px-4 py-3">
              <form onSubmit={handleSearch}>
                <div className="flex space-x-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input
                      type="search"
                      placeholder="Rechercher un anime..."
                      className="pl-10 atomic-input"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                  </div>
                  <Button 
                    type="submit" 
                    size="sm" 
                    className="atomic-gradient-bg hover:scale-105 transition-transform duration-200"
                  >
                    <Search className="h-4 w-4" />
                  </Button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </nav>
  );
}