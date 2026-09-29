import { Fragment, type ReactNode } from "react";
function inline(text: string) {
  return text
    .split(/(\*\*[^*\n]+\*\*)/gu)
    .map((part, index) =>
      part.startsWith("**") && part.endsWith("**") ? (
        <strong key={index}>{part.slice(2, -2)}</strong>
      ) : (
        <Fragment key={index}>{part}</Fragment>
      ),
    );
}
export default function RichText({ text }: { text: string }) {
  const blocks: ReactNode[] = [];
  const lines = text.replaceAll("\r", "").split("\n");
  for (let i = 0; i < lines.length; ) {
    if (!lines[i].trim()) {
      i++;
      continue;
    }
    const key = i;
    if (/^#{2,3} /u.test(lines[i])) {
      const Heading = lines[i].startsWith("### ") ? "h3" : "h2";
      blocks.push(
        <Heading key={key}>
          {inline(lines[i++].replace(/^#{2,3} /u, ""))}
        </Heading>,
      );
      continue;
    }
    if (lines[i].startsWith("- ")) {
      const items = [];
      while (i < lines.length && lines[i].startsWith("- "))
        items.push(<li key={i}>{inline(lines[i++].slice(2))}</li>);
      blocks.push(
        <ul key={key} style={{ listStyle: "disc", paddingLeft: 24 }}>
          {items}
        </ul>,
      );
      continue;
    }
    const paragraph = [];
    while (
      i < lines.length &&
      lines[i].trim() &&
      !/^#{2,3} |^- /u.test(lines[i])
    )
      paragraph.push(lines[i++]);
    blocks.push(
      <p className="p-body" key={key}>
        {inline(paragraph.join("\n"))}
      </p>,
    );
  }
  return <div>{blocks}</div>;
}
