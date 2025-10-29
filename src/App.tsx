import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import ScrollToTopButton from "@/components/ScrollToTopButton";
import CookieConsent from "@/components/CookieConsent";
import Index from "./pages/Index";
import Tours from "./pages/Tours";
import ToursByCategory from "./pages/ToursByCategory";
import TourDetail from "./pages/TourDetail";
import TourReview from "./pages/TourReview";
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
import AdminTourFormBasic from "./pages/AdminTourFormBasic";
import AdminTourManage from "./pages/AdminTourManage";
import AdminTourEditBasic from "./pages/AdminTourEditBasic";
import AdminTourEditEquipment from "./pages/AdminTourEditEquipment";
import AdminTourEditTransport from "./pages/AdminTourEditTransport";
import AdminTourEditMedia from "./pages/AdminTourEditMedia";
import AdminTourEditAccommodation from "./pages/AdminTourEditAccommodation";
import AdminTourEditPricing from "./pages/AdminTourEditPricing";
import AdminTourEditHighlights from "./pages/AdminTourEditHighlights";
import AdminTourEditPrograms from "./pages/AdminTourEditPrograms";
import AdminTourEdit from "./pages/AdminTourEdit";
import AdminGallery from "./pages/AdminGallery";
import AdminTourFormTest from "./pages/AdminTourFormTest";
import AdminTestRoute from "./pages/AdminTestRoute";
import AdminProjects from "./pages/AdminProjects";
import AdminProjectForm from "./pages/AdminProjectForm";
import AdminBlogs from "./pages/AdminBlogs";
import AdminBlogForm from "./pages/AdminBlogForm";
import AdminPartners from "./pages/AdminPartners";
import AdminPartnerForm from "./pages/AdminPartnerForm";
import AdminAbout from "./pages/AdminAbout";
import AdminContact from "./pages/AdminContact";
import AdminContactMessages from "./pages/AdminContactMessages";
import AdminTailorMadeRequests from "./pages/AdminTailorMadeRequests";
import AdminTeamMembers from "./pages/AdminTeamMembers";
import AdminReviews from "./pages/AdminReviews";
import AdminHero from "./pages/AdminHero";
import SimpleAdminLayout from "./components/SimpleAdminLayout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import VerifyEmail from "./pages/VerifyEmail";
import ForgotPassword from "./pages/ForgotPassword";
import ResetPassword from "./pages/ResetPassword";
import BookTour from "./pages/BookTour";
import NotFound from "./pages/NotFound";
import Terms from "./pages/Terms";
import Privacy from "./pages/Privacy";
import Support from "./pages/Support";

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
          <Route path="/tours/:id/review" element={<TourReview />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/projects/:id" element={<ProjectDetail />} />
          <Route path="/projects/:slug" element={<ProjectDetail />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:id" element={<BlogDetail />} />
          <Route path="/blog/:slug" element={<BlogDetail />} />
          <Route path="/about" element={<About />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/terms" element={<Terms />} />
          <Route path="/privacy" element={<Privacy />} />
          <Route path="/support" element={<Support />} />
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="/verify-email" element={<VerifyEmail />} />
                <Route path="/forgot-password" element={<ForgotPassword />} />
                <Route path="/reset-password" element={<ResetPassword />} />
                <Route path="/book-tour/:id" element={<BookTour />} />
                <Route path="/dashboard" element={<UserDashboard />} />
          <Route path="/upload-demo" element={<UploadDemo />} />
          <Route path="/accordion-demo" element={<AccordionDemo />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<SimpleAdminLayout />}>
            <Route path="tours" element={<AdminTours />} />
            <Route path="tours/edit/:id" element={<AdminTourEdit />} />
            <Route path="tours/:id/manage" element={<AdminTourManage />} />
            <Route path="tours/:id/basic" element={<AdminTourEditBasic />} />
            <Route path="tours/:id/equipment" element={<AdminTourEditEquipment />} />
            <Route path="tours/:id/transport" element={<AdminTourEditTransport />} />
            <Route path="tours/:id/media" element={<AdminTourEditMedia />} />
            <Route path="tours/:id/accommodation" element={<AdminTourEditAccommodation />} />
            <Route path="tours/:id/pricing" element={<AdminTourEditPricing />} />
            <Route path="tours/:id/highlights" element={<AdminTourEditHighlights />} />
            <Route path="tours/:id/programs" element={<AdminTourEditPrograms />} />
            <Route path="tour-categories" element={<AdminTourCategories />} />
            <Route path="tour-form-basic" element={<AdminTourFormBasic />} />
            <Route path="tour-form-extended" element={<AdminTourFormExtended />} />
            <Route path="tour-form-test" element={<AdminTourFormTest />} />
            <Route path="test-route" element={<AdminTestRoute />} />
            <Route path="gallery" element={<AdminGallery />} />
            <Route path="test" element={<AdminTest />} />
            <Route path="projects" element={<AdminProjects />} />
            <Route path="project-form" element={<AdminProjectForm />} />
            <Route path="project-form/:id" element={<AdminProjectForm />} />
            <Route path="blogs" element={<AdminBlogs />} />
            <Route path="blog-form" element={<AdminBlogForm />} />
            <Route path="blog-form/:id" element={<AdminBlogForm />} />
            <Route path="partners" element={<AdminPartners />} />
            <Route path="partners/new" element={<AdminPartnerForm />} />
            <Route path="partner-form" element={<AdminPartnerForm />} />
            <Route path="partner-form/:id" element={<AdminPartnerForm />} />
            <Route path="about" element={<AdminAbout />} />
            <Route path="contact" element={<AdminContact />} />
            <Route path="contact-messages" element={<AdminContactMessages />} />
            <Route path="tailor-made-requests" element={<AdminTailorMadeRequests />} />
            <Route path="team-members" element={<AdminTeamMembers />} />
            <Route path="reviews" element={<AdminReviews />} />
        <Route path="hero" element={<AdminHero />} />
      </Route>
          {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
          <Route path="*" element={<NotFound />} />
        </Routes>
        <ScrollToTop />
        <ScrollToTopButton />
        <CookieConsent />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
