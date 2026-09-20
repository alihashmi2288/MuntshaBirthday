import { lazy, Suspense } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Birthday from "@/pages/Birthday";

// Lazy-load routes for instant initial page loading & reduced memory
const Game = lazy(() => import("@/pages/Game"));
const Letter = lazy(() => import("@/pages/Letter"));
const Fireworks = lazy(() => import("@/pages/Fireworks"));
const Gallery = lazy(() => import("@/pages/Gallery"));
const NotFound = lazy(() => import("@/pages/not-found"));

function PageLoader() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-rose-100/70 to-pink-100/70 dark:from-zinc-950 dark:to-purple-950">
      <div className="w-12 h-12 rounded-full border-4 border-rose-400 border-t-transparent animate-spin mb-3" />
      <span className="font-handwriting text-xl text-rose-600 dark:text-rose-300 font-bold animate-pulse">
        Loading with love... 💕
      </span>
    </div>
  );
}

function Router() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Switch>
        <Route path="/" component={Birthday} />
        <Route path="/game" component={Game} />
        <Route path="/letter" component={Letter} />
        <Route path="/fireworks" component={Fireworks} />
        <Route path="/gallery" component={Gallery} />
        <Route component={NotFound} />
      </Switch>
    </Suspense>
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
