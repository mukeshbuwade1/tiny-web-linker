
// components/Meta.tsx
import React from 'react';
import { Helmet } from 'react-helmet';

type MetaProps = {
  title: string;
  description: string;
  keywords?: string;
  url?: string;
};

const Meta: React.FC<MetaProps> = ({ title, description, keywords, url }) => {
  // Default keywords that will be included on all pages
  const defaultKeywords = "url shortener, free url shortener, best url shortener, custom url shortener, bitly url shortener alternative, tiny url shortener alternative, link shortener";
  
  // Combine default keywords with any page-specific keywords
  const allKeywords = keywords ? `${defaultKeywords}, ${keywords}` : defaultKeywords;
  
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={allKeywords} />
      {url && <meta property="og:url" content={url} />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta name="twitter:card" content="summary" />
    </Helmet>
  );
};

export default Meta;
