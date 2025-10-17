import React, { useEffect, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';

interface SummernoteEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: number;
}

// Extend Window interface for jQuery and Summernote
declare global {
  interface Window {
    $: any;
    jQuery: any;
  }
}

const SummernoteEditor: React.FC<SummernoteEditorProps> = ({
  value,
  onChange,
  placeholder = "Write your content here...",
  height = 300
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const summernoteRef = useRef<any>(null);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Check if Summernote is already loaded
    if (window.$ && window.$.fn && window.$.fn.summernote) {
      initializeEditor();
      return;
    }

    // Load jQuery first if not available
    if (!window.$) {
      const jqueryScript = document.createElement('script');
      jqueryScript.src = 'https://code.jquery.com/jquery-3.6.0.min.js';
      jqueryScript.onload = () => {
        loadSummernote();
      };
      document.head.appendChild(jqueryScript);
    } else {
      loadSummernote();
    }

    function loadSummernote() {
      // Load CSS
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/summernote@0.8.20/dist/summernote-lite.min.css';
      document.head.appendChild(link);

      // Load JS
      const script = document.createElement('script');
      script.src = 'https://cdn.jsdelivr.net/npm/summernote@0.8.20/dist/summernote-lite.min.js';
      script.onload = () => {
        // Wait a bit for Summernote to be fully available
        setTimeout(() => {
          if (window.$ && window.$.fn && window.$.fn.summernote) {
            initializeEditor();
          } else {
            console.error('Summernote not available after loading');
          }
        }, 100);
      };
      script.onerror = () => {
        console.error('Failed to load Summernote');
      };
      document.head.appendChild(script);
    }

    function initializeEditor() {
      if (editorRef.current && window.$ && window.$.fn && window.$.fn.summernote) {
        try {
          // Initialize Summernote
          summernoteRef.current = window.$(editorRef.current).summernote({
            height: height,
            placeholder: placeholder,
            toolbar: [
              ['style', ['style']],
              ['font', ['bold', 'underline', 'clear']],
              ['fontname', ['fontname']],
              ['color', ['color']],
              ['para', ['ul', 'ol', 'paragraph']],
              ['table', ['table']],
              ['insert', ['link', 'picture', 'video']],
              ['view', ['fullscreen', 'codeview', 'help']]
            ],
            callbacks: {
              onImageUpload: function(files: File[]) {
                // Handle image upload
                handleImageUpload(files[0]);
              },
              onChange: function(contents: string) {
                onChange(contents);
              }
            }
          });

          // Set initial value
          if (value) {
            window.$(editorRef.current).summernote('code', value);
          }
          
          setIsLoaded(true);
        } catch (error) {
          console.error('Error initializing Summernote:', error);
        }
      }
    }

    // Cleanup
    return () => {
      if (summernoteRef.current && isLoaded) {
        try {
          summernoteRef.current.summernote('destroy');
        } catch (error) {
          console.error('Error destroying Summernote:', error);
        }
      }
    };
  }, []);

  useEffect(() => {
    if (isLoaded && summernoteRef.current && value !== window.$(editorRef.current).summernote('code')) {
      try {
        window.$(editorRef.current).summernote('code', value);
      } catch (error) {
        console.error('Error setting Summernote value:', error);
      }
    }
  }, [value, isLoaded]);

  const handleImageUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('image', file);

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const result = await response.json();
        if (result.success && result.url) {
          // Insert image into editor
          const img = `<img src="${result.url}" alt="${file.name}" style="max-width: 100%; height: auto;">`;
          try {
            window.$(editorRef.current).summernote('insertNode', document.createRange().createContextualFragment(img));
          } catch (error) {
            console.error('Error inserting image:', error);
          }
        }
      } else {
        console.error('Image upload failed');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div className="space-y-2">
      {!isLoaded && (
        <div className="border rounded-md p-4 text-center text-muted-foreground">
          Loading editor...
        </div>
      )}
      <div 
        ref={editorRef}
        className="border rounded-md"
        style={{ minHeight: `${height}px`, display: isLoaded ? 'block' : 'none' }}
      />
    </div>
  );
};

export default SummernoteEditor;
