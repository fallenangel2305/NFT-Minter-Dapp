import {
  WalletDisconnectButton,
  WalletMultiButton,
} from "@solana/wallet-adapter-react-ui";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import {
  Keypair,
  SystemProgram,
  Transaction,
  Connection,
  clusterApiUrl,
  PublicKey,
} from "@solana/web3.js";
import {
  Metaplex,
  useMetaplexFileFromBrowser,
  walletAdapterIdentity,
} from "@metaplex-foundation/js";
import type { NextPage } from "next";
import Head from "next/head";
import Image from "next/image";
import styles from "../styles/Home.module.css";
import { useState } from "react";
import { bundlrStorage } from "@metaplex-foundation/js";
import { create } from "ipfs-http-client";
import { Button, Form, Input, InputNumber, Space } from "antd";
import {
  MinusCircleOutlined,
  PlusOutlined,
  InboxOutlined,
  UploadOutlined,
} from "@ant-design/icons";
import Upload from "antd/lib/upload/Upload";
import { WalletNotConnectedError } from "@solana/wallet-adapter-base";
import { getOverflowOptions } from "antd/lib/_util/placements";

const layout = {
  labelCol: {
    span: 6,
  },
  wrapperCol: {
    span: 16,
  },
};
/* eslint-disable no-template-curly-in-string */

const validateMessages = {
  required: "${label} is required!",
  types: {
    email: "${label} is not a valid email!",
    number: "${label} is not a valid number!",
  },
  number: {
    range: "${label} must be between ${min} and ${max}",
  },
};
/* eslint-enable no-template-curly-in-string */

