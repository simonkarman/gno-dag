import Head from 'next/head';
import keySvg from './assets/key.svg';
import Image from 'next/image';

export default function Home() {
  return (
    <>
      <Head>
          <title>GNO Dag 2023</title>
          <meta property="og:title" content="GNO Dag 2023" key="title" />
      </Head>
      <div className="body-bg min-h-screen pt-12 md:pt-20 pb-6 px-2 md:px-0">
        <header className="max-w-lg mx-auto">
          <h1 className="text-4xl font-bold text-white text-center">GNO Dag 2023</h1>
        </header>

        <main className="bg-white max-w-4xl mx-auto p-8 md:p-12 my-10 rounded-lg shadow-2xl">
          <p className="text-center">
            Het is bijna weer zo ver! Op zaterdag 6 mei vieren we GNO Dag 2023. Kan je al raden wat het thema dit jaar gaat zijn?
          </p>
          <hr className="my-4" />
          <div className="w-36 h-36 mx-auto my-10">
            <Image src={keySvg} className="animate-spin-slow" alt="a pirate like key logo that is spinning" />
          </div>
          <hr className="my-4" />
          <p className="text-center">
            Kan je niet wachten? Kijk dan nog eens terug naar
            {' '}
            <a className="underline text-gray-600 hover:text-gray-800 visited:text-gray-600" href="https://gno-2022.karman.dev">wat we in 2022 gedaan hebben</a>.
          </p>
        </main>
      </div>
    </>
  )
}
