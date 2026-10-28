import { NotFoundPage } from '../sections/Pages';
import { BrowserSite } from './Site';

/** The single 404 page serves every path: it takes its locale from the path and renders in the browser only. */
export default function NotFoundSite() {
  return <BrowserSite page="notfound">{() => <NotFoundPage />}</BrowserSite>;
}
