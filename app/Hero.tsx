import Image from 'next/image'
import {LinkProps} from 'next/link'
import styles from './page.module.css'
import NewsletterSubscribe from './NewsletterSubscribe'
import NavBar from './NavBar'
import heroImg from '../public/PIA12936.jpg'


export default function Hero(props: HeroProps) {
  return (
    <section className="relative pb-12">
      <Image
        className=""
        alt="Surface of the moon"
        src={heroImg}
        placeholder="blur"
        quality={100}
        fill
        sizes="100vw"
        style={{
          objectFit: 'cover',
        }}
      />
      <div className="absolute w-full h-full top-0 left-0 [background:linear-gradient(0deg,_rgba(32,_30,_30,_.05),_rgba(32,_30,_30,_0.5)),linear-gradient(0deg,_rgba(37,_35,_35,_1),_rgba(196,_196,_196,_0)_64%,_rgba(37,_35,_35,_1))]" />

      <NavBar className="relative" links={props.links} />

      <div className="container relative mx-auto">
        <div className="mx-6 md:mx-12">
          <div className={`text-left text-white ${styles['border-corners']}`}>
            <div className="p-6 py-16 sm:pt-64">
              <h1 className="mb-12 font-serif text-6xl tracking-tight font-extralight lg:text-7xl md:text-8xl xl:text-9xl">
                {props.title0}
                <br />
                <span className="inline-flex items-baseline font-sans">
                  {props.title1}
                  <img src="/logo.svg" alt="Logo" className="self-center h-[0.7em] mx-4 mb-[-.1em]" />
                </span>
              </h1>
              <p className={`text-[17px]`}>
                {props.subtitle}
              </p>
            </div>
          </div>

          <hr className="relative mt-24" />

          <NewsletterSubscribe className="relative mt-12" />

        </div>
      </div>
    </section>
  )
}

Hero.defaultProps = {
  title0: "Arch Lunar",
  title1: "Art Archive",
  subtitle: "The first ever global contemporary art archive on the moon.",
  links: []
};

interface HeroProps {
  title0: string;
  title1: string;
  subtitle: string;
  links: Array<LinkProps & { content: string }>;
}
