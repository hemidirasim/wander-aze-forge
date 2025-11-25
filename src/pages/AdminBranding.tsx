import React, { useEffect, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ImageIcon, Info, RefreshCcw, Save, Upload, Wand2 } from 'lucide-react';

interface BrandingData {
  favicon_url: string;
  apple_touch_icon_url?: string;
  updated_at?: string;
  updated_by?: string;
}

const allowedTypes = [
  'image/png',
  'image/svg+xml',
  'image/x-icon',
  'image/vnd.microsoft.icon',
  'image/webp'
];

const AdminBranding: React.FC = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [loading, setLoading] = useState(true);
  const [uploading, setUploading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [branding, setBranding] = useState<BrandingData>({
    favicon_url: '',
    apple_touch_icon_url: ''
  });

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }

    fetchBranding();
  }, [navigate]);

  const fetchBranding = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/site-branding');
      if (!response.ok) {
        throw new Error('Failed to load branding');
      }
      const payload = await response.json();
      if (payload?.success && payload.data) {
        setBranding({
          favicon_url: payload.data.favicon_url || '',
          apple_touch_icon_url: payload.data.apple_touch_icon_url || '',
          updated_at: payload.data.updated_at,
          updated_by: payload.data.updated_by
        });
      }
    } catch (error) {
      console.error('Failed to fetch branding:', error);
    } finally {
      setLoading(false);
    }
  };

  const convertToBase64 = (file: File) => {
    return new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleFileUpload = async (file: File | null) => {
    if (!file) return;

    if (!allowedTypes.includes(file.type)) {
      alert(`Icon tipi dəstəklənmir. Uyğun formatlar: ${allowedTypes.join(', ')}`);
      return;
    }

    if (file.size > 2 * 1024 * 1024) {
      alert('Favicon faylı maksimum 2MB ola bilər.');
      return;
    }

    try {
      setUploading(true);

      const base64 = await convertToBase64(file);
      const body = {
        fileData: base64.split(',')[1],
        filename: file.name,
        fileType: file.type,
        fileSize: file.size,
        category: 'branding'
      };

      const response = await fetch('/api/upload', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(body)
      });

      const result = await response.json();

      if (!response.ok || !result?.success) {
        throw new Error(result?.error || 'Yükləmə zamanı xəta baş verdi');
      }

      setBranding(prev => ({
        ...prev,
        favicon_url: result.url,
        apple_touch_icon_url: result.url
      }));
    } catch (error) {
      console.error('Failed to upload favicon:', error);
      alert(error instanceof Error ? error.message : 'Favicon yüklənə bilmədi');
    } finally {
      setUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  const handleSave = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!branding.favicon_url) {
      alert('Əvvəlcə favicon linkini daxil edin.');
      return;
    }

    try {
      setSaving(true);
      const adminUser = localStorage.getItem('adminUser');
      const parsedUser = adminUser ? JSON.parse(adminUser) : null;

      const response = await fetch('/api/site-branding', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          favicon_url: branding.favicon_url,
          apple_touch_icon_url: branding.apple_touch_icon_url,
          updated_by: parsedUser?.username || 'admin-panel'
        })
      });

      const payload = await response.json();

      if (!response.ok || !payload?.success) {
        throw new Error(payload?.error || 'Yeniləmə zamanı xəta baş verdi');
      }

      alert('Favicon uğurla yeniləndi!');
      await fetchBranding();
    } catch (error) {
      console.error('Failed to save branding:', error);
      alert(error instanceof Error ? error.message : 'Məlumat saxlanıla bilmədi');
    } finally {
      setSaving(false);
    }
  };

  const copyToClipboard = (value: string) => {
    if (!value) return;
    navigator.clipboard.writeText(value);
    alert('Link panoya kopyalandı');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate('/admin')} className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Panelə qayıt</span>
          </Button>
          <Badge variant="outline" className="flex items-center space-x-2">
            <Wand2 className="w-4 h-4 text-blue-500" />
            <span>Səhifə ikonkası</span>
          </Badge>
        </div>

        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Favicon & Branding</h1>
          <p className="text-gray-600">Saytın brauzer tabında görünən ikonunu burada yeniləyə bilərsiniz.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <ImageIcon className="w-5 h-5 text-blue-500" />
                <span>Cari favicon</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-6">
                <div className="w-20 h-20 rounded-2xl border border-gray-200 flex items-center justify-center bg-white">
                  {branding.favicon_url ? (
                    <img
                      src={branding.favicon_url}
                      alt="Cari favicon"
                      className="w-12 h-12 object-contain"
                    />
                  ) : (
                    <div className="text-gray-400 text-sm text-center">Hələ ikon yoxdur</div>
                  )}
                </div>
                <div className="flex-1 space-y-2">
                  <p className="text-sm text-gray-600">
                    512x512 və ya 180x180 ölçülü şəffaf PNG/SVG faylı tövsiyə olunur. Maksimum ölçü 2MB.
                  </p>
                  <div className="space-x-3">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => fileInputRef.current?.click()}
                      disabled={uploading || loading}
                      className="inline-flex items-center space-x-2"
                    >
                      <Upload className="w-4 h-4" />
                      <span>{uploading ? 'Yüklənir...' : 'Yeni ikon yüklə'}</span>
                    </Button>
                    {branding.favicon_url && (
                      <Button
                        type="button"
                        variant="secondary"
                        onClick={() => copyToClipboard(branding.favicon_url)}
                      >
                        Linki kopyala
                      </Button>
                    )}
                  </div>
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept={allowedTypes.join(',')}
                    className="hidden"
                    onChange={(event) => handleFileUpload(event.target.files?.[0] || null)}
                  />
                </div>
              </div>

              {branding.updated_at && (
                <p className="text-xs text-gray-500">
                  Son yenilənmə: {new Date(branding.updated_at).toLocaleString()} {branding.updated_by && `- ${branding.updated_by}`}
                </p>
              )}
            </CardContent>
          </Card>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Save className="w-5 h-5 text-green-500" />
                <span>İkon linkləri</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="favicon_url">Favicon URL *</Label>
                <Input
                  id="favicon_url"
                  value={branding.favicon_url}
                  onChange={(e) => setBranding(prev => ({ ...prev, favicon_url: e.target.value }))}
                  placeholder="https://..."
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="apple_url">Apple Touch Icon URL</Label>
                <Input
                  id="apple_url"
                  value={branding.apple_touch_icon_url || ''}
                  onChange={(e) => setBranding(prev => ({ ...prev, apple_touch_icon_url: e.target.value }))}
                  placeholder="(Opsional) iOS üçün kvadrat ikon"
                />
              </div>

              <div className="flex items-center justify-end space-x-3 pt-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={fetchBranding}
                  disabled={loading}
                  className="inline-flex items-center space-x-2"
                >
                  <RefreshCcw className="w-4 h-4" />
                  <span>Yenilə</span>
                </Button>
                <Button type="submit" className="inline-flex items-center space-x-2" disabled={saving}>
                  <Save className="w-4 h-4" />
                  <span>{saving ? 'Yadda saxlanır...' : 'Yadda saxla'}</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </form>

        <Card className="shadow-md border border-blue-100">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-blue-700">
              <Info className="w-5 h-5" />
              <span>İstifadə qaydaları</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-sm text-gray-600 space-y-2">
            <p>• Fayl ölçüsü maksimum 2MB olmalıdır.</p>
            <p>• PNG, SVG, WEBP və ICO formatları dəstəklənir.</p>
            <p>• Yeni ikon saxlandıqdan sonra 1-2 dəqiqə ərzində saytda göstəriləcək.</p>
            <p>• Problem olduqda brauzer keşini təmizləyin və ya yeni tab açın.</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdminBranding;


