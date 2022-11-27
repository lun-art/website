import Image from 'next/image'
import Link, {LinkProps} from 'next/link'
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
          <div className={`mx-6 text-left text-white md:mx-12 ${styles['border-corners']}`}>
            <div className="p-6 pt-64 pb-16">
              <h1 className="mb-12 font-serif tracking-tight font-extralight text-7xl md:text-8xl xl:text-9xl">
                {props.title0}
                <br />
                <span className="font-sans">
                  {props.title1}
                </span>
                <Image className="inline ml-4" src="/logo.svg" width="192" height="128" alt="Logo"/>
              </h1>
              <p className={`text-[17px]`}>
                {props.subtitle}
              </p>
            </div>
          </div>

          <hr className="mx-12 mt-24" />

          <NewsletterSubscribe className="mx-12 mt-12" />
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
