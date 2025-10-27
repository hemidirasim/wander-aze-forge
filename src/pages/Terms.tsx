import React from 'react';
import DatabaseNavigation from '@/components/DatabaseNavigation';
import Footer from '@/components/Footer';
import { ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

const Terms = () => {
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
            <h1 className="text-3xl font-bold text-foreground mb-8">Terms & Conditions</h1>
            
            <div className="bg-muted/50 p-6 rounded-lg space-y-6">
              <p className="text-sm text-muted-foreground">
                <strong>Last updated:</strong> 21 October 2025
              </p>
              
              <p>
                These Terms & Conditions ("Terms", "Agreement") govern your use of the website Outtour.az (the "Site") and any tours, services, or bookings you make with Outtour Azerbaijan LLC (referred to as "we", "us", "our", or "Outtour"). By accessing or using the Site or booking a tour, you agree to be bound by these Terms.
              </p>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">1. Services</h2>
                <p>
                  We operate guided private hiking, trekking, cultural, and wildlife trips throughout Azerbaijan. Details for each tour (including duration, route, difficulty, inclusions/exclusions, and equipment) are provided on the individual tour pages.
                </p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">2. Booking & Payment</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>You must be at least 18 years old (or have consent from a parent/guardian) to make a booking.</li>
                  <li>A deposit or full prepayment may be required to confirm your booking once your request is accepted.</li>
                  <li>Payment methods and instructions will be provided after booking confirmation. You agree to pay all related charges, including any applicable taxes or transaction fees.</li>
                  <li>If you cancel your booking, the Cancellation Policy (see Section 3) will apply. Late cancellations or no-shows may result in forfeiture of your deposit or full payment.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">3. Changes and Cancellations</h2>
                
                <h3 className="text-lg font-semibold text-foreground mb-2">3.1 Cancellation by the Client</h3>
                <div className="space-y-3">
                  <p><strong>(a) Notice.</strong> If you wish to cancel a confirmed booking, notice must be provided to Outtour in writing (e.g., by email). The effective date of cancellation is the date on which we receive your written notice.</p>
                  
                  <p><strong>(b) Standard Bookings</strong> (made more than ten (10) days before the tour start date):</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li>30+ days before the tour: 100% refund of the total tour price.</li>
                    <li>11-30 days before the tour: 50% refund of the total tour price.</li>
                    <li>10 days or fewer before the tour: no refund.</li>
                  </ul>
                  
                  <p><strong>(c) Short-Notice Bookings</strong> (non-refundable). For bookings made fewer than ten (10) days before the tour start date, all payments are non-refundable upon booking confirmation, regardless of when the cancellation occurs.</p>
                  
                  <p><strong>(d) Refund Method and Fees.</strong> Any applicable refund will be processed via the original payment method, less any transaction, banking, or processing fees charged by the payment provider or financial institution.</p>
                </div>

                <h3 className="text-lg font-semibold text-foreground mb-2 mt-4">3.2 Cancellation or Modification by the Company</h3>
                <div className="space-y-3">
                  <p>Outtour reserves the right to cancel, postpone, or modify any tour, in whole or in part, for reasons beyond its reasonable control — including but not limited to adverse weather, safety concerns, insufficient participant numbers, transportation issues, or other operational circumstances.</p>
                  
                  <p>In such cases, Outtour will notify the client as soon as reasonably practicable and offer:</p>
                  <ul className="list-disc list-inside ml-4 space-y-1">
                    <li><strong>(a)</strong> a full refund of all amounts paid; or</li>
                    <li><strong>(b)</strong> participation in an alternative tour or rescheduled date, subject to availability.</li>
                  </ul>
                  
                  <p>Outtour shall not be liable for any indirect, consequential, or incidental losses, or additional costs incurred by the client (including travel, accommodation, or third-party arrangements) as a result of such cancellation or modification.</p>
                </div>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">4. Participant Responsibilities & Risk</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>You agree to provide accurate personal information (including health, fitness, and experience level) when booking.</li>
                  <li>You must follow your guide's instructions and comply with local laws and regulations at all times.</li>
                  <li>Outdoor activities involve inherent risks (terrain, weather, wildlife, and remoteness). By booking a tour, you acknowledge and accept these risks.</li>
                  <li>You agree to release and hold harmless Outtour Azerbaijan LLC, its employees, and agents from liability for injury, loss, or damage, except where prohibited by applicable law.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">5. Equipment & Conduct</h2>
                <ul className="list-disc list-inside space-y-2">
                  <li>Where equipment (e.g., camping gear) is provided, you are responsible for its reasonable care and for bringing your own personal essentials.</li>
                  <li>Participants are expected to respect local communities, nature, and fellow travelers.</li>
                  <li>Outtour reserves the right to terminate participation without refund if a client's behavior endangers others, causes disturbance, or violates tour rules or local laws.</li>
                </ul>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">6. Intellectual Property</h2>
                <p>All materials on this Site (including text, images, logos, and design elements) are the property of Outtour Azerbaijan LLC or are used with permission. You may not reproduce, modify, or distribute any content without prior written consent.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">7. Governing Law & Disputes</h2>
                <p>These Terms and Conditions shall be governed by and construed in accordance with the laws of the Republic of Azerbaijan. Any dispute, claim, or controversy arising from or relating to these Terms, any booking, or participation in a tour shall be subject to the exclusive jurisdiction of the courts of the Republic of Azerbaijan, unless otherwise mutually agreed in writing by the parties.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">8. Changes to Terms</h2>
                <p>Outtour may update or modify these Terms at any time. The latest version will be published on the Site with the "Last updated" date shown above. Your continued use of the Site or participation in our tours after such updates constitutes your acceptance of the revised Terms.</p>
              </section>

              <section>
                <h2 className="text-xl font-semibold text-foreground mb-3">9. Contact</h2>
                <p>For any questions, concerns, or requests regarding these Terms, please contact:</p>
                <div className="mt-3 space-y-1">
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

export default Terms;
