import Link, { LinkProps } from 'next/link'
import Image from 'next/image'
import styles from './page.module.css'
import copy from './copy'

export default function NavBar(props: NavBarProps) {
  return (
    <nav className={`container px-6 py-6 mx-auto md:px-12 ${props.className}`}>
      <div className="flex flex-wrap items-center justify-between">
        <Link href="/" className="inline-flex items-center">
          <Image src="/logo.svg" width={50} height={50} alt="Logo" className="" />
        </Link>

        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="flex flex-col py-4 text-right text-white md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium space-x-4 [&>*:hover]:font-normal uppercase last:mr-[-20px]">
            {props.links.map(({ content, ...linkProps }, i) => (
              <li key={i}>
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
  links: copy.links
}

interface NavBarProps {
  links: Array<LinkProps & { content: string }>;
  className?: string;
}


