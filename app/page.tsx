import Image from 'next/image'
import Link, {LinkProps} from 'next/link'
import styles from './page.module.css'
import { Space_Mono } from '@next/font/google'

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
})

const data = {
  footer: "The first ever global contemporary art archive on the moon.",
}

function Form(props: FormProps) {
  return (
    <form className={props.className}>
      <div className="items-center mb-6 text-white grid gap-6 md:grid-cols-5">
        <div>
          <input type="text" id="full_name" className="border-b border-white text-white text-sm focus:border-blue-500 block w-full py-2.5 bg-transparent" placeholder="Full Name" required />
        </div>
        <div className="col-span-2">
          <input type="email" id="last_name" className="border-b border-white text-white text-sm focus:border-blue-500 block w-full py-2.5 bg-transparent" placeholder="Email Address" required />
        </div>
        <div>
        <button type="submit" className={`w-full py-2 text-white hover:bg-white hover:text-black ${styles['border-corners']}`}>Inquire</button>
        </div>
        <p className="text-[9px]">{props.disclaimer}</p>
      </div>
    </form>

  )
}

Form.defaultProps = {
  disclaimer: "We will never send you spam."
};

interface FormProps {
  className?: string;
  disclaimer: string;
}

function NavBar(props: NavBarProps) {
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


function Hero(props: HeroProps) {
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

          <Form className="mx-12 mt-12" />
        </div>
      </div>
    </section>
  )
}

Hero.defaultProps = {
  title0: "Arch Lunar",
  title1: "Arch Archive",
  subtitle: "The first ever global contemporary art archive on the moon.",
  links: []
};

interface HeroProps {
  title0: string;
  title1: string;
  subtitle: string;
  links: Array<LinkProps & { content: string }>;
}

function BinaryHR() {
  const text = "01000001 01000010 01001111 01010101 01010100 01000001 01000010 01001111 01010101 01010100 01000001 01000010 01001111 01010101 01010100 01000001 01000010 01001111 01010101 01010100 01000001 01000010 01001111 01010101 01010100 01000001 01000010 01001111 01010101 01010100 01000001 01000010 01001111 01010101 01010100 01000001 01000010 01001111 01010101 01010100 01000001 01000010 01001111 01010101 01010100 01000001 01000010 01001111 01010101 01010100 "
  return (
      <div className="text-[8px] text-[#E8E6E6] border-y border-[#E8E6E6] mt-20 overflow-hidden whitespace-nowrap py-4">{text}</div>
  )
}

function AboutBlock(props: AboutBlockProps) {
  return (
    <div className="relative p-4">
      <p
        className={`uppercase font-normal text-left text-white font-['Helvetica_Neue'] text-[42px]`}
      >
        {props.title}
      </p>
      <p
        className={`text-base font-normal text-left pt-6 m-0 leading-[normal] text-[rgba(232,230,230,1)] min-h-[200px] max-w-[400px]`}
      >
        {props.desc}
      </p>
      <p
        className={`text-xs font-bold tracking-widest leading-[normal] text-[rgba(232,230,230,1)] text-right`}
      >
        {props.index}
      </p>
      {props.type === "TYPE" && <span className="absolute right-4 top-8">✕</span>}
      {props.type === "TYPE1" && <span className="absolute right-4 top-8">+</span>}
      {props.type === "TYPE2" && <span className="absolute bottom-4 left-4">✕</span>}
      {props.type === "TYPE3" && <span className="absolute bottom-4 left-4">+</span>}
    </div>
  );
}

AboutBlock.defaultProps = {
  type: "TYPE",
  title: "LOREM",
  desc:
    "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Quis risus tempus morbi nunc tellus sit ipsum. Faucibus sed est amet hac auctor aliquam volutpat eu.",
  index: "03",
};

interface AboutBlockProps {
  type: "TYPE" | "TYPE1" | "TYPE2" | "TYPE3";
  title: string;
  desc: string;
  index: string;
}

function Footer(props: FooterProps) {
  return (
    <div className="container mx-auto">
    <div className="flex items-center">
      <i className={`${styles.crossVert}`}></i>

      <section className={`w-full mx-auto text-center text-white text-xs py-6`}>
        <i className={`w-full mx-auto my-6 ${styles.cross}`}></i>
        <div className="flex justify-center my-12">
          <Image src="/alaa_logo.svg" width="64" height="64" alt="ALAA Logo" className="h-6 mr-3 sm:h-9"/>
          <Image src="/logo.svg" width="64" height="64" alt="Logo"/>
        </div>
        <div className="font-bold uppercase space-x-16 [&>*:hover]:font-normal">
          {props.links.map(({content, ...linkProps}) => (
            <Link className={styles.surroundParens} {...linkProps}>{content}</Link>
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

export default function Home() {
  const links = [{href: "https://discord.gg/uvFsFtqgBG", content: "discord"}]
  return (
    <div className={`bg-[#161414] ${spaceMono.className}`}>
      <Hero links={links} />
      <BinaryHR />

      <section className="container mx-auto">
        <div className="items-center m-8 text-white divide-x grid md:grid-cols-2">
          <AboutBlock title="ARCH MISSION" desc="The Arch Lunar Art Archive is an extension of the Arch Mission Foundation’s commitment to document and preserve human culture around the solar system.  In 2019, Arch Mission deployed cutting-edge nanotechnology to send the largest library of human civilization into space via lunar lander." type="TYPE" index={"01"} />
          <AboutBlock title="BLOCKTAG" type="TYPE1" index={"02"} desc="Blocktag™ technology is used to bring physical objects into digital worlds, and digital items into the physical world." />
        </div>

        <hr className="mx-12"/>

        <div className="items-center m-8 text-white divide-x grid md:grid-cols-2">
          <AboutBlock title="NANOFICHE" type="TYPE2" index={"03"} desc="Nanofiche is a new analog archival preservation media that overcomes the limitations of existing technologies. 

            Unlike other alternatives, nickel-based Nanofiche never degrades and never has to be replaced."/>
          <AboutBlock title="NFT BLOCKCHAIN" type="TYPE3" index={"04"} desc="Every single piece of art is permanently bound to a record on a globally accessible, eco-friendly, and secure ledger that tracks provenance, authenticity, and ownership across space and time." />
        </div>
      </section>

      <BinaryHR />

      <Footer motto={data.footer} links={links}/>
    </div>
  )
}
