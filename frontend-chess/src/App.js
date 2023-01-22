import logo from "./logo.svg";
import ChessBoard from "./ChessBoard";
import Highlight from "./Highlight";

import { useState } from "react";

import "./App.css";

function App() {
  const [computerTurn, setComputerTurn] = useState(false);

  return (
    <>
      <div style={{ display: "flex" }}>
        <div
          style={{
            width: "20vw",
            height: "100vh",
            backgroundColor: "#FBFBFB",
            borderRight: "1px solid #E5E5E5",
            padding: "0vh 1vw",
          }}
        >
          <Highlight name="Play" />
          <Highlight name="Analyze" />
        </div>
        <div
          style={{
            width: "80vw",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              boxShadow:
                "0px 0px 20px -5px rgba(0, 0, 0, 0.2), 0px 0px 25px -5px rgba(0, 0, 0, 0.1)",
            }}
          >
            <ChessBoard setComputerTurn={setComputerTurn} />
          </div>
          <div style={{ marginLeft: "3vw" }}>
            {computerTurn
              ? "LLMagnus Carlsen is thinking..."
              : "It's your move to play!"}
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
