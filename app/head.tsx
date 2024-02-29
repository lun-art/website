import copy from "./copy"
import heroImg from '../public/PIA12936.jpg'

export default function Head() {
  return (
    <>
      <title>{`${copy.title0} ${copy.title1}`}</title>
      <meta content="width=device-width, initial-scale=1" name="viewport" />
      <meta name="description" content={copy.description} />

      <meta property="og:title" content={`${copy.title0} ${copy.title1}`} />
      <meta
        property="og:description"
        content={copy.description} />
      <meta
        property="og:image"
        content={heroImg.src} />
    </>
  )
}
