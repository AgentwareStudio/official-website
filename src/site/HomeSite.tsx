import { HomePage } from '../sections/Home';
import { Site, type PageProps } from './Site';

export default function HomeSite(props: PageProps) {
  return <Site page="home" {...props}><HomePage /></Site>;
}
