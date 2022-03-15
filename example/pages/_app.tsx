import Head from 'next/head'
import type { AppContext, AppProps } from 'next/app'
import { KEEP_TTL_MS } from '~/config'
import { Repo, repoFactory } from '~/services/repo'
import { Package, packageFactory } from '~/services/package'
import packageJson from 'pkg/package.json'
import keep from 'pkg/lib'

export type Project = { repo: Repo } & { package: Package } & { updated: number }

const App = ({ Component, pageProps, store }: AppProps & { store: typeof keep.store }) => {
  keep(store)
  return (
    <>
      <Head>
        <title>{packageJson.name}</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <Component {...pageProps} />
    </>
  )
}

App.getInitialProps = async ({ Component, ctx }:AppContext) => {
  await keep({
    staticVar: 'foo',
    projectDetails: async () => {
      const pkg = packageFactory(packageJson)
      const repo = await repoFactory(pkg)
      return { updated: new Date().getTime(), repo, package: pkg }
    }
  }, KEEP_TTL_MS)
  const pageProps = !Component.getInitialProps ? {} : await Component.getInitialProps(ctx)
  return { store: keep.store, pageProps }
}

// eslint-disable-next-line import/no-default-export
export default App
