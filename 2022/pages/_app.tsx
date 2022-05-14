import 'normalize.css';
import Head from 'next/head';
import type { AppProps } from 'next/app';
import styled, { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
  body {
    background-color: #f4d69e;
    font-family: Book Antiqua,Palatino,Palatino Linotype,Palatino LT STD,Georgia,serif;
  }

  a {
    text-decoration: none;
  }

  *:focus {
    outline: none;
  }

  .paper {
    position: relative;
    background: #fff;
    width: 80%;
    margin: 100px auto;
    padding: 1em;
  }

  .paper h1 {
    line-height: 3rem;
    padding: 1rem 1rem 0;
    margin-bottom: 0;
  }

  .paper p {
    margin-top: 0;
    line-height: 2rem;
    padding: 0 1rem;
    background: linear-gradient(to bottom,white 1.95rem, #ebebeb 0.05rem);
    background-size: 100% 2rem;
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
    -webkit-transform: rotate(-3deg);
    -moz-transform: rotate(-3deg);
    -o-transform: rotate(-3deg);
    -ms-transform: rotate(-3deg);
    transform: rotate(-3deg);
    -webkit-box-shadow: 0px -20px 36px 5px #295d92;
    -moz-box-shadow: 0px -20px 36px 5px #295d92;
    box-shadow: 0px -25px 35px 0px rgba(0,0,0,0.5);
  }

  .shadow:before{
    width: 10px;
    height: 95%;
    top: 5px;
    right:18px;
    -webkit-transform: rotate(3deg);
    -moz-transform: rotate(3deg);
    -o-transform: rotate(3deg);
    -ms-transform: rotate(3deg);
    transform: rotate(3deg);
    -webkit-box-shadow: 20px 0px 25px 5px #295d92;
    -moz-box-shadow: 20px 0px 25px 5px #295d92;
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
    background: #fafafa;
    box-shadow: 0 0 8px rgba(0,0,0,0.2);
    left: -5px;
    top: 4px;
    transform: rotate(-2.5deg);
  }
  .letter:after {
    background: #f6f6f6;
    box-shadow: 0 0 3px rgba(0,0,0,0.2);
    right: -3px;
    top: 1px;
    transform: rotate(1.4deg);
  }
`;

const Container = styled.div`
  /* width: 80%; */
  /* margin: auto; */
  /* padding: 1em; */
  /* background-color: #ebebeb; */
  /* border: 1em solid #9c8874; */
  /* border-radius: 0.75em; */
  /* box-shadow: 0.25em 0.25em #00000011; */
`;

function MyApp({ Component, pageProps }: AppProps) {
  return (
    <>
      <Head>
        <title>GNO Dag 2022</title>
        <meta name="description" content="GNO Dag 2022" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <GlobalStyle />
      <Container>
        <Component {...pageProps} />
      </Container>
    </>
  );
}
export default MyApp;
