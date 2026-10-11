import { defineField, defineType } from "sanity";

// Every photograph carries alt text, and Studio warns when it's missing.
// Image fields offer Unsplash as a stock-photo source (see sanity.config.ts).
export const imageWithAlt = defineType({
  name: "imageWithAlt",
  title: "Image",
  type: "image",
  options: { hotspot: true },
  fields: [
    defineField({
      name: "alt",
      title: "Alt text",
      description: "Describe the image for people who can't see it.",
      type: "string",
      validation: (rule) =>
        rule.warning().custom((alt, context) => {
          const parent = context.parent as { asset?: unknown } | undefined;
          return parent?.asset && !alt ? "Add alt text" : true;
        }),
    }),
  ],
});
