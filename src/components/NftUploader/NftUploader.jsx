// NftUploader.jsx
import { Web3Storage } from "web3.storage";
import Web3Mint from "../../utils/Web3Mint.json";
import { ethers } from "ethers";
import { Button } from "@mui/material";
import React from "react";
import { useEffect, useState } from "react";
import ImageLogo from "./image.svg";
import "./NftUploader.css";

const CONTRACT_ADDRESS = "0xE7a41898519CFf714c04717c29A253D91523c33B";

const NftUploader = () => {
  /*
   * ユーザーのウォレットアドレスを格納するために使用する状態変数を定義します。
   */
  const [currentAccount, setCurrentAccount] = useState("");
  const [minting, setMinting] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [mintCount, setMintCount] = useState(0);

  const API_KEY =
    "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiJkaWQ6ZXRocjoweDM1RkI0Mjc1Y2U0NjAwMmRBMDY0MTg1M0E1MDg1NTZhNEM1Njc4NjUiLCJpc3MiOiJ3ZWIzLXN0b3JhZ2UiLCJpYXQiOjE2NTc3MDUwMzk0MTQsIm5hbWUiOiJORlRfbWFya2V0In0.47Gzkg8_UAiAwQkc4LjYiBxHWh9yXp6zjIudOJ4Aqv0";
  /*この段階でcurrentAccountの中身は空*/
  console.log("currentAccount: ", currentAccount);

  // setupEventListener 関数を定義します。
  // Web3Mint.sol の中で event が　emit された時に、
  // 情報を受け取ります。
  const setupEventListener = async () => {
    try {
      const { ethereum } = window;

      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          Web3Mint.abi,
          signer
        );

        // Event が　emit される際に、コントラクトから送信される情報を受け取っています。
        connectedContract.on("NewEpicNFTMinted", (from, tokenId, maxId) => {
          console.log(from, tokenId.toNumber(), maxId.toNumber());
          alert(
            `あなたのウォレットに 限定${maxId.toNumber()}個の NFT を送信しました。OpenSea に表示されるまで最大で10分かかることがあります。NFT へのリンクはこちらです: https://testnets.opensea.io/assets/${CONTRACT_ADDRESS}/${tokenId.toNumber()}`
          );
        });

        console.log("Setup event listener!");
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const setupMintCount = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        // NFT が発行されます。
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          Web3Mint.abi,
          signer
        );
        const number = await connectedContract.getTotalMintCount();
        console.log(number);
        setMintCount(number.toNumber());
        console.log("Setup mint count");
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  // ユーザーのネットワークのチェック実装
  const checkChainId = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        let chainId = await ethereum.request({ method: "eth_chainId" });
        const goerliChainId = "0x5";
        if (chainId !== goerliChainId) {
          alert("You are not connected to the goerli Test Network");
        } else {
          console.log("connected to chain" + goerliChainId);
        }
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have MetaMask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }

    const accounts = await ethereum.request({ method: "eth_accounts" });

    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
    setupMintCount();
    checkChainId();
    setupEventListener();
  };

  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      /*
       * ウォレットアドレスに対してアクセスをリクエストしています。
       */
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      console.log("Connected", accounts[0]);
      /*
       * ウォレットアドレスを currentAccount に紐付けます。
       */
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
    setupMintCount();
    checkChainId();
    setupEventListener();
  };

  // NftUploader.jsx
  const askContractToMintNft = async (ipfs) => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        setMinting(true);

        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          Web3Mint.abi,
          signer
        );
        console.log("Going to pop wallet now to pay gas...");
        let nftTxn = await connectedContract.mintIpfsNFT("sample", ipfs);
        console.log("Mining...please wait.");
        await nftTxn.wait();
        console.log(
          `Mined, see transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`
        );
        setMinting(false);
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };

  const imageToNFT = async (e) => {
    setUploading(true);
    const client = new Web3Storage({ token: API_KEY });
    const image = e.target;
    console.log(image);

    const rootCid = await client.put(image.files, {
      name: "experiment",
      maxRetries: 3,
    });
    const res = await client.get(rootCid); // Web3Response
    const files = await res.files(); // Web3File[]
    setUploading(false);
    for (const file of files) {
      console.log("file.cid:", file.cid);
      askContractToMintNft(file.cid);
    }
  };

  const renderNotConnectedContainer = () => (
    <button
      onClick={connectWallet}
      className="cta-button connect-wallet-button"
    >
      Connect to Wallet
    </button>
  );
  /*
   * ページがロードされたときに useEffect()内の関数が呼び出されます。
   */
  useEffect(() => {
    checkIfWalletIsConnected();
  }, []);

  return (
    <div className="outerBox">
      {currentAccount === "" ? (
        renderNotConnectedContainer()
      ) : (
        <p>If you choose image, you can mint your NFT</p>
      )}
      {uploading && !minting && (
        <p className="communicate-text">
          uploading... <br /> しばらくお待ち下さい。
        </p>
      )}
      {!uploading && minting && (
        <p className="communicate-text">
          minting... <br /> しばらくお待ち下さい。
        </p>
      )}
      {!uploading && !minting && (
        <p className="communicate-text">
          これまでに発行された 🌟 の数 {mintCount + 1}/30
        </p>
      )}
      <div className="title">
        <h2>NFTアップローダー</h2>
      </div>
      <div className="nftUplodeBox">
        <div className="imageLogoAndText">
          <img src={ImageLogo} alt="imagelogo" />
          <p>ここにドラッグ＆ドロップしてね</p>
        </div>
        <input
          className="imageUploadInput"
          multiple
          name="imageURL"
          type="file"
          accept=".jpg , .jpeg , .png"
          onChange={imageToNFT}
        />
      </div>
      <p>または</p>
      <Button variant="contained">
        ファイルを選択
        <input
          className="imageUploadInput"
          type="file"
          accept=".jpg , .jpeg , .png"
          onChange={imageToNFT}
        />
      </Button>
    </div>
    
  );
};

export default NftUploader;
