
import { Html, Head, Main, NextScript } from 'next/document';

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="true" />
                <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@700&display=swap" rel="stylesheet" />
                <meta name="description" content="BOTTEIN - Personalized Meal Replacement Solution for Young Professionals" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <body>
            <Main />
            <NextScript />
            </body>
        </Html>
    );
}