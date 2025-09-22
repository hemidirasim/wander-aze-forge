import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import Index from "./pages/Index";
import Tours from "./pages/Tours";
import ToursByCategory from "./pages/ToursByCategory";
import TourDetail from "./pages/TourDetail";
import Projects from "./pages/Projects";
import ProjectDetail from "./pages/ProjectDetail";
import Blog from "./pages/Blog";
import BlogDetail from "./pages/BlogDetail";
import About from "./pages/About";
import Contact from "./pages/Contact";
import UploadDemo from "./pages/UploadDemo";
import AccordionDemo from "./pages/AccordionDemo";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import AdminTours from "./pages/AdminTours";
import AdminTest from "./pages/AdminTest";
import AdminTourCategories from "./pages/AdminTourCategories";
import AdminTourFormExtended from "./pages/AdminTourFormExtended";
import AdminTourEdit from "./pages/AdminTourEdit";
import AdminGallery from "./pages/AdminGallery";
import AdminTourFormTest from "./pages/AdminTourFormTest";
import SimpleAdminLayout from "./components/SimpleAdminLayout";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/tours" element={<Tours />} />
          <Route path="/tours/:category" element={<ToursByCategory />} />
          <Route path="/tours/:category/:id" element={<TourDetail />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/upload-demo" element={<UploadDemo />} />
          <Route path="/accordion-demo" element={<AccordionDemo />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<SimpleAdminLayout />}>
            <Route path="tours" element={<AdminTours />} />
            <Route path="tours/edit/:id" element={<AdminTourEdit />} />
            <Route path="tour-categories" element={<AdminTourCategories />} />
            <Route path="tour-form-extended" element={<AdminTourFormExtended />} />
            <Route path="tour-form-test" element={<AdminTourFormTest />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="test" element={<AdminTest />} />
          </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ScrollToTop />
        <ScrollToTopButton />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
