'use client';

import { useState } from 'react';
import { decode } from 'html-entities';
import styles from './page.module.css'

export default function NewsletterForm({status, message, onValidated, ...props}: IProps & NewsletterFormProps) {
  const MAILCHIMP_ANTIBOT_KEY = "b_3fb991031052dd8cab9c24f39_064676e511"

  const [ error, setError ] = useState("");
  const [ email, setEmail ] = useState("");
  const [ name, setName ] = useState("");

  /**
   * Handle form submit.
   *
   * @return {{value}|*|boolean|null}
   */
  const handleSubmit = (event:any) => {
    event.preventDefault()

    setError("");

    if ( ! email ) {
      setError( 'Please enter a valid email address' );
      return null;
    }

    if (!name) {
      setError( 'Please enter a valid name' );
      return null;
    }

    const [FNAME, LNAME] = name.split(" ")

    let formData: {[key: string]: any} = { EMAIL: email, FNAME, LNAME }
    formData[MAILCHIMP_ANTIBOT_KEY] = ""
    const isFormValidated = onValidated(formData);

    // On success return true
    return email && email.indexOf("@") > -1 && isFormValidated;
  }

  /**
   * Extract message from string.
   */
  const getMessage = (message:string) => {
    if ( !message ) {
     return null;
    }
    const result = message?.split('-') ?? null;
    if ( "0" !== result?.[0]?.trim() ) {
     return decode(message);
    }
    const formattedMessage = result?.[1]?.trim() ?? null;
    return formattedMessage ? decode( formattedMessage ) : null;
  }

  return (
    <form className={props.className} onSubmit={handleSubmit}>
      <div className="items-center mb-6 text-white grid gap-6 md:grid-cols-5">
        <div>
          <input type="text" id="full_name" className="border-b border-white text-white text-sm focus:border-blue-500 block w-full py-2.5 bg-transparent" placeholder="Full Name" required 
            onChange={(event) => setName(event?.target?.value ?? '')}
          />
        </div>
        <div className="col-span-2">
          <input type="email" id="last_name" className="border-b border-white text-white text-sm focus:border-blue-500 block w-full py-2.5 bg-transparent" placeholder="Email Address" required
            onChange={(event) => setEmail(event?.target?.value ?? '')}
          />
        </div>
        <div>
          <input type="submit" className={`w-full py-2 text-white hover:bg-white hover:text-black ${styles['border-corners']}`} value="Inquire" />
        </div>
        <div className="text-[9px]">{props.disclaimer}
          {status === "sending" && <div>Sending...</div>}
          {status === "error" || error ? (
            <div
              className="newsletter-form-error"
              dangerouslySetInnerHTML={{ __html: error || getMessage( message ) || "" }}
            />
          ) : null }
          {status === "success" && !error && (
            <div dangerouslySetInnerHTML={{ __html: decode(message) }} />
          )}
        </div>
      </div>
    </form>
  );
}

type Status = 'sending' | 'error' | 'success';
interface IProps {
  onValidated: (props: { EMAIL: string, LNAME?: string, FNAME?: string, [key: string]: any }) => boolean;
  status: Status;
  message: string;
}

NewsletterForm.defaultProps = {
  disclaimer: "We will never send you spam."
};

export interface NewsletterFormProps {
  className?: string;
  disclaimer?: string;
}
