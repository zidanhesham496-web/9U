const lights = [
  { className: "background-light background-light-one" },
  { className: "background-light background-light-two" },
  { className: "background-light background-light-three" },
  { className: "background-light background-light-four" },
  { className: "background-light background-light-five" },
  { className: "background-light background-light-six" },
];

export function BackgroundEffects() {
  return (
    <div className="background-effects" aria-hidden="true">
      <div className="background-grid" />
      {lights.map((light) => (
        <span key={light.className} className={light.className} />
      ))}
    </div>
  );
}