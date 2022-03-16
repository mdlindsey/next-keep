import keep from 'next-keep'
import Markdown from 'markdown-to-jsx'
import { useState } from 'react'
import CopyButton from '~/components/CopyButton'
import { RELEASE_SLICE_SIZE } from '~/config'
import type { Project } from './_app'

const codeSample1 = '' +
`// pages/_app.tsx
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
}`

const codeSample2 = '' +
`// pages/home.tsx
import keep from 'next-keep'
const Page = () => {
  const { globalConfig } = keep.store
  return (
    <pre>
      { JSON.stringify(globalConfig) }
    </pre>
  )
}`


const Home = () => {
  const [ releaseCount, setReleaseCount ] = useState(RELEASE_SLICE_SIZE)
  const { projectDetails } = keep.store as { projectDetails: Project }
  const sample = {
    updated: projectDetails.updated,
    staticVar: keep.store.staticVar,
    stats: projectDetails.repo.stats
  }
  const yarnCmd = `yarn add ${projectDetails.package.name}`
  const npmCmd = `npm install --save ${projectDetails.package.name}`
  const selfLabel = projectDetails.repo.owner.type === 'user' ? 'me' : 'us'
  const ownerDisplayName = projectDetails.package.author || projectDetails.repo.owner.name

  return (
    <main>
    <nav>
      <div className="logo"></div>
      <ul className="menu">
        <div className="menu__item toggle"><span></span></div>
        <li className="menu__item">
          <a href={projectDetails.package.repo.url}>
            <span className="repo-stat"><i className="icon-fork" /><small>{projectDetails.repo.stats.forks.toLocaleString('en-US')}</small></span>
            <span className="repo-stat"><i className="icon-eye" /><small>{projectDetails.repo.stats.watchers.toLocaleString('en-US')}</small></span>
            <span className="repo-stat"><i className="icon-star" /><small>{projectDetails.repo.stats.stars.toLocaleString('en-US')}</small></span>
          </a>
        </li>
      </ul>
    </nav>
    <div className="hero">
      <h1 className="hero__title">{projectDetails.package.name}</h1>
      <p className="hero__description">{projectDetails.package.description}</p>
    </div>
    <div className="wrapper">
      <div className="installation">
        <h3 className="section__title">Installation</h3>
        <div className="tab__container">
          <ul className="tab__menu">
            <li className="tab active" data-tab="yarn">yarn</li>
            <li className="tab" data-tab="npm">npm</li>
          </ul>
          <pre className="nohighlight code">
            <code className="tab__pane active yarn">
              <CopyButton className="keybinding__label" input={yarnCmd} />
              <div>$ {yarnCmd}</div>
            </code>
            <code className="tab__pane npm">
              <CopyButton className="keybinding__label" input={npmCmd} />
              <div>$ {npmCmd}</div>
            </code>
          </pre>
        </div>
      </div>
      <hr />
      <h4>Persisted stats from GitHub <small style={{fontWeight: '400'}}>(15m TTL)</small></h4>
      <pre>{JSON.stringify(sample)}</pre>
      <h3 style={{margin: '4em 0 -1em'}}>How to persist server-side store and share with client</h3>
      <div className="keybinding">
        <ul className="keybinding__detail">
          <h3 className="keybinding__title">_app.tsx</h3>
          <pre>{ codeSample1 } </pre>
        </ul>
        <ul className="keybinding__detail">
          <h3 className="keybinding__title">home.tsx</h3>
          <pre>{codeSample2}</pre>
        </ul>
      </div>
      <div className="callout">
        <p>Want to stay up-to-date with more awesome stuff published by yours truly?</p>
        <a href={projectDetails.repo.owner.url} className="button--primary">Follow {selfLabel} on {projectDetails.package.repo.platformName}</a>
      </div>
    </div>
    {
      !projectDetails.repo.releases.length ? null : (
        <div className="changelog">
          <div className="wrapper">
            <h3 className="section__title">Changelog</h3>
            {
              projectDetails.repo.releases.slice(0, releaseCount).map(r => (
                <div key={r.tag} className="changelog__item">
                  <div className="changelog__meta">
                    <h4 className="changelog__title">{r.tag}</h4>
                    <small className="changelog__date">
                      {new Date(r.timestamp).toLocaleDateString('en-US')}
                    </small>
                  </div>
                  <div className="changelog__detail">
                    <Markdown>
                      {r.notes}
                    </Markdown>
                  </div>
                </div>
              ))
            }
            {
              projectDetails.repo.releases.length <= 3 ? null : (
                <div className="changelog__callout">
                  <button 
                    onClick={() => setReleaseCount(releaseCount + RELEASE_SLICE_SIZE)}
                    className="button--secondary">
                      Show more
                  </button>
                </div>
              )
            }
          </div>
        </div>
      )
    }
    <footer className="footer">
      Created by {' '}
      <a href={projectDetails.repo.owner.url} target="_blank" style={{color: '#fff'}}>
        {ownerDisplayName}
      </a>
    </footer>
    <script async src="/scribbler.js"></script>
    </main>
  )
}

// eslint-disable-next-line import/no-default-export
export default Home
