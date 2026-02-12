import { Mark, mergeAttributes } from "@tiptap/core";

/**
 * Marca para destacar texto en color primario (verde).
 * Se usa en el headline del testimonial/success story.
 */
export const HighlightMark = Mark.create({
  name: "highlight",

  addOptions() {
    return {
      HTMLAttributes: { class: "text-primary-strong" },
    };
  },

  parseHTML() {
    return [
      {
        tag: 'span[class*="text-primary-strong"]',
      },
      {
        tag: "span.highlight",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(this.options.HTMLAttributes, HTMLAttributes),
      0,
    ];
  },
});
