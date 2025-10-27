import React from 'react';

const Logo: React.FC<{ className?: string }> = ({ className = "w-8 h-8" }) => {
  return (
    <img 
      src="https://e4sm2p9cqicdxjyg.public.blob.vercel-storage.com/tour/1761568817280-hhhbsr.png"
      alt="OutTour Azerbaijan Logo"
      className={className}
      style={{ objectFit: 'contain' }}
    />
  );
};

export default Logo;

