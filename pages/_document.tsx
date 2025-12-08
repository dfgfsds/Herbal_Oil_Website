// pages/_document.tsx
import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
    return (
        <Html lang="en">
            <Head>
                <title>Raheems Enterprises - Buy Best Products Online</title>
                <meta
                    name="description"
                    content="Get the best deals on electronics, furniture, and more at Raheems Enterprises. Free computer table with every order!"
                />
                <link rel="icon" href="/favicon.ico" />
                <script src="https://checkout.razorpay.com/v1/checkout.js"></script>
                <meta
                    name="google-site-verification"
                    content="3owA_I9wUz7cdn9qS_A1lu8n40Ni-Hs6OsymyDN8yH0"
                />

                {/* Google Tag Manager */}
                <script
                    dangerouslySetInnerHTML={{
                        __html: `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
              new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
              j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
              'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
            })(window,document,'script','dataLayer','GTM-5X5MFTL5');`,
                    }}
                />
                {/* End Google Tag Manager */}
            </Head>
            <body>
                {/* Google Tag Manager (noscript) */}
                <noscript>
                    <iframe
                        src="https://www.googletagmanager.com/ns.html?id=GTM-5X5MFTL5"
                        height="0"
                        width="0"
                        style={{ display: "none", visibility: "hidden" }}
                    />
                </noscript>
                {/* End Google Tag Manager (noscript) */}

                <Main />
                <NextScript />
            </body>
        </Html>
    );
}
