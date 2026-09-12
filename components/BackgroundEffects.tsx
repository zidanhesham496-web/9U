const lights = [
  { className: "background-light background-light-one" },
  { className: "background-light background-light-two" },
  { className: "background-light background-light-three" },
  { className: "background-light background-light-four" },
  { className: "background-light background-light-five" },
  { className: "background-light background-light-six" },
];

const particles = [
  "background-particle background-particle-one",
  "background-particle background-particle-two",
  "background-particle background-particle-three",
  "background-particle background-particle-four",
  "background-particle background-particle-five",
];

export function BackgroundEffects() {
  return (
    <div className="background-effects" aria-hidden="true">
      <div className="background-grid" />
      {lights.map((light) => (
        <span key={light.className} className={light.className} />
      ))}
      {particles.map((particle) => (
        <span key={particle} className={particle} />
      ))}
    </div>
  );
}