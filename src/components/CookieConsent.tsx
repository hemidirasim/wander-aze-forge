import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { X, Cookie, Settings } from 'lucide-react';

const CookieConsent = () => {
  const [showBanner, setShowBanner] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [preferences, setPreferences] = useState({
    necessary: true, // Always true, can't be disabled
    analytics: false,
    marketing: false,
    functional: false
  });

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      setShowBanner(true);
    }
  }, []);

  const handleAcceptAll = () => {
    const allPreferences = {
      necessary: true,
      analytics: true,
      marketing: true,
      functional: true
    };
    savePreferences(allPreferences);
  };

  const handleRejectAll = () => {
    const minimalPreferences = {
      necessary: true,
      analytics: false,
      marketing: false,
      functional: false
    };
    savePreferences(minimalPreferences);
  };

  const handleSavePreferences = () => {
    savePreferences(preferences);
  };

  const savePreferences = (prefs: typeof preferences) => {
    localStorage.setItem('cookie-consent', JSON.stringify(prefs));
    localStorage.setItem('cookie-consent-date', new Date().toISOString());
    setShowBanner(false);
    setShowSettings(false);
    
    // Initialize analytics if accepted
    if (prefs.analytics) {
      // Add Google Analytics or other analytics here
      console.log('Analytics cookies enabled');
    }
    
    // Initialize marketing if accepted
    if (prefs.marketing) {
      // Add marketing cookies here
      console.log('Marketing cookies enabled');
    }
  };

  const handlePreferenceChange = (key: keyof typeof preferences) => {
    if (key === 'necessary') return; // Can't disable necessary cookies
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  if (!showBanner) return null;

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 bg-black/50 z-40" />
      
      {/* Cookie Banner */}
      <div className="fixed bottom-0 left-0 right-0 z-50 p-4">
        <Card className="max-w-4xl mx-auto shadow-2xl">
          <CardContent className="p-6">
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0">
                <Cookie className="w-8 h-8 text-primary" />
              </div>
              
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  Cookie Preferences
                </h3>
                <p className="text-sm text-muted-foreground mb-4">
                  We use cookies to enhance your browsing experience, serve personalized content, 
                  and analyze our traffic. By clicking "Accept All", you consent to our use of cookies.
                </p>
                
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button onClick={handleAcceptAll} className="flex-1">
                    Accept All
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={handleRejectAll}
                    className="flex-1"
                  >
                    Reject All
                  </Button>
                  <Button 
                    variant="ghost" 
                    onClick={() => setShowSettings(!showSettings)}
                    className="flex-1"
                  >
                    <Settings className="w-4 h-4 mr-2" />
                    Customize
                  </Button>
                </div>
              </div>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowBanner(false)}
                className="flex-shrink-0"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
            
            {/* Cookie Settings */}
            {showSettings && (
              <div className="mt-6 pt-6 border-t">
                <h4 className="font-semibold text-foreground mb-4">Cookie Settings</h4>
                
                <div className="space-y-4">
                  {/* Necessary Cookies */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-foreground">Necessary Cookies</div>
                      <div className="text-sm text-muted-foreground">
                        Essential for the website to function properly
                      </div>
                    </div>
                    <div className="flex items-center">
                      <div className="w-10 h-6 bg-primary rounded-full flex items-center justify-end px-1">
                        <div className="w-4 h-4 bg-white rounded-full"></div>
                      </div>
                    </div>
                  </div>
                  
                  {/* Analytics Cookies */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-foreground">Analytics Cookies</div>
                      <div className="text-sm text-muted-foreground">
                        Help us understand how visitors interact with our website
                      </div>
                    </div>
                    <button
                      onClick={() => handlePreferenceChange('analytics')}
                      className={`w-10 h-6 rounded-full flex items-center transition-colors ${
                        preferences.analytics 
                          ? 'bg-primary justify-end' 
                          : 'bg-gray-300 justify-start'
                      }`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full mx-1"></div>
                    </button>
                  </div>
                  
                  {/* Marketing Cookies */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-foreground">Marketing Cookies</div>
                      <div className="text-sm text-muted-foreground">
                        Used to track visitors across websites for advertising
                      </div>
                    </div>
                    <button
                      onClick={() => handlePreferenceChange('marketing')}
                      className={`w-10 h-6 rounded-full flex items-center transition-colors ${
                        preferences.marketing 
                          ? 'bg-primary justify-end' 
                          : 'bg-gray-300 justify-start'
                      }`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full mx-1"></div>
                    </button>
                  </div>
                  
                  {/* Functional Cookies */}
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-foreground">Functional Cookies</div>
                      <div className="text-sm text-muted-foreground">
                        Enable enhanced functionality and personalization
                      </div>
                    </div>
                    <button
                      onClick={() => handlePreferenceChange('functional')}
                      className={`w-10 h-6 rounded-full flex items-center transition-colors ${
                        preferences.functional 
                          ? 'bg-primary justify-end' 
                          : 'bg-gray-300 justify-start'
                      }`}
                    >
                      <div className="w-4 h-4 bg-white rounded-full mx-1"></div>
                    </button>
                  </div>
                </div>
                
                <div className="flex gap-3 mt-6">
                  <Button onClick={handleSavePreferences} className="flex-1">
                    Save Preferences
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowSettings(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </>
  );
};

export default CookieConsent;