const Home: NextPage = () => {
  const connection = new Connection(clusterApiUrl("devnet"));
  const { publicKey, connected } = useWallet();
  const wallet = useWallet();
  const [mintAddress, setMintAddress] = useState("");
  const [url, setUrl] = useState("");
  const [uploadFile, setUploadFile] = useState();
  var metaData = {
    name: "",
    symbol: "",
    description: "",
    seller_fee_basis_points: 0,
    // image: "" ,
    attributes: [],
    properties: {
      creators: [],
    },
  };
  const [fileUrl, updateFileUrl] = useState(``);

  const metaplex = Metaplex.make(connection);
  if (connected && wallet) {
    // wallet.adapter.connect;
    metaplex.use(walletAdapterIdentity(wallet)).use(
      bundlrStorage({
        address: "https://devnet.bundlr.network",
        providerUrl: "https://api.devnet.solana.com",
        timeout: 60000,
      })
    );
  }
  const ipfs = create({
    host: "ipfs.infura.io",
    port: 5001,
    protocol: "https",
    headers: {
      "Access-Control-Allow-Credentials": "true",
    },
  });

  const onFinish = async (values: any) => {
    // console.log(values.user);
    try {
      if (!publicKey) throw new WalletNotConnectedError();
    } catch (err) {
      alert(err);
    }
    metaData["name"] = values.user.name;
    metaData["symbol"] = values.user.symbol;
    // metaData["image"] = fileUrl;

    metaData["description"] = values.user.description;
    metaData["seller_fee_basis_points"] = values.user.royaltySplit * 100;
    metaData["attributes"] = values.user.attributes;
    metaData["properties"].creators = values.user.royalties;
    console.log(metaData, "metadata");
    console.log(uploadFile, "upload value");
    try {
      var updatedMetaData = {
        ...metaData,
        // eslint-disable-next-line react-hooks/rules-of-hooks
        image: await useMetaplexFileFromBrowser(uploadFile),
      };
      console.log(updatedMetaData, "updated metadata");
      const { uri, metadata } = await metaplex
        .nfts()
        .uploadMetadata(updatedMetaData);
      console.log(uri, "metadata uri");
      const { nft } = await metaplex.nfts().create({
        uri: uri,
        isMutable: true,
      });
      setMintAddress(nft.mint.toString());
      alert("Nft minted sucessfully");
      setUrl(
        // "https://solscan.io/token/" + nft.mint.toString() + "?cluster=devnet"
        "https://solana.fm/address/" + nft.mint.toString() + "?cluster=devnet"
      );
      // window.open(
      //   "https://solscan.io/token/" + nft.mint.toString() + "?cluster=devnet",
      //   "_blank"
      // );
      console.log(mintAddress, "nft mint");
    } catch (error) {
      alert(error);
    }
  };
  const normFile = (e: { fileList: any }) => {
    console.log("Upload event:", e);

    if (Array.isArray(e)) {
      return e;
    }

    return e?.fileList;
  };
  async function onChange(e) {
    let file = e.target.files[0];
    setUploadFile(file);
    console.log(file, "file data");

    if (file.size > 2000000) {
      alert("Image too big max is 2mb");
    } else {
      console.log("upload file", file);
      try {
        const added = await ipfs.add(file);

        console.log("upload file path", added);
        const url = `https://ipfs.infura.io/ipfs/${added.path}`;
        updateFileUrl(url);
      } catch (error) {
        console.log("Error uploading file: ", error);
      }
    }
  }
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <meta name="description" content="Generated by create next app" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.walletButtons}>
        <div style={{ margin: "10px" }}>
          <WalletMultiButton />
        </div>
      </div>
      <main className={styles.main}>
        <h1 className={styles.title}>Welcome </h1>
        <h2>{publicKey?.toString()}</h2>

        <p className={styles.description}>
          {/* Get started by editing{" "}
          <code className={styles.code}>pages/index.tsx</code> */}
        </p>

        <div className={styles.grid}>
          <div className={styles.card}>
            <div>{fileUrl && <img src={fileUrl} width="500" />}</div>
            <Form
              {...layout}
              name="nest-messages"
              onFinish={onFinish}
              validateMessages={validateMessages}
            >
              <Form.Item
                name={["user", "upload"]}
                label="Upload"
                valuePropName="fileList"
                getValueFromEvent={normFile}
                extra="upload image for nft"
              >
                <input type="file" onChange={onChange} />
              </Form.Item>

              <Form.Item
                name={["user", "name"]}
                label="NFT Name"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={["user", "symbol"]}
                label="NFT Symbol"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.Item
                name={["user", "description"]}
                label="NFT Description"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input.TextArea />
              </Form.Item>
              <Form.Item name="attributes" label="Attributes"></Form.Item>
              <Form.List name={["user", "attributes"]}>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Space
                        key={key}
                        style={{
                          display: "flex",
                          marginBottom: 4,
                        }}
                        align="baseline"
                      >
                        <Form.Item
                          {...restField}
                          name={[name, "trait_type"]}
                          rules={[
                            {
                              required: true,
                              message: "Enter trait",
                            },
                          ]}
                        >
                          <Input placeholder="trait" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "value"]}
                          rules={[
                            {
                              required: true,
                              message: "Enter trait value",
                            },
                          ]}
                        >
                          <Input placeholder="value" />
                        </Form.Item>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Space>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add field
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
              <Form.Item
                name={["user", "royaltySplit"]}
                label="Royalties(%)"
                rules={[
                  {
                    required: true,
                  },
                ]}
              >
                <Input />
              </Form.Item>
              <Form.List name={["user", "royalties"]}>
                {(fields, { add, remove }) => (
                  <>
                    {fields.map(({ key, name, ...restField }) => (
                      <Space
                        key={key}
                        style={{
                          display: "flex",
                          marginBottom: 4,
                        }}
                        align="baseline"
                      >
                        <Form.Item
                          {...restField}
                          name={[name, "address"]}
                          rules={[
                            {
                              required: true,
                              message: "Enter creator publicKey",
                            },
                          ]}
                        >
                          <Input placeholder="Creator PublicKey" />
                        </Form.Item>
                        <Form.Item
                          {...restField}
                          name={[name, "share"]}
                          rules={[
                            {
                              required: true,
                              message: "Enter royality percentage",
                            },
                          ]}
                        >
                          <Input placeholder="Royality Percentage" />
                        </Form.Item>
                        <MinusCircleOutlined onClick={() => remove(name)} />
                      </Space>
                    ))}
                    <Form.Item>
                      <Button
                        type="dashed"
                        onClick={() => add()}
                        block
                        icon={<PlusOutlined />}
                      >
                        Add field
                      </Button>
                    </Form.Item>
                  </>
                )}
              </Form.List>
              <Form.Item wrapperCol={{ ...layout.wrapperCol, offset: 8 }}>
                <Button type="primary" htmlType="submit">
                  Mint
                </Button>
              </Form.Item>
            </Form>
          </div>

          {!!mintAddress ? (
            // <h3>
            //   <a href={url} target="_blank" rel="noreferrer">
            //     view in solscan
            //   </a>
            // </h3>
            <div className={styles.card}>
              <iframe
                src={url}
                height="1170"
                width="600"
                title="Iframe Example"
              ></iframe>
            </div>
          ) : (
            ""
          )}
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://vercel.com?utm_source=create-next-app&utm_medium=default-template&utm_campaign=create-next-app"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{" "}
          <span className={styles.logo}>
            <Image src="/vercel.svg" alt="mvp-apps" width={72} height={16} />
          </span>
        </a>
      </footer>
    </div>
  );
};

export default Home;
