import { ConfirmPage, StartPage } from '../sections/Start';
import type { NewsletterStrings } from '../newsletter/strings';
import { Site, type PageProps } from './Site';

/** The newsletter's sign-up page (/start/) and its confirmation page (/start/confirm/). The page gets only its own
 *  locale's newsletter copy (`nl`), not all eight. */
export default function StartSite({ page, nl, ...props }: PageProps & { page: 'start' | 'confirm'; nl: NewsletterStrings }) {
  return <Site page={page} {...props}>{page === 'start' ? <StartPage nl={nl} /> : <ConfirmPage nl={nl} />}</Site>;
}
