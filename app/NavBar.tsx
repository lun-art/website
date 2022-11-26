import Image from 'next/image'
import Link, {LinkProps} from 'next/link'
import styles from './page.module.css'

export default function NavBar(props: NavBarProps) {
  return (
    <nav className="container py-6 mx-auto sm:px-12">
      <div className="flex flex-wrap items-center justify-between">
        <a href="" className="flex items-center">
          <Image src="/alaa_logo.svg" width="64" height="64" alt="ALAA Logo" className="h-6 mr-3 sm:h-9"/>
          <Image src="/logo.svg" width="64" height="64" alt="Logo"/>
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
}


