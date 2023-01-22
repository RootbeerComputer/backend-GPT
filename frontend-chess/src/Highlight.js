import { useState } from "react";

function Highlight({ name }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      style={{
        height: "60px",
        width: "100%",
        backgroundColor: hover ? "#E0E0E0" : "#FBFBFB",
        borderRadius: "8px",
        cursor: "pointer",
        display: "flex",
        alignItems: "center",
        marginTop: "1vw",
      }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <p style={{ marginBlock: "0", marginLeft: "1vw", color: "#656565" }}>
        {name}
      </p>
    </div>
  );
}

export default Highlight;
