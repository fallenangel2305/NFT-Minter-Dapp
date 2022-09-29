"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const web3_js_1 = require("@solana/web3.js");
const tape_1 = __importDefault(require("tape"));
const index_1 = require("../../src/index");
const assertCluster = (t, endpoint, expected) => {
    t.equal((0, index_1.resolveClusterFromEndpoint)(endpoint), expected);
};
(0, tape_1.default)('[Cluster] it can be resolved from the connection', (t) => __awaiter(void 0, void 0, void 0, function* () {
    // It can resolve the mainnet cluster.
    assertCluster(t, (0, web3_js_1.clusterApiUrl)('mainnet-beta'), 'mainnet-beta');
    assertCluster(t, 'https://api.mainnet-beta.solana.com', 'mainnet-beta');
    assertCluster(t, 'https://api.mainnet-beta.solana.com/', 'mainnet-beta');
    assertCluster(t, 'https://api.mainnet-beta.solana.com?foo=bar', 'mainnet-beta');
    assertCluster(t, 'http://api.mainnet-beta.solana.com', 'mainnet-beta');
    assertCluster(t, 'http://api.mainnet-beta.solana.com/', 'mainnet-beta');
    assertCluster(t, 'https://ssc-dao.genesysgo.net', 'mainnet-beta');
    assertCluster(t, 'http://mainnet.solana.com/', 'custom');
    // It can resolve the devnet cluster.
    assertCluster(t, (0, web3_js_1.clusterApiUrl)('devnet'), 'devnet');
    assertCluster(t, 'https://api.devnet.solana.com', 'devnet');
    assertCluster(t, 'https://api.devnet.solana.com/', 'devnet');
    assertCluster(t, 'https://api.devnet.solana.com?foo=bar', 'devnet');
    assertCluster(t, 'http://api.devnet.solana.com', 'devnet');
    assertCluster(t, 'http://api.devnet.solana.com/', 'devnet');
    assertCluster(t, 'https://psytrbhymqlkfrhudd.dev.genesysgo.net:8899', 'devnet');
    assertCluster(t, 'http://devnet.solana.com/', 'custom');
    // It can resolve the testnet cluster.
    assertCluster(t, (0, web3_js_1.clusterApiUrl)('testnet'), 'testnet');
    assertCluster(t, 'https://api.testnet.solana.com', 'testnet');
    assertCluster(t, 'https://api.testnet.solana.com/', 'testnet');
    assertCluster(t, 'https://api.testnet.solana.com?foo=bar', 'testnet');
    assertCluster(t, 'http://api.testnet.solana.com', 'testnet');
    assertCluster(t, 'http://api.testnet.solana.com/', 'testnet');
    assertCluster(t, 'http://testnet.solana.com/', 'custom');
    // It can resolve local clusters.
    assertCluster(t, 'http://localhost', 'localnet');
    assertCluster(t, 'http://localhost:8899', 'localnet');
    assertCluster(t, 'https://localhost:8899', 'localnet');
    assertCluster(t, 'https://localhost:8899/', 'localnet');
    assertCluster(t, 'https://localhost:8899?foo=bar', 'localnet');
    assertCluster(t, 'https://localhost:1234?foo=bar', 'localnet');
    assertCluster(t, 'http://127.0.0.1', 'localnet');
    assertCluster(t, 'http://127.0.0.1:8899', 'localnet');
    assertCluster(t, 'https://127.0.0.1:8899', 'localnet');
    assertCluster(t, 'https://127.0.0.1:8899/', 'localnet');
    assertCluster(t, 'https://127.0.0.1:8899?foo=bar', 'localnet');
    assertCluster(t, 'https://127.0.0.1:1234?foo=bar', 'localnet');
    assertCluster(t, 'https://123.45.67.89', 'custom');
}));
//# sourceMappingURL=Cluster.test.js.map