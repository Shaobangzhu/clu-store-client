function withBanner(WrapperComponent, text) {
  return ({ soldOut, ...props }) => {
    if (!soldOut) {
      return <WrapperComponent {...props} soldOut={soldOut} />;
    }
    return (
      <div style={{ position: "relative", display: "inline-block" }}>
        <WrapperComponent {...props} soldOut={soldOut} />
        <div
          style={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%) rotate(-15deg)",
            fontSize: "2.5rem",
            fontWeight: 900,
            fontStyle: "italic",
            textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
            color: "red",
          }}
        >
          {text}
        </div>
      </div>
    );
  };
}

export default withBanner;
