import Head from 'next/head';
import Image from 'next/image';
import { Container, Main, Title, Description, Grid, Card } from '../components/general';

export default function Home() {
  return (
    <Container>
      <Head>
        <title>GNO 2021</title>
        <meta name="description" content="GNO Dag 2021" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <Main>
        <Title>
          GNO Dag 2021!
        </Title>

        <Description>
          Welkom bij GNO Dag 2021!
        </Description>

        <Grid>
          <Card>
            <Image src="/flower.png" width={16} height={16} />
            <h2>A nice Title</h2>
            <p>This is some longer description</p>
          </Card>
        </Grid>
      </Main>
    </Container>
  )
}
