import React from 'react';
import clsx from 'clsx';
import Translate from '@docusaurus/Translate';
import styles from './styles.module.css';

const FeatureList = [
  {
    title: <Translate>Build Modular</Translate>,
    Svg: require('@site/static/img/modular.svg').default,
    description: (
      <>
        <Translate>Celestia is the First Modular Blockchain network which enables developers to deploy 
        their own blockchain as easy as deploying a new smart contract.</Translate>
      </>
    ),
  },
  {
    title: <Translate>Run Different Nodes</Translate>,
    Svg: require('@site/static/img/run_node.svg').default,
    description: (
      <>
        <Translate>Celestia allows you to run a validator node, a bridge node or a light client
        to be able to support the network.</Translate>
      </>
    ),
  },
  {
    title: <Translate>Power-up with Data Availability Layer</Translate>,
    Svg: require('@site/static/img/data_availability.svg').default,
    description: (
      <>
        <Translate>Celestia introduces what is called the Data Availability Layer for enabling 
        efficient scaling and allowing L2 Rollups to do data sampling for transactions they need.</Translate>
      </>
    ),
  },
];

function Feature({Svg, title, description}) {
  return (
    <div className={clsx('col col--4')}>
      <div className="text--center">
        <Svg className={styles.featureSvg} role="img" />
      </div>
      <div className="text--center padding-horiz--md">
        <h3>{title}</h3>
        <p>{description}</p>
      </div>
    </div>
  );
}

export default function HomepageFeatures() {
  return (
    <section className={styles.features}>
      <div className="container">
        <div className="row">
          {FeatureList.map((props, idx) => (
            <Feature key={idx} {...props} />
          ))}
        </div>
      </div>
    </section>
  );
}
