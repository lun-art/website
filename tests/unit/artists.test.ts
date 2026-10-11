import { describe, expect, it } from "vitest";
import { artistFromRow, asUrl, parseCsv } from "../../scripts/lib/artists.mjs";

describe("parseCsv", () => {
  it("handles quotes, escaped quotes and newlines in fields", () => {
    expect(
      parseCsv('slug,name,works\r\na,"A, B","say ""hi""\nthere"\n\n'),
    ).toEqual([{ slug: "a", name: "A, B", works: 'say "hi"\nthere' }]);
  });
});

describe("asUrl", () => {
  it("adds a scheme to a bare domain and rejects prose", () => {
    expect(asUrl(" www.example.com ")).toBe("https://www.example.com");
    expect(asUrl("http://cargocollective.com/x/")).toBe(
      "http://cargocollective.com/x/",
    );
    expect(asUrl("We love the moon.")).toBeUndefined();
  });
});

describe("artistFromRow", () => {
  const row = {
    slug: "a-b",
    name: " A B ",
    title: "",
    description: "",
    works: "",
  };

  it("keeps a name-only artist minimal", () => {
    expect(artistFromRow(row)).toEqual({
      _id: "artist-a-b",
      _type: "artist",
      name: "A B",
      slug: { _type: "slug", current: "a-b" },
    });
  });

  it("reads the statement from description", () => {
    expect(
      artistFromRow({ ...row, title: "Work", description: "\nWords. " }),
    ).toMatchObject({ workTitle: "Work", statement: "Words." });
  });

  it("moves a website in description out, and takes the statement from works", () => {
    expect(
      artistFromRow({
        ...row,
        description: "haoni.art",
        works: "Statement, with commas; and semicolons",
      }),
    ).toMatchObject({
      website: "https://haoni.art",
      statement: "Statement, with commas; and semicolons",
    });
  });
});
