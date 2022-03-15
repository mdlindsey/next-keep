# Next Keep

Persisted memory store with server/client parity for non-critical data

## Using in your own code

Sharing memory storage between server and client requires setting the values on both the server and client. This can be achieved in `pages/_app.tsx` as demonstrated below:

```ts
// pages/_app.tsx
import keep from 'next-keep'
const App = ({ pageProps, store }) => {
  keep(store)
  return <Component {...pageProps} />
}
App.getInitialProps = async ({ Component }) => {
  await keep({
    staticVar: 'foo',
    globalConfig: async () => loadConfigFromAPI()
  }, 15 * 60 * 1000) // reload after 15 min
  const pageProps = !Component.getInitialProps
    ? {} : await Component.getInitialProps(ctx)
  return { pageProps, store: keep.store }
}
```

Once the values are set on both client and server, you can reference them indiscriminately throughout your app.

```ts
// pages/home.tsx
import keep from 'next-keep'
const Page = () => {
  const { globalConfig } = keep.store
  return (
    <pre>
      { JSON.stringify(globalConfig) }
    </pre>
  )
}
```
