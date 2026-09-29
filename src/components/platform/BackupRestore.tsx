"use client";
import { useState } from "react";
import { editorialContent } from "@/data/editorialContent";
import { platformContent } from "@/data/platformContent";
import {
  object,
  parseEntry,
  type ContentRecord,
  type Entry,
  type Locale,
  type MediaAsset,
} from "@/platform/domain";
import { usePlatformRequest } from "./usePlatformRequest";
export default function BackupRestore({
  locale,
  records,
  media,
  refresh,
  onBusy,
}: {
  locale: Locale;
  records: ContentRecord[];
  media: MediaAsset[];
  refresh(): void;
  onBusy(value: boolean): void;
}) {
  const e = editorialContent[locale],
    c = platformContent[locale],
    api = usePlatformRequest(c);
  const [entries, setEntries] = useState<Entry[]>([]),
    [selected, setSelected] = useState<string[]>([]),
    [error, setError] = useState("");
  const [running, setRunning] = useState(false),
    [done, setDone] = useState<string[]>([]);
  return (
    <div className="p-stack">
      <p>{e.importHelp}</p>
      <p className="p-notice">{e.missingCovers}</p>
      <label className="p-field">
        {e.chooseBackup}
        <input
          type="file"
          accept="application/json,.json"
          disabled={running}
          onChange={async (event) => {
            const file = event.target.files?.[0];
            setEntries([]);
            setSelected([]);
            setError("");
            setDone([]);
            if (!file) return;
            try {
              if (file.size > 80 * 1024 * 1024) throw new Error();
              const input = object(JSON.parse(await file.text()));
              if (
                input.version !== 1 ||
                !Array.isArray(input.records) ||
                input.records.length > 500
              )
                throw new Error();
              const list = input.records.map((value) => {
                const draft = object(object(value).draft);
                if (
                  !/^[a-f0-9]{8}-(?:[a-f0-9]{4}-){3}[a-f0-9]{12}$/u.test(
                    String(draft.id),
                  )
                )
                  throw new Error();
                return {
                  ...parseEntry(draft),
                  id: String(draft.id),
                  status: "draft" as const,
                  revision: 0,
                  updatedAt: "",
                };
              });
              if (
                new Set(list.map((item) => item.id)).size !== list.length ||
                new Set(list.map((item) => `${item.module}/${item.slug}`))
                  .size !== list.length
              )
                throw new Error();
              setEntries(list);
              setSelected(
                list
                  .filter(
                    (item) =>
                      !records.some((record) => record.draft.id === item.id),
                  )
                  .map((item) => item.id),
              );
            } catch {
              setError(e.importError);
            }
          }}
        />
      </label>
      {entries.length > 0 && (
        <>
          <p>
            {e.selected}: {selected.length} / {entries.length}
          </p>
          <div className="p-stack">
            {entries.map((entry) => {
              const current = records.find(
                  (record) => record.draft.id === entry.id,
                ),
                imported = done.includes(entry.id);
              const missing =
                entry.cover &&
                !media.some((asset) => asset.id === entry.cover!.id);
              return (
                <label className="p-check" key={entry.id}>
                  <input
                    type="checkbox"
                    disabled={running || imported}
                    checked={selected.includes(entry.id)}
                    onChange={(event) =>
                      setSelected((ids) =>
                        event.target.checked
                          ? [...ids, entry.id]
                          : ids.filter((id) => id !== entry.id),
                      )
                    }
                  />
                  <span>
                    {entry.translations[locale].title || entry.slug} ·{" "}
                    {entry.module}/{entry.slug} ·{" "}
                    {imported
                      ? e.progress
                      : current
                        ? e.replaceDraft
                        : e.newDraft}
                    {missing && <span className="p-muted"> · {e.noCover}</span>}
                  </span>
                </label>
              );
            })}
          </div>
          <button
            className="p-button p-primary"
            disabled={running || !selected.some((id) => !done.includes(id))}
            onClick={async () => {
              setRunning(true);
              onBusy(true);
              try {
                for (const entry of entries.filter(
                  (item) =>
                    selected.includes(item.id) && !done.includes(item.id),
                )) {
                  const current = records.find(
                    (record) => record.draft.id === entry.id,
                  );
                  if (
                    !(await api.request("/api/platform/admin", {
                      action: "import",
                      entry,
                      revision: current?.draft.revision ?? 0,
                    }))
                  )
                    break;
                  setDone((ids) => [...ids, entry.id]);
                }
              } finally {
                setRunning(false);
                onBusy(false);
                refresh();
              }
            }}
          >
            {running ? c.working : e.importDrafts}
          </button>
        </>
      )}
      {(api.error || error) && (
        <p role="alert" className="p-notice p-error">
          {api.error || error}
        </p>
      )}
      <p role="status">
        {e.progress}: {done.length}
      </p>
    </div>
  );
}
