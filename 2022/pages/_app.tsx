import 'normalize.css';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import { createGlobalStyle } from 'styled-components';

const toGoogleFont = (fontName: string) => ({
  name: `'${fontName}'`,
  url: `https://fonts.googleapis.com/css2?family=${fontName.replace(/ /g, '+')}&display=swap`,
});

// From: https://fonts.google.com/?category=Handwriting
export const writingFont = ['Gloria Hallelujah', 'Kalam', 'Satisfy', 'Caveat', 'Pacifico', 'Indie Flower'].map(toGoogleFont)[0];
export const paragraphFont = ['Roboto Slab', 'Libre Baskerville', 'Goudy Bookletter 1911', 'Pangolin'].map(toGoogleFont)[0];
const GlobalStyle = createGlobalStyle`
  a {
    text-decoration: none;
  }

  *:focus {
    outline: none;
  }

  .shadow {
    box-shadow: 0px 2px 38px rgba(0, 0, 0, 0.2);
  }

  .shadow:after, .shadow:before{
    content: '';
    position: absolute;
    left: auto;
    background:none;
    z-index: -1;
  }

  .shadow:after{
    width: 90%;
    height: 10px;
    top: 30px;
    right:8px;
    transform: rotate(-3deg);
    box-shadow: 0px -25px 35px 0px rgba(0,0,0,0.5);
  }

  .shadow:before{
    width: 10px;
    height: 95%;
    top: 5px;
    right:18px;
    transform: rotate(3deg);
    box-shadow: 22px 0px 35px 0px rgba(0,0,0,0.5);
  }

  .letter:before, .letter:after {
    content: "";
    height: 98%;
    position: absolute;
    width: 100%;
    z-index: -1;
  }
  .letter:before {
    background: #dadada;
    box-shadow: 0 0 8px rgba(0,0,0,0.2);
    left: -5px;
    top: 4px;
    transform: rotate(-0.2deg);
  }
  .letter:after {
    background: #d6d6d6;
    box-shadow: 0 0 3px rgba(0,0,0,0.2);
    right: -3px;
    top: 5px;
    transform: rotate(0.2deg);
  }
`;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>GNO Dag 2022</title>
        <meta name="description" content="GNO Dag 2022" />
        <link rel="icon" href="/favicon.ico" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin='true' />
        <link href={writingFont.url} rel="stylesheet" />
        <link href={paragraphFont.url} rel="stylesheet" />
      </Head>
      <GlobalStyle />
      <Component {...pageProps} />
    </>
  );
}
export default MyApp;
