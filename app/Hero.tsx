import {LinkProps} from 'next/link'
import styles from './page.module.css'
import NewsletterSubscribe from './NewsletterSubscribe'
import NavBar from './NavBar'

export default function Hero(props: HeroProps) {
  return (
    <section className="">
      <div
        className="pb-12 overflow-hidden bg-no-repeat bg-cover [background:linear-gradient(0deg,_rgba(32,_30,_30,_.05),_rgba(32,_30,_30,_0.5)),linear-gradient(0deg,_rgba(37,_35,_35,_1),_rgba(196,_196,_196,_0)_64%,_rgba(37,_35,_35,_1)),url(https://uortjlczjmucmpaqqhqm.supabase.co/storage/v1/object/public/firejet-converted-images/images/de3ba0eb5c88b696f576e026aad798aae339e91c.webp)_center_/_cover]"
      >

        <NavBar links={props.links} />

        <div className="container mx-auto">
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

            <hr className="mt-24" />

            <NewsletterSubscribe className="mt-12" />

          </div>
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
