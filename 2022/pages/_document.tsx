import { Html, Head, Main, NextScript } from 'next/document';

const toGoogleFont = (fontName: string) => ({
  name: `'${fontName}'`,
  url: `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}:wght@100;200;300;400;500;600;700;800;900&display=swap`,
});

// From: https://fonts.google.com/?category=Handwriting
export const writingFont = ['Gloria Hallelujah', 'Kalam', 'Satisfy', 'Caveat', 'Pacifico', 'Indie Flower'].map(toGoogleFont)[0];
export const paragraphFont = ['Mali'].map(toGoogleFont)[0];
export default function Document() {
  return (
    <Html>
      <Head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='true' />
        <link href={writingFont.url} rel="stylesheet" />
        <link href={paragraphFont.url} rel="stylesheet" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
};
