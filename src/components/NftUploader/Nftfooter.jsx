// NftUploader.jsx
import { Button } from "@mui/material";
import React from "react";
import { useEffect, useState } from "react";
import ImageLogo from "./image.svg";
import "./NftUploader.css";
const TWITTER_HANDLE = "atkhm";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;

const NFTfooter = () => {

  return (
    <div>
      <div className="footer-container">
        <a
          className="footer-text"
          href={TWITTER_LINK}
          target="_blank"
          rel="noreferrer"
        >{`built on @${TWITTER_HANDLE}`}</a>
      </div>
      <a
        className="cta-button-opensea connect-wallet-button"
        href="https://testnets.opensea.io/collection/squarenft-6sa4oezqeu"
      >   Check NFT at Opensea
      </a>
    </div>
  );
};

export default NFTfooter;
