import {copy} from "./page"
import heroImg from '../public/PIA12936.jpg'
import logo from '../public/logo.svg'

export default function Head() {
  return (
    <>
      <title>{`${copy.title0} ${copy.title1}`}</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta name="description" content={copy.subtitle} />
      <link rel="icon" href={logo.src} sizes="any" type="image/svg+xml" />

      <meta property="og:title" content={`${copy.title0} ${copy.title1}`} />
      <meta
        property="og:description"
        content={copy.subtitle} />
      <meta
        property="og:image"
        content={heroImg.src} />
    </>
  )
}
