# MusiQR - Turn QR Codes into Music 🎶

MusiQR is a Progressive Web Application (PWA) that is capable of scanning QR codes and generating music from it that can be played as well. All processing is done on device.

This project was developed as part of the seminar "Sonic Thinking - Methods of Working with Sound" in the winter term 2022/23 at the Hasso-Plattner-Institute.

## Prerequisites

This project requires [Node.js](https://nodejs.org/) as runtime and uses [pnpm](https://pnpm.io/) as package manager.

You can either install Node.js first by following the download links on the official website and [activating pnpm using corepack](https://pnpm.io/installation#using-corepack), or you can [install pnpm first](https://pnpm.io/installation#using-a-standalone-script) and use it as a [version manager for Node.js](https://pnpm.io/cli/env).

## Developing

The PWA is built using [SvelteKit](https://kit.svelte.dev/), which is a metaframework for [Svelte](https://svelte.dev/). Check the documentations for reference.

Once you've cloned the repository, install all dependencies with `pnpm install` (or `pnpm i`). To start a development server:

```bash
pnpm dev

# or start the server and open the app in a new browser tab
pnpm dev --open
```

## Building

To create a production version of the app:

```bash
pnpm build
```

You can preview the production build with `pnpm preview`.

## Generating Random MusiQR Codes

At the time of writing, MusiQR is not capable of handling arbitrary QR codes. Rather it is only possible to use QR codes with a certain format. Check the [wiki](https://github.com/Floriszenz/MusiQR/wiki/MusiQR-Encoding-Format) for a description of the format that is used to encode melodies into QR codes.

There is also a script available to generate random MusiQR codes. To run the script:

```bash
pnpm generate
```

This will generate a new QR code every time you run the script and will save it as an image (`code.png`) in the `scripts` directory.

## Licenses

The following section provides a list of all third-party dependencies and resources the app is using and their corresponding open-source licenses:

-   [SvelteKit](https://github.com/sveltejs/kit) and [Svelte](https://github.com/sveltejs/svelte) are used to build the application and are released under the MIT license.
-   [Tone.js](https://github.com/Tonejs/Tone.js) is used to generate the audio on device and is released under the MIT license.
-   [browser-fs-access](https://github.com/GoogleChromeLabs/browser-fs-access) is used as ponyfill for the File System Access API and is released under the Apache-2.0 license.
-   [@undecaf/barcode-detector-polyfill](https://github.com/undecaf/barcode-detector-polyfill) is used as polyfill for the Barcode Detection API and is released under the MIT license.
-   [Tailwind CSS](https://github.com/tailwindlabs/tailwindcss) is used as CSS framework for styling UI components and is released under the MIT license.
-   [TypeScript](https://github.com/microsoft/TypeScript) is used as extension to JavaScript to improve the DX by features such as type-checking and is released under the Apache-2.0 license.
-   [vite-plugin-pwa](https://github.com/vite-pwa/vite-plugin-pwa) is used in combination with [@vite-pwa/sveltekit](https://github.com/vite-pwa/sveltekit) and [workbox-window](https://github.com/GoogleChrome/workbox) to easily deploy the application as PWA. All three libraries are released under the MIT license.
-   [qrcode](https://github.com/soldair/node-qrcode) is used in a utility script to generate QR codes and to save them as images to disk. It is released under the MIT license.

All other dependencies were automatically installed as peer dependencies for the dependencies listed above and are also released under the MIT license.

The piano and acoustic guitar samples in the `src/lib/assets/instruments` directory are taken from the MIT-licensed project [tonejs-instruments](https://github.com/nbrosowsky/tonejs-instruments) and are themselves released under the [CC BY 3.0](https://creativecommons.org/licenses/by/3.0/) license.
