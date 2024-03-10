import Link from 'next/link'

export default function ArtistList(props: ArtistListProps) {
    return (
        <section className={`container mx-auto ${props.className}`}>
            <div className="items-center mx-12 text-white my-8 grid md:grid-cols-3 text-xs">
                {props.artists.map((row, i) => (
                    <div key={i} className="flex justify-center">
                        {row.slug && <Link className="hover:border-white border-transparent border transition-colors duration-800 ease-in-out" href={`/artist/${row.slug}`} key={row.slug}>{row.name}</Link>}
                    </div>
                ))}
            </div>
        </section>
    )
}

ArtistList.defaultProps = {
    artists: []
}

interface ArtistListProps {
    artists: ArtistData[];
    className?: string;
}


export interface ArtistData {
    slug: string;
    name: string;
    title?: string;
    description?: string;
    works?: string;
    // Add more properties here as per CSV columns
}