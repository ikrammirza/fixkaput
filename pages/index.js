import Head from "next/head";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Main from "../components/Main";

export default function Home() {
  return (
    <div>
      <Head>
        <title>fixKaput</title>
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <link rel="icon" href="/fklogo.png" />
        <link
          rel="stylesheet"
          href="https://unpkg.com/flickity@2/dist/flickity.min.css"
        ></link>
      </Head>

      <Main />
    </div>
  );
}
