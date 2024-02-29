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

export const copy = {
  title0: "Arch Lunar",
  title1: "Art Archive",
  description: "An extension of Arch Mission’s commitment to preserve human culture in outer space, this archive represents a snapshot of contemporary art in the year 2022, a time capsule containing responses to the moment by a diverse yet interconnected group of artists.",
  footer: "The first ever global contemporary art archive on the moon.",
  heroImg: "",
  artists: [
    "Aaron Naves ",
    "Adrian Pijoan",
    "Alex Anderson ",
    "Alex Mackin Dolan ",
    "Alex Seton",
    "Alice Wang",
    "Allen Hung-Lun Chen",
    "Allie Zhang",
    "Amalia Ulman",
    "Anarchy Dance Theatre",
    "Andreas Rønholt Schmidt",
    "Andrew Hahn",
    "Andrew Norman Wilson",
    "AP Nguyen",
    "Asha Schecter",
    "Asya Nur",
    "Aura Rosenberg",
    "Aushin Chang",
    "Barak Zemer",
    "Bart Seng",
    "Bjarne Bare",
    "Brigid Mason",
    "Candice Jee in cooperation with Yaya Huwat",
    "Carol Strober",
    "Casey Kauffmann",
    "Chen Chien Jung",
    "Chen Zi Yin",
    "Chia Lee",
    "Chris Hanke",
    "Cindy Conrad",
    "Dakota Blue",
    "Danielle Dean",
    "Donel Williams",
    "Edgar Fabián Frías",
    "Elliot Kaufman",
    "Emily Yang 艾蜜莉",
    "Emma Hazen",
    "Erik Frydenborg",
    "Erin Calla Watson",
    "Ewa Wojciak",
    "Filip Gilissen",
    "Fiona Connor",
    "Fung Yee Lick",
    "Gabby Davis",
    "Gauntlett Cheng",
    "Giacomo Giannantonio",
    "Gianna Surangkanjanajai",
    "Gina Mei",
    "Graham Epstein",
    "Hanna Rose Stewart",
    "Henri McMaster",
    "hooz",
    "Horacio Alcolea Crespo",
    "Ian Stanton",
    "Idolate",
    "Ilja Karilampi",
    "Jacob Cruzen",
    "Jared Madere",
    "Jared Richardson (JVY)",
    "Jasia Rabiej",
    "jason meadows",
    "Jasper Spicero",
    "Jaybe Lee",
    "Jeff Beal",
    "Jeffrey Scudder",
    "Jennifer Zhang",
    "Jessica Hang",
    "Johnny Forever Nawracaj (sound by Gambletron) ",
    "Jon Pylypchuk",
    "Jonathan Moore",
    "JPW3",
    "julia yerger",
    "Juliana Halpert",
    "Julie (peter. s)",
    "Kaiyen Tu",
    "Kate Sansom",
    "Kathy Haddad",
    "Ken Twitchell",
    "Lane Stewart",
    "Lin Pei-Yao",
    "Lindsay Lawson",
    "Liya Yu",
    "Liz Magic Lazer",
    "Louie Shirase",
    "Luis Serrano",
    "Maria Petschnig",
    "Martin Lammert",
    "Mathias Toubro",
    "Matt Siegle (candy machine)",
    "Matthew Cherrie",
    "Michael Pollard",
    "Ming Yao CHANG",
    "Mitchell Syrop",
    "MM33",
    "Mooncat",
    "Nao Bustamante",
    "natalie astraea",
    "Negashi Armada + Mickey Goodman",
    "Ni Hao",
    "Nick (peter s.)",
    "OUCHHH",
    "Olammy",
    "Paige K.B.",
    "Paulson Lee",
    "Peggy Peiting Huang",
    "Peter Schulman",
    "Rachel Zaretsky Radimir Koch",
    "Ralph Kuo Chiang Wu ",
    "Rasmus Røhling ",
    "Remilia Corp ",
    "RESEARCH Publications ",
    "Retro1999",
    "Robin Sparkes",
    "Sam Anderson",
    "Sam Mason",
    "Sarah Rara",
    "Scott Benzel",
    "Scroll",
    "Seyoung Yoon",
    "Shana Moulton ",
    "Shang-Ru Lin ",
    "Shang-Yang Wu",
    "So Youn Lee",
    "Sylvia Hardy",
    "The Conversationalist ",
    "Tobias Sprictig",
    "Tore Wallert",
    "Travis Diehl",
    "Viola Morini ",
    "Wednesday Kim ",
    "Will Wharton",
    "Wyatt Naoki Conlon ",
    "Xtra",
    "Zhuxue Deren ",
    "Zuzanna Bartoszek",
  ]
}

export default function Home() {
  const links = [{ href: "https://discord.gg/uvFsFtqgBG", content: "discord" }]
  return (
    <div className={`bg-[#161414] ${spaceMono.variable} font-mono`}>
      <Hero title0={copy.title0} title1={copy.title1} description={copy.description} links={links} />

      <section className="container mx-auto">
        <div className="items-center mx-12 text-white md:my-8 grid md:grid-cols-3 text-xs">
          {copy.artists.map((artist, i) => (
            <div key={i} className="flex justify-center">{artist}</div>
          ))}
        </div>
      </section>
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

      <Footer motto={copy.footer} links={links} />
    </div>
  )
}
