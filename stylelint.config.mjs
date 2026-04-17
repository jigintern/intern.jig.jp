/** @type {import('stylelint').Config} */
export default {
  extends: ["stylelint-config-standard", "stylelint-config-recess-order"],
  overrides: [
    {
      files: ["**/*.astro"],
      customSyntax: "postcss-html",
      rules: {
        "selector-pseudo-class-no-unknown": [
          true,
          {
            ignorePseudoClasses: ["global"],
          },
        ],
        "selector-class-pattern":
          "^([a-z][a-z0-9]*)(-[a-z0-9]+)*(__[a-z0-9]+(-[a-z0-9]+)*)?(_[a-z0-9]+(-[a-z0-9]+)*)?$",
      },
    },
  ],
};
