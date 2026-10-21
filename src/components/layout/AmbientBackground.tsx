export function AmbientBackground() {
  return (
    <div className="ambient-background" aria-hidden>
      <div className="ambient-background__gradient" />
      <div className="ambient-background__spotlight ambient-background__spotlight--left" />
      <div className="ambient-background__spotlight ambient-background__spotlight--right" />
      <div className="ambient-background__particles" />
    </div>
  );
}
