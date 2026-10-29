// Blog pages: the shared shell (header, language menu, footer) around content rendered by Astro.
// The article arrives as the island's children (an Astro slot), so its HTML is not repeated in the island props.
import type React from 'react';
import type { Alternates } from '../components/Chrome';
import { Site, type PageProps } from './Site';

export default function BlogSite(props: PageProps & { page: 'blog' | 'post'; alternates?: Alternates; children?: React.ReactNode }) {
  const { children, ...rest } = props;
  return <Site {...rest}>{children}</Site>;
}
