import Papa from 'papaparse'
import type { Metadata, ResolvingMetadata } from 'next'
import Image from 'next/image'
import NavBar from "../../NavBar";
import styles from '../../page.module.css'
import { ArtistData } from '../../ArtistList';

const dataUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vSxtJtC0h6tJQxMd35cSpWTCOnhFITwadMAC_0O_5EsdqxmXVYApIY3VHoePh3ZpZf6Nqaqo_4qRwsL/pub?gid=0&single=true&output=csv'

type Props = {
    params: { slug: string }
    searchParams: { [key: string]: string | string[] | undefined }
}

// show 404 if not found
export const dynamicParams = false;

export async function generateMetadata(
    { params }: Props,
    parent: ResolvingMetadata
): Promise<Metadata> {
    const data = await fetchDataForSlug(params.slug)

    // optionally access and extend (rather than replace) parent metadata
    // const previousImages = (await parent).openGraph?.images || []

    return {
        title: data?.name,
        //openGraph: {
        //    images: ['/some-specific-page-image.jpg', ...previousImages],
        //},
    }
}

export async function generateStaticParams() {
    const response = await fetch(dataUrl);
    const csvData = await response.text();

    const parsedData = Papa.parse<ArtistData>(csvData, { header: true });
    const data = parsedData.data.map((row) => {
        return {
            slug: row.slug,
        };
    });

    return data
}

export default async function Page({ params }: Props) {
    const data = await fetchDataForSlug(params.slug)

    if (!data) {
        return <></>
    }

    return (
        <>
            <NavBar className="relative" />

            <ArtistHero {...data} />

            <ListWorks works={data.works || ''} />
        </>
    )
}

function ArtistHero({ name, title, description }: ArtistData): JSX.Element {
    return (
        <section className="relative pb-12">
            <div className="absolute w-full h-full top-0 left-0 [background:linear-gradient(0deg,_rgba(32,_30,_30,_.05),_rgba(32,_30,_30,_0.5)),linear-gradient(0deg,_rgba(37,_35,_35,_1),_rgba(196,_196,_196,_0)_64%,_rgba(37,_35,_35,_1))]" />

            <div className="container relative mx-auto">
                <div className="mx-6 md:mx-12 py-6 md:py-12">
                    <div className={`text-left text-white ${styles['border-corners']}`}>
                        <div className="p-6 py-16 sm:pt-64">
                            <h1 className="mb-12 font-serif text-6xl tracking-tight font-extralight lg:text-7xl md:text-8xl xl:text-9xl">
                                {name}
                                <br />
                                <span className="inline-flex items-baseline font-sans">
                                    {title}
                                    {/*<img src="/logo.svg" alt="Logo" className="self-center h-[0.7em] mx-4 mb-[-.1em]" />*/}
                                </span>
                            </h1>
                            <p className={`text-[17px] xl:w-1/2 whitespace-pre-wrap`}>
                                {description}
                            </p>
                        </div>
                    </div>

                    <hr className="relative mt-24" />

                </div>
            </div>
        </section>
    );
}

function ListWorks({ works }: { works: string; }): JSX.Element {
    if (works === '') {
        return <></>;
    }

    // Split the works string into an array of work strings
    const worksArray = works.split(';').map(workString => {
        // Split each work string into its parts: title, name, and image link
        const parts = workString.split(',');
        return {
            title: parts[0],
            name: parts[1],
            imageLink: parts[2]
        };
    });

    return (
        <section className="grid grid-cols-3 gap-4 p-4"> {/* Adjust the grid styling as needed */}
            {worksArray.map((work, index) => (
                <div key={index} className="artwork-item"> {/* Add specific styles to artwork-item as needed */}
                    <Image src={work.imageLink} alt={`${work.title} by ${work.name}`} className="w-full" />
                    <h3 className="text-center">{work.title}</h3>
                    <p className="text-center">{work.name}</p>
                </div>
            ))}
        </section>
    );
}

async function fetchDataForSlug(slug: string) {
    // Fetch the CSV data and find the row with the given slug
    const response = await fetch(dataUrl);
    const csvData = await response.text();
    const parsedData = Papa.parse<ArtistData>(csvData, { header: true });

    // Find the data for the given slug
    return parsedData.data.find(row => row.slug === slug);
}