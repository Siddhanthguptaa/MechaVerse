const Minimap = ({ playerPosition, remotePlayers = {} }) => {
  const size = 150;
  const scale = 0.1;

  const mapX = playerPosition[0] * scale;
  const mapY = playerPosition[2] * scale;

  return (
    <div style={{
      position: "absolute",
      bottom: 20,
      right: 20,
      width: size,
      height: size,
      background: "#111",
      border: "2px solid white",
      overflow: "hidden"
    }}>
      
      {/* 🟥 Your player */}
      <div style={{
        position: "absolute",
        left: size / 2 + mapX,
        top: size / 2 + mapY,
        width: 8,
        height: 8,
        background: "red",
        borderRadius: "50%"
      }} />

      {/* 🟦 Other players */}
      {Object.values(remotePlayers).map(p => (
        <div
          key={p.id}
          style={{
            position: "absolute",
            left: size / 2 + p.position[0] * scale,
            top: size / 2 + p.position[2] * scale,
            width: 6,
            height: 6,
            background: "blue",
            borderRadius: "50%"
          }}
        />
      ))}
    </div>
  );
};

export default Minimap;