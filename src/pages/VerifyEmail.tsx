import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Mail, CheckCircle, ArrowLeft, RefreshCw } from 'lucide-react';
import DatabaseNavigation from '@/components/DatabaseNavigation';
import Footer from '@/components/Footer';

const VerifyEmail = () => {
  const [formData, setFormData] = useState({
    email: '',
    code: ''
  });
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  // Get email from location state or URL params
  const emailFromState = location.state?.email || '';
  const emailFromParams = new URLSearchParams(location.search).get('email') || '';
  const initialEmail = emailFromState || emailFromParams;

  React.useEffect(() => {
    if (initialEmail) {
      setFormData(prev => ({ ...prev, email: initialEmail }));
    }
  }, [initialEmail]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/auth/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Email Verified Successfully",
          description: "Your account is now active. You can login now.",
        });

        // Redirect to login
        navigate('/login', { state: { email: formData.email } });
      } else {
        toast({
          title: "Verification Failed",
          description: data.error || "Invalid verification code",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      toast({
        title: "Verification Failed",
        description: "An error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    if (!formData.email) {
      toast({
        title: "Email Required",
        description: "Please enter your email address first",
        variant: "destructive"
      });
      return;
    }

    setResendLoading(true);

    try {
      const response = await fetch('/api/auth/send-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email: formData.email })
      });

      const data = await response.json();

      if (data.success) {
        toast({
          title: "Verification Code Sent",
          description: "A new verification code has been sent to your email",
        });
      } else {
        toast({
          title: "Failed to Send Code",
          description: data.error || "Failed to send verification code",
          variant: "destructive"
        });
      }
    } catch (error) {
      console.error('Resend error:', error);
      toast({
        title: "Failed to Send Code",
        description: "An error occurred. Please try again.",
        variant: "destructive"
      });
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900">
      <DatabaseNavigation />
      <div className="flex items-center justify-center p-4 pt-32">
        <div className="w-full max-w-md">
          <Card className="border-0 shadow-2xl bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm">
            <CardHeader className="text-center pb-8">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                <Mail className="w-8 h-8 text-primary" />
              </div>
              <CardTitle className="text-2xl font-bold text-foreground">
                Verify Your Email
              </CardTitle>
              <p className="text-muted-foreground">
                We've sent a verification code to your email address
              </p>
            </CardHeader>
            
            <CardContent>
              <form onSubmit={handleVerify} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-sm font-medium">
                    Email Address
                  </Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="Enter your email"
                    required
                    className="h-12"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="code" className="text-sm font-medium">
                    Verification Code
                  </Label>
                  <Input
                    id="code"
                    name="code"
                    type="text"
                    value={formData.code}
                    onChange={handleInputChange}
                    placeholder="Enter 6-digit code"
                    maxLength={6}
                    required
                    className="h-12 text-center text-lg tracking-widest"
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full h-12 text-base"
                  disabled={loading}
                >
                  {loading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Verify Email
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 space-y-4">
                <Button
                  type="button"
                  variant="outline"
                  className="w-full"
                  onClick={handleResendCode}
                  disabled={resendLoading}
                >
                  {resendLoading ? (
                    <div className="w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin mr-2" />
                  ) : (
                    <RefreshCw className="w-4 h-4 mr-2" />
                  )}
                  Resend Code
                </Button>

                <div className="text-center">
                  <p className="text-sm text-muted-foreground">
                    Didn't receive the code?{' '}
                    <button
                      type="button"
                      onClick={handleResendCode}
                      className="text-primary hover:text-primary/80 font-medium transition-colors"
                      disabled={resendLoading}
                    >
                      Resend
                    </button>
                  </p>
                </div>

                <div className="text-center">
                  <Link 
                    to="/login" 
                    className="text-sm text-muted-foreground hover:text-foreground transition-colors flex items-center justify-center"
                  >
                    <ArrowLeft className="w-4 h-4 mr-2" />
                    Back to Login
                  </Link>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default VerifyEmail;
