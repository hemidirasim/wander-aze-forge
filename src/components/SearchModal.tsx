import React, { useState, useEffect, useRef } from 'react';
import { Search, X, FileText, Building2, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface SearchResult {
  id: number;
  title: string;
  excerpt?: string;
  description?: string;
  image_url?: string;
  created_at: string;
  type: string;
  section: 'blog' | 'project' | 'tour';
}

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isOpen]);

  useEffect(() => {
    const searchTimeout = setTimeout(() => {
      if (query.length >= 2) {
        performSearch(query);
      } else {
        setResults([]);
        setHasSearched(false);
      }
    }, 300); // Debounce search

    return () => clearTimeout(searchTimeout);
  }, [query]);

  const performSearch = async (searchQuery: string) => {
    try {
      setLoading(true);
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      if (data.success) {
        setResults(data.data);
        setHasSearched(true);
      } else {
        setResults([]);
        setHasSearched(true);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setHasSearched(true);
    } finally {
      setLoading(false);
    }
  };

  const getSectionIcon = (section: string) => {
    switch (section) {
      case 'blog':
        return <FileText className="w-4 h-4" />;
      case 'project':
        return <Building2 className="w-4 h-4" />;
      case 'tour':
        return <MapPin className="w-4 h-4" />;
      default:
        return <FileText className="w-4 h-4" />;
    }
  };

  const getSectionColor = (section: string) => {
    switch (section) {
      case 'blog':
        return 'bg-blue-100 text-blue-800';
      case 'project':
        return 'bg-green-100 text-green-800';
      case 'tour':
        return 'bg-purple-100 text-purple-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getSectionLabel = (section: string) => {
    switch (section) {
      case 'blog':
        return 'Blog';
      case 'project':
        return 'Project';
      case 'tour':
        return 'Tour';
      default:
        return 'Unknown';
    }
  };

  const handleResultClick = (result: SearchResult) => {
    const baseUrl = window.location.origin;
    let url = '';
    
    switch (result.section) {
      case 'blog':
        url = `${baseUrl}/blog/${result.id}`;
        break;
      case 'project':
        url = `${baseUrl}/projects/${result.id}`;
        break;
      case 'tour':
        url = `${baseUrl}/tours/${result.id}`;
        break;
    }
    
    if (url) {
      window.location.href = url;
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-start justify-center pt-20">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4 max-h-[80vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center gap-4 p-4 border-b">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search blogs, projects, and tours..."
              className="pl-10 pr-4"
            />
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        {/* Results */}
        <div className="max-h-96 overflow-y-auto">
          {loading && (
            <div className="p-8 text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
              <p className="text-muted-foreground">Searching...</p>
            </div>
          )}

          {!loading && query.length < 2 && (
            <div className="p-8 text-center">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-muted-foreground">Type at least 2 characters to search</p>
            </div>
          )}

          {!loading && query.length >= 2 && hasSearched && results.length === 0 && (
            <div className="p-8 text-center">
              <Search className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-muted-foreground">No results found for "{query}"</p>
            </div>
          )}

          {!loading && results.length > 0 && (
            <div className="p-4 space-y-2">
              {results.map((result) => (
                <Card 
                  key={`${result.section}-${result.id}`}
                  className="cursor-pointer hover:shadow-md transition-shadow"
                  onClick={() => handleResultClick(result)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      {result.image_url && (
                        <img 
                          src={result.image_url} 
                          alt={result.title}
                          className="w-12 h-12 object-cover rounded-lg flex-shrink-0"
                        />
                      )}
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-sm line-clamp-1">{result.title}</h3>
                          <Badge 
                            variant="secondary" 
                            className={`text-xs ${getSectionColor(result.section)}`}
                          >
                            <span className="flex items-center gap-1">
                              {getSectionIcon(result.section)}
                              {getSectionLabel(result.section)}
                            </span>
                          </Badge>
                        </div>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {result.excerpt || result.description}
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SearchModal;
