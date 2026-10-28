import { LearnPage } from '../sections/Pages';
import { Site, type PageProps } from './Site';

export default function LearnSite(props: PageProps) {
  return <Site page="learn" {...props}><LearnPage /></Site>;
}
