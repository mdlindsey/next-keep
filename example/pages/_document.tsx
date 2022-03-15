import Document, { Html, Head, Main, NextScript } from 'next/document'
import packageJson from 'pkg/package.json'

class AppDocument extends Document {
  render() {
    return (
      <Html lang="en">
        <Head>
          <meta charSet="utf-8" />
          <meta name="author" content="Dan Lindsey" />
          <meta name="description" content={packageJson.description} />
          <link rel="shortcut icon" type='image/x-icon' href='/favicon.ico' />
          <link rel="stylesheet" href="/icomoon/style.css" />
          <link rel="stylesheet" href="/styles/header.css" />
          <link rel="stylesheet" href="/styles/scribbler-global.css" />
          <link rel="stylesheet" href="/styles/scribbler-landing.css" />
          <link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Nunito+Sans:300,400,600,700,800,900" />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}

// eslint-disable-next-line import/no-default-export
export default AppDocument
