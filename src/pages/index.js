import React from 'react';
import clsx from 'clsx';
import Layout from '@theme/Layout';
import Link from '@docusaurus/Link';
import useDocusaurusContext from '@docusaurus/useDocusaurusContext';
import styles from './index.module.css';
import HomepageFeatures from '@site/src/components/HomepageFeatures';

function HomepageHeader() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <header className={clsx('hero hero--primary', styles.heroBanner)}>
      <div className="container">
        <h1 className="hero__title">{siteConfig.title}</h1>
        <div className={styles.buttons}>
          <Link
            className="front-page-link"
            to="/concepts/how-celestia-works/introduction">
              <p className="button-heading">Concepts</p>
              Learn how Celestia works
          </Link>
          <Link
            className="front-page-link"
            to="/developers/node-tutorial">
              <p className="button-heading">Celestia node</p>
              Run a node
          </Link>
          <Link
            className="front-page-link"
            to="/developers/rollkit">
               <p className="button-heading">Sovereign chain</p>
              Deploy a rollup to Celestia
          </Link>
        </div>
      </div>
    </header>
  );
}

export default function Home() {
  const {siteConfig} = useDocusaurusContext();
  return (
    <Layout
      title={`${siteConfig.title}`}
      description="Documentation Site for Celestia Network">
      <HomepageHeader />
      <main>
        <HomepageFeatures />
      </main>
    </Layout>
  );
}
