import React from 'react';
import DatabaseNavigation from '@/components/DatabaseNavigation';
import Footer from '@/components/Footer';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Privacy = () => {
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
            <h1 className="text-3xl font-bold text-foreground mb-8">Privacy Policy</h1>
            
            <div className="bg-muted/50 p-6 rounded-lg space-y-6">
              <p className="text-sm text-muted-foreground">
                <strong>Last updated:</strong> 21 October 2025
              </p>
              
              <p>
                This Privacy Policy explains how Outtour Azerbaijan ("we", "us", "our") collects, uses, discloses, and protects your personal information when you use our website Outtour.az (the "Site") or book our tours and services.
              </p>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">1. Information We Collect</h2>
                
                <h3 className="text-lg font-semibold text-foreground mb-2">Personal information you provide:</h3>
                <p>When you make a booking request or inquiry, we may collect your name, email address, phone number, date of birth, and any health, fitness, or dietary requirements relevant to your tour.</p>
                
                <h3 className="text-lg font-semibold text-foreground mb-2 mt-4">Payment information (no online checkout on the Site):</h3>
                <p>We do not accept payments directly on Outtour.az and we do not collect or store card numbers on the Site. After you submit a booking request, we provide offline/third-party payment instructions (e.g., bank transfer or a secure payment link issued outside the Site). We may record payment confirmations such as transaction reference, payer name, amount, and date for bookkeeping and fraud prevention.</p>
                
                <h3 className="text-lg font-semibold text-foreground mb-2 mt-4">Usage data:</h3>
                <p>Information about how you use our Site (e.g., IP address, browser type, pages visited, time spent).</p>
                
                <h3 className="text-lg font-semibold text-foreground mb-2 mt-4">Cookies and analytics:</h3>
                <p>We use cookies and tools such as Google Analytics (or similar) to understand traffic and improve your experience.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">2. How We Use Your Information</h2>
                <p>We use your information for:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Processing and confirming bookings and payments per the instructions we provide, and communicating about your tour.</li>
                  <li>Providing and improving our services, tailoring offers, and collecting customer feedback.</li>
                  <li>Marketing and promotional communications (you may opt out at any time).</li>
                  <li>Compliance with legal obligations and fraud prevention.</li>
                  <li>Analytics and internal reporting to improve our operations.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">3. Disclosure of Your Information</h2>
                <p>We may disclose your information to:</p>
                <ul className="list-disc list-inside space-y-2">
                  <li>Trusted third-party service providers who help with booking administration, payment processing outside the Site, or communications.</li>
                  <li>Tour guides, accommodation hosts, and transportation partners, but only as required to operate your trip.</li>
                  <li>Law enforcement or regulatory authorities, if required by law.</li>
                  <li>In connection with a business sale, merger, or reorganisation (you will be notified if your data is transferred).</li>
                </ul>
                <p className="mt-3"><strong>We do not sell your personal information to third parties for their own marketing.</strong></p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">4. Data Retention</h2>
                <p>We retain personal data only as long as necessary for the purposes stated (e.g., booking fulfilment, legal compliance, dispute resolution). If you want your data removed or anonymised, contact us (see Section 11).</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">5. Your Rights</h2>
                <p>Depending on your jurisdiction, you may have the right to access, correct, delete, or restrict the use of your personal data, and to object to certain processing. To exercise these rights, contact us at <a href="mailto:info@outtour.az" className="text-primary hover:text-primary/80">info@outtour.az</a> We will respond within the timeframe required by applicable law.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">6. Security</h2>
                <p>We use reasonable technical and organisational measures to protect your data. However, no internet transmission or storage system is 100% secure, and we cannot guarantee absolute security.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">7. International Transfers</h2>
                <p>Your data may be processed or stored outside your country. Where required by law, we implement adequate safeguards to protect your information.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">8. Children's Data</h2>
                <p>Our services are not directed to children under 16 (or the age required by local law). If you believe we collected data about a child under this age, contact us and we will delete it.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">9. Cookies & Similar Technologies</h2>
                <p>We use cookies to operate the Site and to monitor how users interact. You can disable cookies in your browser, but some parts of the Site may not function properly.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">10. Changes to this Policy</h2>
                <p>We may update this Privacy Policy from time to time. The "Last updated" date shows the latest version. Your continued use of the Site after changes means you accept the updated Policy.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">11. Contact</h2>
                <div className="space-y-1">
                  <p><strong>Email:</strong> <a href="mailto:info@outtour.az" className="text-primary hover:text-primary/80">info@outtour.az</a></p>
                  <p><strong>Company:</strong> Outtour Azerbaijan LLC</p>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default Privacy;
