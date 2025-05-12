"use client";

export default function Page() {
  const handleClick = () => {
    console.log("hello world");
  };

  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <button
        onClick={handleClick}
        style={{ fontSize: "1.5rem", padding: "1rem 2rem" }}
      >
        Print Hello Worldsss
      </button>
    </div>
  );
}
