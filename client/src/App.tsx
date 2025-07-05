import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/not-found";
import AnimeSamaPage from "@/pages/anime-sama";
import AnimePage from "@/pages/anime";
import AnimePlayerPage from "@/pages/anime-player";
import MangaReaderPage from "@/pages/manga-reader";
import AboutPage from "@/pages/about";

function Router() {
  return (
    <Switch>
      <Route path="/" component={AnimeSamaPage} />
      <Route path="/anime-sama" component={AnimeSamaPage} />
      <Route path="/anime/:id" component={AnimePage} />
      <Route path="/anime/:id/player" component={AnimePlayerPage} />
      <Route path="/manga/:id/reader" component={MangaReaderPage} />
      <Route path="/about" component={AboutPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
