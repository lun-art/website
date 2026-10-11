// Turns the old Google Sheet export (sanity/seed/artists.csv) into Sanity
// artist documents. The sheet's columns were filled in inconsistently: for
// some artists the website sits in "description" and the statement in
// "works". The sheet never held image links, so no images come across.

/** Parse RFC 4180 CSV (quoted fields, "" escapes, newlines in quotes) into row objects. */
export function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let quoted = false;
  for (let i = 0; i < text.length; i++) {
    const c = text[i];
    if (quoted) {
      if (c === '"' && text[i + 1] === '"') {
        field += '"';
        i++;
      } else if (c === '"') quoted = false;
      else field += c;
    } else if (c === '"') quoted = true;
    else if (c === ",") {
      row.push(field);
      field = "";
    } else if (c === "\n" || c === "\r") {
      if (c === "\r" && text[i + 1] === "\n") i++;
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else field += c;
  }
  if (field || row.length) rows.push([...row, field]);
  const [header, ...body] = rows;
  return body
    .filter((cells) => cells.some((cell) => cell.trim()))
    .map((cells) =>
      Object.fromEntries(header.map((name, i) => [name, cells[i] ?? ""])),
    );
}

const URL_LIKE = /^(https?:\/\/)?[\w-]+(\.[\w-]+)+(\/\S*)?$/i;

/** A bare domain or URL, with a scheme so Sanity's url field accepts it. */
export function asUrl(value) {
  const text = value.trim();
  if (!URL_LIKE.test(text)) return undefined;
  return /^https?:\/\//i.test(text) ? text : `https://${text}`;
}

/** One sheet row to an artist document, without empty fields. */
export function artistFromRow(row) {
  const website = asUrl(row.description ?? "");
  const statement = (website ? row.works : row.description)?.trim();
  const workTitle = row.title?.trim();
  return {
    _id: `artist-${row.slug}`,
    _type: "artist",
    name: row.name.trim(),
    slug: { _type: "slug", current: row.slug.trim() },
    ...(workTitle && { workTitle }),
    ...(website && { website }),
    ...(statement && { statement }),
  };
}
