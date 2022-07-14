import "./App.css";
import NftUploader from "./components/NftUploader/NftUploader";
import NFTfooter from "./components/NftUploader/Nftfooter";

function App() {
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <NftUploader></NftUploader>
        </div>
        <NFTfooter></NFTfooter>
      </div>
    </div>
  );
}

export default App;
