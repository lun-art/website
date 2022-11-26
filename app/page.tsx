import { Space_Mono } from '@next/font/google'
import Hero from './Hero'
import BinaryHR from './BinaryHR'
import AboutBlock from './AboutBlock'
import Footer from './Footer'

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
})

const data = {
  footer: "The first ever global contemporary art archive on the moon.",
}

export default function Home() {
  const links = [{href: "https://discord.gg/uvFsFtqgBG", content: "discord"}]
  return (
    <div className={`bg-[#161414] ${spaceMono.variable}`}>
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
