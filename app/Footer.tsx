import Link, {LinkProps} from 'next/link'
import styles from './page.module.css'

export default function Footer(props: FooterProps) {
  return (
    <div className="container mx-auto">
      <div className="flex items-center">
        <i className={`${styles.crossVert}`}></i>

        <section className={`w-full mx-auto text-center text-white text-xs py-6`}>
          <i className={`w-full mx-auto my-6 ${styles.cross}`}></i>
          <div className="inline-flex items-center my-12">
            <img src="/logo.svg" alt="Logo" className="" />
          </div>
          <div className="font-bold uppercase space-x-16 [&>*:hover]:font-normal">
            {props.links.map(({content, ...linkProps}, i) => (
              <Link key={i} className={styles.surroundParens} {...linkProps}>{content}</Link>
            ))}
          </div>
          <div className="max-w-[416px] mx-auto my-4 uppercase">{props.motto}</div>
          <i className={`w-full mx-auto my-12 ${styles.cross}`}></i>
        </section>

        <i className={`${styles.crossVert}`}></i>
      </div>
    </div>
  )
}

Footer.defaultProps = {
  motto: "The first ever global contemporary art archive on the moon.",
  links: []
};

interface FooterProps {
  motto: string;
  links: Array<LinkProps & { content: string }>;
}

