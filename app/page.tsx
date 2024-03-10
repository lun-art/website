import { Space_Mono } from "next/font/google"
import Papa from 'papaparse'
import Hero from './Hero'
import BinaryHR from './BinaryHR'
import AboutBlock from './AboutBlock'
import ArtistList, { ArtistData } from './ArtistList'
import copy from './copy'

const spaceMono = Space_Mono({
  weight: ['400', '700'],
  subsets: ['latin'],
  variable: '--font-space-mono',
})

export default async function Home() {
  const links = [
    { href: "https://www.archmission.org/", content: "arch mission" },
    { href: "https://x.com/arch_lunar", content: "x" },
    { href: "https://instagram/arch_lunar_art_archive", content: "instagram" },
    { href: "https://warpcast.com/art-archive", content: "farcaster" },
    { href: "https://discord.gg/uvFsFtqgBG", content: "discord" },
  ]
  const response = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vSxtJtC0h6tJQxMd35cSpWTCOnhFITwadMAC_0O_5EsdqxmXVYApIY3VHoePh3ZpZf6Nqaqo_4qRwsL/pub?gid=0&single=true&output=csv');
  const csvData = await response.text();
  const parsedData = Papa.parse<ArtistData>(csvData, { header: true });
  const data: ArtistData[] = parsedData.data

  return (
    <div className={`bg-[#161414] ${spaceMono.variable} font-mono`}>
      <Hero title0={copy.title0} title1={copy.title1} description={copy.description} links={links} />

      <ArtistList artists={data} />

      <BinaryHR />

      <section className="container mx-auto">
        <div className="items-center mx-8 text-white md:my-8 md:divide-x grid md:grid-cols-2">
          <AboutBlock title="ARCH MISSION" desc="The Arch Lunar Art Archive is an extension of the Arch Mission Foundation’s commitment to document and preserve human culture around the solar system.  In 2019, Arch Mission deployed cutting-edge nanotechnology to send the largest library of human civilization into space via lunar lander." type="TYPE" index={"01"} />
          <AboutBlock className="border-l md:border-l-0" title="BLOCKTAG" type="TYPE1" index={"02"} desc="Blocktag™ technology is used to bring physical objects into digital worlds, and digital items into the physical world." />
        </div>

        <hr className="hidden mx-12 sm:block" />

        <div className="items-center mx-8 text-white md:my-8 md:divide-x grid md:grid-cols-2">
          <AboutBlock className="border-r md:border-r-0" title="NANOFICHE" type="TYPE2" index={"03"} desc="Nanofiche is a new analog archival preservation media that overcomes the limitations of existing technologies. 

            Unlike other alternatives, nickel-based Nanofiche never degrades and never has to be replaced."/>
          <AboutBlock title="BLOCKCHAIN" type="TYPE3" index={"04"} desc="Every single piece of art is permanently bound to a record on a globally accessible, eco-friendly, and secure ledger that tracks provenance, authenticity, and ownership across space and time." />
        </div>
      </section>

      <BinaryHR />
    </div>
  )
}
