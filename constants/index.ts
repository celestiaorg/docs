// Import directly from JSON files - single source of truth
import mainnetVersionsJson from './mainnet_versions.json';
import mochaVersionsJson from './mocha_versions.json';
import arabicaVersionsJson from './arabica_versions.json';
import constantsJson from './general.json';

// Export with type assertions
export const mainnetVersions = mainnetVersionsJson as {
    "app-latest-tag": string;
    "app-latest-sha": string;
    "node-latest-tag": string;
    "node-latest-sha": string;
};

export const mochaVersions = mochaVersionsJson as {
    "app-latest-tag": string;
    "app-latest-sha": string;
    "node-latest-tag": string;
    "node-latest-sha": string;
};

export const arabicaVersions = arabicaVersionsJson as {
    "app-latest-tag": string;
    "app-latest-sha": string;
    "node-latest-tag": string;
    "node-latest-sha": string;
};

export const constants = constantsJson as {
    golangNodeMainnet: string;
    golangNodeMocha: string;
    golangNodeArabica: string;
    arabicaChainId: string;
    mainnetChainId: string;
    mochaChainId: string;
    orchrelayVersion: string;
    mochaRpcUrl: string;
    mochaRestUrl: string;
    arabicaRpcUrl: string;
    arabicaRestUrl: string;
    mainnetRpcUrl: string;
    mainnetRestUrl: string;
};
