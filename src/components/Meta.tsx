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
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      {url && <meta property="og:url" content={url} />}
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta name="twitter:card" content="summary" />
    </Helmet>
  );
};

export default Meta;
