// generate-sw.js
import { generateSW } from 'workbox-build';

const config = {
  globDirectory: 'dist/',
  globPatterns: [
    '**/*.{ico,json,png,html,js,css,webmanifest,pdf,svg,woff,woff2,ttf}',
  ],
  ignoreURLParametersMatching: [/^utm_/, /^fbclid$/, /^v$/],
  swDest: 'dist/service-worker.js',
  maximumFileSizeToCacheInBytes: 12582912,
  sourcemap: false,
};

generateSW(config)
  .then(({ count, size }) => {
    console.log(
      `Generated service worker, caching ${count} files, ${size} bytes.`
    );
  })
  .catch(console.error);
