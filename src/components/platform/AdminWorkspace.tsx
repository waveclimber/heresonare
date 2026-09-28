"use client";
import { useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { platformContent } from "@/data/platformContent";
import { getNavigationItems } from "@/data/navigation";
import { contentLanguageByLocale } from "@/i18n/config";
import {
  locales,
  modules,
  money,
  recordPath,
  type Entry,
  type Locale,
  type Module,
  type ContentRecord,
  type Submission,
  type State,
} from "@/platform/domain";
import { usePlatformRequest } from "./usePlatformRequest";

type WorkspaceState = {
  records: ContentRecord[];
  submissions: Omit<Submission, "key" | "digest">[];
  audit: State["audit"];
};
function blank(module: Module): Entry {
  return {
    id: "",
    module,
    slug: "",
    revision: 0,
    status: "draft",
    category: "",
    location: "",
    startsAt: "",
    endsAt: "",
    externalUrl: "",
    price: 0,
    currency: "JPY",
    available: false,
    related: [],
    updatedAt: "",
    translations: {
      en: { title: "", summary: "", body: "" },
      ja: { title: "", summary: "", body: "" },
      "zh-cn": { title: "", summary: "", body: "" },
    },
  };
}
export default function AdminWorkspace({
  locale,
  state,
  configured,
}: {
  locale: Locale;
  state: WorkspaceState | null;
  configured: boolean;
}) {
  const c = platformContent[locale];
  const router = useRouter();
  const api = usePlatformRequest(c);
  const navigation = getNavigationItems(
    contentLanguageByLocale[locale],
    locale,
  );
  const [view, setView] = useState("dashboard");
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<Entry | null>(null);
  const [notice, setNotice] = useState("");
  const [confirmation, setConfirmation] = useState<{
    action: string;
    id: string;
    revision: number;
  } | null>(null);
  const editorHeading = useRef<HTMLHeadingElement>(null);
  const listHeading = useRef<HTMLHeadingElement>(null);
  const statuses: Record<string, string> = {
    draft: c.draft,
    review: c.reviewStatus,
    published: c.published,
    archived: c.archived,
    new: c.newStatus,
    "in-progress": c.progress,
    resolved: c.resolved,
    closed: c.closed,
  };
  async function act(input: unknown) {
    const result = await api.request("/api/platform/admin", input);
    if (result) {
      setEditing(null);
      setConfirmation(null);
      setNotice(c.saved);
      router.refresh();
      setTimeout(() => listHeading.current?.focus(), 0);
    }
  }
  function select(next: string) {
    setView(next);
    setQuery("");
    setEditing(null);
    setConfirmation(null);
    setNotice("");
  }
  function openEditor(entry: Entry) {
    setEditing(structuredClone(entry));
    setNotice("");
    setTimeout(() => editorHeading.current?.focus(), 0);
  }
  function field(key: keyof Entry, value: unknown) {
    setEditing((entry) => (entry ? { ...entry, [key]: value } : null));
  }
  const message = (
    <>
      {api.error && (
        <p role="alert" className="p-notice p-error">
          {api.error}
        </p>
      )}
      {notice && (
        <p role="status" className="p-notice">
          {notice}
        </p>
      )}
    </>
  );
  if (!configured) return <p className="p-notice">{c.setup}</p>;
  if (!state)
    return (
      <>
        <p className="p-muted">{c.adminOnly}</p>
        {message}
        <form
          method="post"
          className="p-form"
          onSubmit={async (event) => {
            event.preventDefault();
            const form = new FormData(event.currentTarget);
            if (
              await api.request("/api/platform/session", {
                email: form.get("email"),
                password: form.get("password"),
              })
            )
              router.refresh();
          }}
        >
          <label className="p-field">
            {c.email}
            <input
              name="email"
              type="email"
              autoComplete="username"
              required
              maxLength={254}
            />
          </label>
          <label className="p-field">
            {c.password}
            <input
              name="password"
              type="password"
              autoComplete="current-password"
              required
              maxLength={256}
            />
          </label>
          <button
            className="p-button p-primary"
            disabled={!api.ready || api.busy}
          >
            {api.busy ? c.working : c.login}
          </button>
        </form>
      </>
    );
  const records = state.records.filter(
    ({ draft }) =>
      draft.module === view &&
      `${draft.slug} ${Object.values(draft.translations)
        .map((translation) => translation.title)
        .join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const submissions = state.submissions.filter(
    (item) =>
      item.kind === (view === "orders" ? "order" : "inquiry") &&
      `${item.name} ${item.email} ${item.message} ${item.id}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <>
      <div className="p-row">
        <a className="p-button" href={`/${locale}`}>
          {c.home}
        </a>
        <a className="p-button" href="/api/platform/export" download>
          {c.export}
        </a>
        <button
          className="p-button"
          disabled={api.busy}
          onClick={async () => {
            if (
              await api.request("/api/platform/session", { action: "logout" })
            )
              router.refresh();
          }}
        >
          {c.logout}
        </button>
      </div>
      <p className="p-muted">{c.adminIntro}</p>
      <div className="p-admin-layout">
        <nav className="p-sidebar" aria-label={c.manage}>
          {[
            ["dashboard", c.dashboard],
            ...navigation.map((item) => [item.key, item.label]),
            ["inbox", c.inbox],
            ["orders", c.orders],
            ["activity", c.activity],
          ].map(([key, label]) => (
            <button
              key={key}
              className="p-button"
              aria-pressed={view === key}
              onClick={() => select(key)}
            >
              {label}
            </button>
          ))}
        </nav>
        <section className="p-stack" aria-label={c.content}>
          <h2 ref={listHeading} tabIndex={-1}>
            {navigation.find((item) => item.key === view)?.label ??
              {
                dashboard: c.dashboard,
                inbox: c.inbox,
                orders: c.orders,
                activity: c.activity,
              }[view]}
          </h2>
          {message}
          {confirmation && (
            <div
              className="p-confirm"
              role="group"
              aria-label={c.confirm}
              onKeyDown={(event) => {
                if (event.key === "Escape") setConfirmation(null);
              }}
            >
              <p>
                {confirmation.action === "unpublish"
                  ? c.confirmUnpublish
                  : c.confirmDelete}
              </p>
              <div className="p-row">
                <button
                  autoFocus
                  className="p-button"
                  onClick={() => setConfirmation(null)}
                >
                  {c.cancel}
                </button>
                <button
                  className="p-button"
                  disabled={api.busy}
                  onClick={() => act(confirmation)}
                >
                  {c.confirm}
                </button>
              </div>
            </div>
          )}
          {view === "dashboard" && (
            <>
              <div className="p-grid">
                {[
                  [
                    c.publishedCount,
                    state.records.filter((record) => record.published).length,
                  ],
                  [
                    c.pendingDrafts,
                    state.records.filter(
                      (record) =>
                        record.draft.status === "draft" ||
                        record.draft.status === "review",
                    ).length,
                  ],
                  [
                    c.inbox,
                    state.submissions.filter((item) => item.status === "new")
                      .length,
                  ],
                ].map(([label, count]) => (
                  <div key={label} className="p-card">
                    <span className="p-count">{count}</span>
                    {label}
                  </div>
                ))}
              </div>
              <dl className="p-card">
                <dt>{c.storage}</dt>
                <dd>{c.enabled}</dd>
                <dt>{c.payments}</dt>
                <dd>{c.manual}</dd>
                <dt>{c.mailStatus}</dt>
                <dd>{c.mailManual}</dd>
              </dl>
              <p className="p-muted">{c.reviewNote}</p>
            </>
          )}
          {modules.includes(view as Module) && !editing && (
            <>
              <div className="p-row">
                <button
                  className="p-button p-primary"
                  onClick={() => openEditor(blank(view as Module))}
                >
                  {c.create}
                </button>
                <label className="p-field">
                  {c.search}
                  <input
                    value={query}
                    onChange={(event) => setQuery(event.target.value)}
                  />
                </label>
              </div>
              <p className="p-muted">{c.liveVersion}</p>
              {!records.length && <p>{c.noRecords}</p>}
              {records.map((record) => (
                <article className="p-card" key={record.draft.id}>
                  <p className="p-kicker">
                    {statuses[record.draft.status]} · {record.draft.slug}
                  </p>
                  <h3>
                    {record.draft.translations[locale].title ||
                      record.draft.translations.en.title}
                  </h3>
                  <p>{record.draft.translations[locale].summary}</p>
                  <div className="p-row">
                    <button
                      className="p-button"
                      onClick={() => openEditor(record.draft)}
                    >
                      {c.edit}
                    </button>
                    {record.draft.status === "draft" && (
                      <button
                        disabled={api.busy}
                        className="p-button"
                        onClick={() =>
                          act({
                            action: "review",
                            id: record.draft.id,
                            revision: record.draft.revision,
                          })
                        }
                      >
                        {c.review}
                      </button>
                    )}
                    {record.draft.status === "review" && (
                      <button
                        disabled={api.busy}
                        className="p-button p-primary"
                        onClick={() =>
                          act({
                            action: "publish",
                            id: record.draft.id,
                            revision: record.draft.revision,
                          })
                        }
                      >
                        {c.publish}
                      </button>
                    )}
                    {record.published && (
                      <>
                        <a
                          className="p-button"
                          href={recordPath(record.published, locale)}
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {c.live} ↗
                        </a>
                        <button
                          className="p-button"
                          onClick={() =>
                            setConfirmation({
                              action: "unpublish",
                              id: record.draft.id,
                              revision: record.draft.revision,
                            })
                          }
                        >
                          {c.unpublish}
                        </button>
                      </>
                    )}
                    {!record.published && (
                      <button
                        className="p-button"
                        onClick={() =>
                          setConfirmation({
                            action: "delete",
                            id: record.draft.id,
                            revision: record.draft.revision,
                          })
                        }
                      >
                        {c.delete}
                      </button>
                    )}
                  </div>
                  <details>
                    <summary className="p-button">{c.preview}</summary>
                    {locales.map((language) => (
                      <section key={language}>
                        <h3>
                          {language} ·{" "}
                          {record.draft.translations[language].title}
                        </h3>
                        <p>{record.draft.translations[language].summary}</p>
                        <p className="p-body">
                          {record.draft.translations[language].body}
                        </p>
                      </section>
                    ))}
                  </details>
                </article>
              ))}
            </>
          )}
          {editing && (
            <div>
              <h2 ref={editorHeading} tabIndex={-1}>
                {editing.id ? c.edit : c.create}
              </h2>
              <p className="p-muted">{c.translationNote}</p>
              <form
                method="post"
                className="p-form p-editor"
                onSubmit={(event) => {
                  event.preventDefault();
                  void act({
                    action: "save",
                    id: editing.id,
                    revision: editing.revision,
                    entry: editing,
                  });
                }}
              >
                <label className="p-field">
                  {c.slug}
                  <input
                    required
                    pattern="[a-z0-9]+(-[a-z0-9]+)*"
                    maxLength={80}
                    value={editing.slug}
                    disabled={Boolean(editing.id)}
                    onChange={(event) => field("slug", event.target.value)}
                  />
                </label>
                <p className="p-muted">{c.identityNote}</p>
                {locales.map((language) => (
                  <fieldset key={language}>
                    <legend>
                      {language === "en"
                        ? "English"
                        : language === "ja"
                          ? "日本語"
                          : "简体中文"}
                    </legend>
                    {(["title", "summary", "body"] as const).map((key) => (
                      <label className="p-field" key={key}>
                        {c[key]}
                        {key === "title" ? (
                          <input
                            value={editing.translations[language][key]}
                            maxLength={140}
                            onChange={(event) =>
                              field("translations", {
                                ...editing.translations,
                                [language]: {
                                  ...editing.translations[language],
                                  [key]: event.target.value,
                                },
                              })
                            }
                          />
                        ) : (
                          <textarea
                            value={editing.translations[language][key]}
                            maxLength={key === "summary" ? 400 : 12000}
                            onChange={(event) =>
                              field("translations", {
                                ...editing.translations,
                                [language]: {
                                  ...editing.translations[language],
                                  [key]: event.target.value,
                                },
                              })
                            }
                          />
                        )}
                      </label>
                    ))}
                  </fieldset>
                ))}
                <label className="p-field">
                  {c.category}
                  <input
                    maxLength={60}
                    value={editing.category}
                    onChange={(event) => field("category", event.target.value)}
                  />
                </label>
                <label className="p-field">
                  {c.url}
                  <input
                    type="url"
                    maxLength={1000}
                    value={editing.externalUrl}
                    onChange={(event) =>
                      field("externalUrl", event.target.value)
                    }
                  />
                </label>
                {["tour", "venues"].includes(editing.module) && (
                  <label className="p-field">
                    {c.location}
                    <input
                      maxLength={180}
                      value={editing.location}
                      onChange={(event) =>
                        field("location", event.target.value)
                      }
                    />
                  </label>
                )}
                {editing.module === "tour" && (
                  <>
                    <p className="p-muted">{c.dateHelp}</p>
                    <label className="p-field">
                      {c.starts}
                      <input
                        value={editing.startsAt}
                        onChange={(event) =>
                          field("startsAt", event.target.value)
                        }
                      />
                    </label>
                    <label className="p-field">
                      {c.ends}
                      <input
                        value={editing.endsAt}
                        onChange={(event) =>
                          field("endsAt", event.target.value)
                        }
                      />
                    </label>
                  </>
                )}
                {editing.module === "store" && (
                  <>
                    <label className="p-field">
                      {c.currency}
                      <select
                        value={editing.currency}
                        onChange={(event) =>
                          field("currency", event.target.value)
                        }
                      >
                        {["JPY", "USD", "CNY"].map((currency) => (
                          <option key={currency}>{currency}</option>
                        ))}
                      </select>
                    </label>
                    <label className="p-field">
                      {c.price}
                      <input
                        type="number"
                        min={0}
                        max={100000000}
                        step={1}
                        value={editing.price}
                        onChange={(event) =>
                          field("price", Number(event.target.value))
                        }
                      />
                    </label>
                    <p className="p-muted">{c.priceHelp}</p>
                    <label className="p-check">
                      <input
                        type="checkbox"
                        checked={editing.available}
                        onChange={(event) =>
                          field("available", event.target.checked)
                        }
                      />
                      {c.available}
                    </label>
                  </>
                )}
                <fieldset>
                  <legend>{c.references}</legend>
                  {state.records
                    .filter(
                      (item) => item.published && item.draft.id !== editing.id,
                    )
                    .map((item) => (
                      <label key={item.draft.id} className="p-check">
                        <input
                          type="checkbox"
                          checked={editing.related.includes(item.draft.id)}
                          onChange={(event) =>
                            field(
                              "related",
                              event.target.checked
                                ? [...editing.related, item.draft.id]
                                : editing.related.filter(
                                    (id) => id !== item.draft.id,
                                  ),
                            )
                          }
                        />
                        {item.published!.translations[locale].title}
                      </label>
                    ))}
                </fieldset>
                <div className="p-row">
                  <button
                    className="p-button p-primary"
                    disabled={api.busy || !api.ready}
                  >
                    {api.busy ? c.working : c.save}
                  </button>
                  <button
                    type="button"
                    className="p-button"
                    onClick={() => setEditing(null)}
                  >
                    {c.cancel}
                  </button>
                </div>
              </form>
            </div>
          )}
          {["inbox", "orders"].includes(view) && (
            <>
              <label className="p-field">
                {c.search}
                <input
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
              </label>
              <p className="p-muted">{c.retained}</p>
              {!submissions.length && <p>{c.noRecords}</p>}
              {submissions.map((item) => (
                <article className="p-card" key={item.id}>
                  <p className="p-kicker">
                    {statuses[item.status]} · {item.locale}
                  </p>
                  <h3>{item.name}</h3>
                  <p>{item.email}</p>
                  <p>{c.topics[item.topic as keyof typeof c.topics]}</p>
                  <p className="p-body">{item.message}</p>
                  {item.lines.map((line) => (
                    <p key={line.id}>
                      {line.title} × {line.quantity} ·{" "}
                      {money(line.price * line.quantity, line.currency, locale)}
                    </p>
                  ))}
                  <p className="p-muted">
                    {item.createdAt} · {item.id}
                  </p>
                  <div className="p-row">
                    <a
                      className="p-button"
                      href={`mailto:${encodeURIComponent(item.email)}?subject=${encodeURIComponent(`héReSonare ${item.id}`)}`}
                    >
                      {c.reply}
                    </a>
                    <label className="p-field">
                      {c.status}
                      <select
                        value={item.status}
                        disabled={api.busy}
                        onChange={(event) =>
                          act({
                            action: "submission-status",
                            id: item.id,
                            revision: item.revision,
                            status: event.target.value,
                          })
                        }
                      >
                        {["new", "in-progress", "resolved", "closed"].map(
                          (status) => (
                            <option key={status} value={status}>
                              {statuses[status]}
                            </option>
                          ),
                        )}
                      </select>
                    </label>
                    <button
                      className="p-button"
                      onClick={() =>
                        setConfirmation({
                          action: "submission-delete",
                          id: item.id,
                          revision: item.revision,
                        })
                      }
                    >
                      {c.delete}
                    </button>
                  </div>
                </article>
              ))}
            </>
          )}
          {view === "activity" && (
            <div className="p-scroll">
              <table className="p-table">
                <thead>
                  <tr>
                    <th>{c.updated}</th>
                    <th>{c.action}</th>
                    <th>{c.target}</th>
                  </tr>
                </thead>
                <tbody>
                  {state.audit.map((item, index) => (
                    <tr key={index}>
                      <td>{item.at}</td>
                      <td>
                        {(
                          {
                            save: c.save,
                            review: c.review,
                            publish: c.publish,
                            unpublish: c.unpublish,
                            delete: c.delete,
                            login: c.login,
                            inquiry: c.inbox,
                            order: c.orders,
                            "submission-status": c.status,
                            "submission-delete": c.delete,
                          } as Record<string, string>
                        )[item.action] ?? item.action}
                      </td>
                      <td>{item.target}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </>
  );
}
