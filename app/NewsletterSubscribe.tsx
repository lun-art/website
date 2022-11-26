'use client';

import MailchimpSubscribe from 'react-mailchimp-subscribe';
import NewsletterForm, {NewsletterFormProps} from './NewsletterForm';

export default function NewsletterSubscribe(props: NewsletterFormProps) {

  const MAILCHIMP_URL = process.env.NEXT_PUBLIC_MAILCHIMP_URL;

  return (
    <MailchimpSubscribe
      url={ MAILCHIMP_URL! }
      render={ ( { subscribe, status, message } ) => {
        return (
          <NewsletterForm
            className={ props.className }
            disclaimer={ props.disclaimer }
            status={ status }
            message={ message }
            onValidated={ (formData: any) => subscribe( formData ) }
          />
        );
      } }
    />
  );
};
