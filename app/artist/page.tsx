import Papa from 'papaparse'
import NavBar from "../NavBar";
import BinaryHR from '../BinaryHR';
import ArtistList, { ArtistData } from '../ArtistList'


export default async function Page() {
    const response = await fetch('https://docs.google.com/spreadsheets/d/e/2PACX-1vSxtJtC0h6tJQxMd35cSpWTCOnhFITwadMAC_0O_5EsdqxmXVYApIY3VHoePh3ZpZf6Nqaqo_4qRwsL/pub?gid=0&single=true&output=csv');
    const csvData = await response.text();
    const parsedData = Papa.parse<ArtistData>(csvData, { header: true });
    const data: ArtistData[] = parsedData.data

    return (
        <>
            <NavBar className="relative" />

            <BinaryHR />

            <ArtistList artists={data} />

            <BinaryHR />
        </>
    );
};