import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";

// Pages
import Index from "@/pages/Index";
import NotFound from "@/pages/NotFound";
import UrlDedupePage from "@/pages/tools/UrlDedupePage";
import WhoisPage from "@/pages/tools/WhoisPage";
import ChatbotPage from "@/pages/tools/ChatbotPage";
import TemplateGeneratorPage from "@/pages/tools/TemplateGeneratorPage";
import DateCounterPage from "@/pages/tools/DateCounterPage";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/tools/url-dedupe" element={<UrlDedupePage />} />
          <Route path="/tools/whois" element={<WhoisPage />} />
          <Route path="/tools/chatbot" element={<ChatbotPage />} />
          <Route path="/tools/template-generator" element={<TemplateGeneratorPage />} />
          <Route path="/tools/date-counter" element={<DateCounterPage />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
