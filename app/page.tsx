import Image from 'next/image'
import styles from './page.module.css'
import { Space_Mono } from '@next/font/google'

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
})

const data = {
  title0: "Arch Lunar",
  title1: "Art Fair",
  subtitle: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec faucibus gravida a faucibus lorem vel at leo aliquet. Vitae ullamcorper amet erat purus tempor ultrices.",
  formDisclaimer: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Aliquam sit congue netus nibh lorem bibendum sit sed.",
  binaryHr: "01000001 01000010 01001111 01010101 01010100 01000001 01000010 01001111 01010101 01010100 01000001 01000010 01001111 01010101 01010100 01000001 01000010 01001111 01010101 01010100 01000001 01000010 01001111 01010101 01010100 01000001 01000010 01001111 01010101 01010100 01000001 01000010 01001111 01010101 01010100 01000001 01000010 01001111 01010101 01010100 01000001 01000010 01001111 01010101 01010100 01000001 01000010 01001111 01010101 01010100 "
}

function Form(props: any) {
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
        <p className="text-[9px]">{data.formDisclaimer}</p>
      </div>
    </form>

  )
}

function Hero(props: any) {
  const links = [
    ["title", "link"],
    ["title", "link"],
    ["title", "link"],
  ]
    
  return (
    <> 


    <section className="">
      <div
        className="pb-12 overflow-hidden bg-no-repeat bg-cover [background:linear-gradient(0deg,_rgba(32,_30,_30,_.05),_rgba(32,_30,_30,_0.5)),linear-gradient(0deg,_rgba(37,_35,_35,_1),_rgba(196,_196,_196,_0)_64%,_rgba(37,_35,_35,_1)),url(https://uortjlczjmucmpaqqhqm.supabase.co/storage/v1/object/public/firejet-converted-images/images/de3ba0eb5c88b696f576e026aad798aae339e91c.webp)_center_/_cover]"
      >

    <nav className="sm:px-12 py-2.5">
      <div className="container flex flex-wrap items-center justify-between mx-auto">
        <a href="" className="flex items-center">
          <img src="https://flowbite.com/docs/images/logo.svg" className="h-6 mr-3 sm:h-9" alt="ALAF Logo" />
        </a>

        <div className="hidden w-full md:block md:w-auto" id="navbar-default">
          <ul className="flex flex-col py-4 md:flex-row md:space-x-8 md:mt-0 md:text-sm md:font-medium">
            {links.map(x=> (
              <li>
                <a href={x[1]} className="block pl-4 text-right text-white" aria-current="page">{x[0]}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </nav>


        <div className={`mx-6 text-left text-white md:mx-12 ${styles['border-corners']}`}>
          <div className="p-6 pt-64 pb-16">
            <h1 className="mb-12 font-serif tracking-tight font-extralight text-7xl md:text-8xl xl:text-9xl">
              {data.title0}
              <br />
              <span className="font-sans">{data.title1}</span>
            </h1>
              <p className={`text-[17px]`}>
              {data.subtitle}
            </p>
          </div>
        </div>
      <hr className="mt-24" />
      <Form className="mx-12 mt-12" />
      </div>
    </section>
    </>
  )
}

function BinaryHR() {
  return (
      <div className="text-[8px] text-[#E8E6E6] border-y border-[#E8E6E6] mt-20 overflow-hidden whitespace-nowrap py-4">{data.binaryHr}</div>
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

function Footer(props: any) {
  return (
    <section className={`w-full mx-auto text-center text-white text-xs py-6`}>
      <div>+</div>
      <div className="my-6">logos</div>
      <div className="font-bold uppercase space-x-16 [&>*:hover]:underline [&>*:hover]:font-normal">
        <a href="#">Lorem Upsum</a>
        <a href="#">Lorem Upsum</a>
        <a href="#">Lorem Upsum</a>
      </div>
      <div className="max-w-[416px] mx-auto my-4 uppercase">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Consequat pharetra, nisi proin convallis.</div>
      <div>+</div>
    </section>
  )
}


export default function Home() {
  return (
    <div className={`bg-[#161414] ${spaceMono.className}`}>
      <Hero />
      <BinaryHR />

      <div className="items-center m-8 text-white divide-x grid md:grid-cols-2">
        <AboutBlock title="ARCH MISSION" desc="The Arch Mission Foundation chose a new technology — nickel based films of Nanofiche™ — for the Arch Lunar Library.™" type="TYPE" index={"01"} />
        <AboutBlock title="BLOCKTAG" type="TYPE1" index={"02"} />
      </div>
      <hr className="mx-12"/>
      <div className="items-center m-8 text-white divide-x grid md:grid-cols-2">
        <AboutBlock title="NANOFICHE" type="TYPE2" index={"03"} />
        <AboutBlock title="NFT BLOCKCHAIN" type="TYPE3" index={"04"} />
      </div>

      <BinaryHR />

      <Footer />
    </div>
  )
}
