import React, { useEffect, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X } from 'lucide-react';

interface SummernoteEditorProps {
  value: string;
  onChange: (content: string) => void;
  placeholder?: string;
  height?: number;
}

const SummernoteEditor: React.FC<SummernoteEditorProps> = ({
  value,
  onChange,
  placeholder = "Write your content here...",
  height = 300
}) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const summernoteRef = useRef<any>(null);

  useEffect(() => {
    // Dynamically import Summernote
    const loadSummernote = async () => {
      try {
        // Load CSS
        const link = document.createElement('link');
        link.rel = 'stylesheet';
        link.href = 'https://cdn.jsdelivr.net/npm/summernote@0.8.20/dist/summernote-lite.min.css';
        document.head.appendChild(link);

        // Load JS
        const script = document.createElement('script');
        script.src = 'https://cdn.jsdelivr.net/npm/summernote@0.8.20/dist/summernote-lite.min.js';
        script.onload = () => {
          if (editorRef.current && window.$) {
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
          }
        };
        document.head.appendChild(script);
      } catch (error) {
        console.error('Error loading Summernote:', error);
      }
    };

    loadSummernote();

    // Cleanup
    return () => {
      if (summernoteRef.current) {
        summernoteRef.current.destroy();
      }
    };
  }, []);

  useEffect(() => {
    if (summernoteRef.current && value !== summernoteRef.current.summernote('code')) {
      summernoteRef.current.summernote('code', value);
    }
  }, [value]);

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
          summernoteRef.current.summernote('insertNode', document.createRange().createContextualFragment(img));
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
      <div 
        ref={editorRef}
        className="border rounded-md"
        style={{ minHeight: `${height}px` }}
      />
    </div>
  );
};

export default SummernoteEditor;
