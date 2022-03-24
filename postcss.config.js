// module.exports = {
//   plugins: {
//     tailwindcss: {},
//     autoprefixer: {},
//     ...(process.env.NODE_ENV === "production"
//       ? {
//           "@fullhuman/postcss-purgecss": {
//             content: [
//               "./src/components/**/*.js",
//               "./src/pages/**/*.js",
//               "./public/**/*.*",
//             ],
//             defaultExtractor: (content) =>
//               content.match(/[\w-/:]+(?<!:)/g) || [],
//           },
//         }
//       : {}),
//   },
// };
module.exports = {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
};
