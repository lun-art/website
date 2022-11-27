import Link, {LinkProps} from 'next/link'
import styles from './page.module.css'

export default function NavBar(props: NavBarProps) {
  return (
    <nav className={`container px-6 py-6 mx-auto md:px-12 ${props.className}`}>
      <div className="flex flex-wrap items-center justify-between">
        <a href="" className="inline-flex items-center">
          <img src="/alaa_logo.svg" alt="ALAA Logo" className="mr-3" />
          <img src="/logo.svg" alt="Logo" className="" />
        </a>

        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="flex flex-col py-4 text-right text-white md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium space-x-4 [&>*:hover]:font-normal uppercase">
            {props.links.map(({content, ...linkProps}) => (
              <li>
                <Link className={styles.surroundParens} {...linkProps}>{content}</Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>
  )
}

NavBar.defaultProps = {
  links: []
}

interface NavBarProps {
  links: Array<LinkProps & { content: string }>;
  className?: string;
}


