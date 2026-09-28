import "./platform.css";
export default function PlatformFrame({
  title,
  kicker,
  children,
}: {
  title: string;
  kicker: string;
  children: React.ReactNode;
}) {
  return (
    <main id="main-content" tabIndex={-1} className="platform">
      <p className="p-kicker">héReSonare / {kicker}</p>
      <h1>{title}</h1>
      {children}
    </main>
  );
}
