import React from 'react';
import DatabaseNavigation from '@/components/DatabaseNavigation';
import Footer from '@/components/Footer';
import { ArrowLeft, Phone, Mail, MessageCircle } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Support = () => {
  return (
    <div className="min-h-screen bg-background">
      <DatabaseNavigation />
      <div className="p-6 pt-32">
        <div className="container mx-auto max-w-4xl">
          <div className="mb-6">
            <Button 
              variant="outline" 
              onClick={() => window.history.back()}
              className="mb-4"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
          </div>

          <div className="prose prose-lg max-w-none">
            <h1 className="text-3xl font-bold text-foreground mb-8">Support</h1>
            
            <div className="bg-muted/50 p-6 rounded-lg space-y-6">
              <p className="text-sm text-muted-foreground">
                <strong>Last updated:</strong> 21 October 2025
              </p>
              
              <p>
                This policy explains how to contact Outtour Azerbaijan, what support we provide, and what response times you can expect. It aligns with our Terms & Conditions and Privacy Policy.
              </p>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">1. How to Contact Us</h2>
                <p>You can reach us via:</p>
                <div className="mt-3 space-y-2">
                  <p><strong>Email:</strong> <a href="mailto:info@outtour.az" className="text-primary hover:text-primary/80">info@outtour.az</a></p>
                  <p><strong>WhatsApp / Telegram:</strong> <a href="tel:+994514009091" className="text-primary hover:text-primary/80">+994 51 400 90 91</a></p>
                  <p><strong>Availability:</strong> Monday-Sunday, 11:00–16:00 (Baku time, AZT).</p>
                </div>
                <p className="mt-3">
                  Outside these hours, we'll reply the next working day. During tours, connectivity can be limited; WhatsApp is usually the fastest way to reach us.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">2. Response Time</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li><strong>General inquiries:</strong> within 24–48 hours on working days.</li>
                  <li><strong>Urgent day-of-tour issues</strong> (today/tomorrow): we aim to respond as soon as possible during availability hours via phone or WhatsApp.</li>
                  <li>Messages received outside availability hours are handled the next working day.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">3. What We Support</h2>
                <p>We're happy to help with:</p>
                <ul className="list-disc list-inside space-y-2 mt-3">
                  <li><strong>Booking questions, changes, or cancellations</strong> (as per our Cancellation Policy in the Terms).</li>
                  <li><strong>Tour information & logistics:</strong> what to bring, fitness level, weather, meeting points, and timings.</li>
                  <li><strong>Payments & refunds:</strong> we do not process payments on the Site. After you submit a booking request, we provide offline or third-party payment instructions (e.g., bank transfer or a secure payment link issued outside the Site).</li>
                  <li><strong>Website issues:</strong> broken links, form errors, or content problems.</li>
                </ul>
                
                <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-md">
                  <p className="text-yellow-800 font-medium">Security note:</p>
                  <p className="text-yellow-700 text-sm mt-1">
                    Please do not send full card numbers or sensitive payment data via email or chat. We never ask for full card details in messages. See our Privacy Policy for how we handle your data.
                  </p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">4. Emergencies</h2>
                <p>If there is a safety, medical, or law-enforcement emergency, please contact local emergency services first, then notify us as soon as possible so we can assist with tour logistics.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">5. Feedback & Complaints</h2>
                <p>We value your feedback.</p>
                <ul className="list-disc list-inside space-y-2 mt-3">
                  <li>Send comments or concerns to <a href="mailto:info@outtour.az" className="text-primary hover:text-primary/80">info@outtour.az</a> with the subject: "Complaint – Outtour Azerbaijan".</li>
                  <li>We'll acknowledge within 2 business days and aim to provide a resolution within 14 calendar days.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">6. Changes to this Policy</h2>
                <p>We may update this Support Policy periodically. The "Last updated" date reflects the most recent version. Continued use of our Site or services means you accept any updates.</p>
              </section>
            </div>

            {/* Quick Contact Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
              <div className="bg-muted/50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <Phone className="w-6 h-6 text-primary mr-3" />
                  <h3 className="text-xl font-semibold">Phone Support</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Call us for immediate assistance with your booking or tour questions.
                </p>
                <a 
                  href="tel:+994514009091" 
                  className="text-primary hover:text-primary/80 font-semibold"
                >
                  +994 51 400 90 91
                </a>
                <p className="text-sm text-muted-foreground mt-2">
                  Available: Mon-Sun, 11:00-16:00 (Baku time)
                </p>
              </div>

              <div className="bg-muted/50 p-6 rounded-lg">
                <div className="flex items-center mb-4">
                  <Mail className="w-6 h-6 text-primary mr-3" />
                  <h3 className="text-xl font-semibold">Email Support</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Send us an email and we'll get back to you within 24-48 hours.
                </p>
                <a 
                  href="mailto:info@outtour.az" 
                  className="text-primary hover:text-primary/80 font-semibold"
                >
                  info@outtour.az
                </a>
                <p className="text-sm text-muted-foreground mt-2">
                  For general inquiries and booking questions
                </p>
              </div>
            </div>

            <div className="bg-muted/50 p-6 rounded-lg mt-6">
              <div className="flex items-center mb-4">
                <MessageCircle className="w-6 h-6 text-primary mr-3" />
                <h3 className="text-xl font-semibold">Contact Form</h3>
              </div>
              <p className="text-muted-foreground mb-4">
                Use our contact form for detailed inquiries or special requests.
              </p>
              <Link 
                to="/contact" 
                className="inline-flex items-center text-primary hover:text-primary/80 font-semibold"
              >
                Go to Contact Form
                <ArrowLeft className="w-4 h-4 ml-2 rotate-180" />
              </Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Support;
