"use client";
import { useEffect, useRef, useState } from "react";
import { editorialContent } from "@/data/editorialContent";
import RichText from "./RichText";
import CoverImage from "./CoverImage";
import BodyEditor from "./BodyEditor";
import MediaLibrary from "./MediaLibrary";
import BackupRestore from "./BackupRestore";
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
  media: NonNullable<State["media"]>;
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
  const e = editorialContent[locale];
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
  const [statusFilter, setStatusFilter] = useState("");
  const [selected, setSelected] = useState<string[]>([]);
  const [batchStatus, setBatchStatus] = useState("in-progress");
  const [externalBusy, setExternalBusy] = useState(false);
  const [pending, setPending] = useState<{ run(): void } | null>(null);
  const pendingSource = useRef<HTMLElement | null>(null);
  function keepEditing() {
    setPending(null);
    setTimeout(() => pendingSource.current?.focus(), 0);
  }
  const [initial, setInitial] = useState("");
  const dirty = Boolean(editing && JSON.stringify(editing) !== initial);
  useEffect(() => {
    if (!dirty && !externalBusy) return;
    const guard = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = "";
    };
    window.addEventListener("beforeunload", guard);
    return () => window.removeEventListener("beforeunload", guard);
  }, [dirty, externalBusy]);
  useEffect(() => {
    if (!dirty && !externalBusy) return;
    const guard = (event: MouseEvent) => {
      if (
        event.button ||
        event.metaKey ||
        event.ctrlKey ||
        event.shiftKey ||
        event.altKey
      )
        return;
      const link =
        event.target instanceof Element
          ? event.target.closest<HTMLAnchorElement>("a[href]")
          : null;
      if (!link || link.download || (link.target && link.target !== "_self"))
        return;
      const url = new URL(link.href);
      if (
        url.origin !== window.location.origin ||
        (url.pathname === window.location.pathname &&
          url.search === window.location.search)
      )
        return;
      event.preventDefault();
      event.stopImmediatePropagation();
      pendingSource.current = link;
      if (!externalBusy)
        setPending({
          run: () => {
            setEditing(null);
            router.push(url.pathname + url.search + url.hash);
          },
        });
    };
    document.addEventListener("click", guard, true);
    return () => document.removeEventListener("click", guard, true);
  }, [dirty, externalBusy, router]);
  function transition(run: () => void) {
    if (externalBusy || api.busy) return;
    if (dirty) {
      pendingSource.current =
        document.activeElement instanceof HTMLElement
          ? document.activeElement
          : null;
      setPending({ run });
    } else run();
  }
  const [confirmation, setConfirmation] = useState<{
    action: string;
    id: string;
    revision: number;
    previousRevision?: number;
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
      setSelected([]);
      router.refresh();
      setTimeout(() => listHeading.current?.focus(), 0);
    }
  }
  function select(next: string) {
    transition(() => {
      setView(next);
      setQuery("");
      setEditing(null);
      setConfirmation(null);
      setNotice("");
      setStatusFilter("");
      setSelected([]);
    });
  }
  function openEditor(entry: Entry) {
    setInitial(JSON.stringify(entry));
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
      (!statusFilter || draft.status === statusFilter) &&
      `${draft.slug} ${Object.values(draft.translations)
        .map((translation) => translation.title)
        .join(" ")}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  const submissions = state.submissions.filter(
    (item) =>
      item.kind === (view === "orders" ? "order" : "inquiry") &&
      (!statusFilter || item.status === statusFilter) &&
      `${item.name} ${item.email} ${item.message} ${item.id}`
        .toLowerCase()
        .includes(query.toLowerCase()),
  );
  return (
    <>
      <div className="p-row">
        <a
          className="p-button"
          href={`/${locale}`}
          onClick={(event) => {
            event.preventDefault();
            transition(() => router.push(`/${locale}`));
          }}
        >
          {c.home}
        </a>
        <a className="p-button" href="/api/platform/export" download>
          {c.export}
        </a>
        <button
          className="p-button"
          disabled={api.busy || externalBusy}
          onClick={() =>
            transition(async () => {
              if (
                await api.request("/api/platform/session", { action: "logout" })
              ) {
                setEditing(null);
                setView("dashboard");
                router.refresh();
              }
            })
          }
        >
          {c.logout}
        </button>
      </div>
      <p className="p-muted">{c.adminIntro}</p>
      {pending && (
        <div
          className="p-confirm"
          role="group"
          aria-label={e.unsaved}
          onKeyDown={(event) => {
            if (event.key === "Escape") keepEditing();
          }}
        >
          <p>{e.unsaved}</p>
          <div className="p-row">
            <button autoFocus className="p-button" onClick={keepEditing}>
              {e.keep}
            </button>
            <button
              className="p-button"
              onClick={() => {
                const run = pending.run;
                setPending(null);
                run();
              }}
            >
              {e.discard}
            </button>
          </div>
        </div>
      )}
      <div className="p-admin-layout">
        <nav className="p-sidebar" aria-label={c.manage}>
          {[
            ["dashboard", c.dashboard],
            ...navigation.map((item) => [item.key, item.label]),
            ["inbox", c.inbox],
            ["orders", c.orders],
            ["activity", c.activity],
            ["media", e.media],
            ["backup", e.backup],
          ].map(([key, label]) => (
            <button
              key={key}
              className="p-button"
              aria-pressed={view === key}
              disabled={api.busy || externalBusy}
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
                media: e.media,
                backup: e.backup,
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
                {confirmation.action === "restore"
                  ? e.confirmRestore
                  : confirmation.action === "unpublish"
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
              <h3>{e.readiness}</h3>
              <p>{e.readinessIntro}</p>
            </>
          )}
          {view === "media" && (
            <MediaLibrary
              locale={locale}
              media={state.media}
              refresh={() => router.refresh()}
              onBusy={setExternalBusy}
            />
          )}
          {view === "backup" && (
            <BackupRestore
              locale={locale}
              records={state.records}
              media={state.media}
              refresh={() => router.refresh()}
              onBusy={setExternalBusy}
            />
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
              <label className="p-field">
                {c.status}
                <select
                  value={statusFilter}
                  onChange={(event) => setStatusFilter(event.target.value)}
                >
                  <option value="">{e.statusAll}</option>
                  {["draft", "review", "published", "archived"].map(
                    (status) => (
                      <option key={status} value={status}>
                        {statuses[status]}
                      </option>
                    ),
                  )}
                </select>
              </label>
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
                    <button
                      className="p-button"
                      onClick={() =>
                        openEditor({
                          ...structuredClone(record.draft),
                          id: "",
                          slug: "",
                          revision: 0,
                          status: "draft",
                          updatedAt: "",
                        })
                      }
                    >
                      {e.duplicate}
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
                        <CoverImage
                          cover={record.draft.cover}
                          locale={language}
                        />
                        <RichText
                          text={record.draft.translations[language].body}
                        />
                      </section>
                    ))}
                  </details>
                  {!!record.history?.length && (
                    <details>
                      <summary className="p-button">{e.history}</summary>
                      <p>{e.restoreHelp}</p>
                      {record.history.map((previous) => (
                        <div key={previous.revision} className="p-divider">
                          <p>
                            {previous.updatedAt} ·{" "}
                            {previous.translations[locale].title} · #
                            {previous.revision}
                          </p>
                          <details>
                            <summary className="p-button">{c.preview}</summary>
                            <RichText
                              text={previous.translations[locale].body}
                            />
                          </details>
                          <button
                            className="p-button"
                            disabled={api.busy}
                            onClick={() =>
                              setConfirmation({
                                action: "restore",
                                id: record.draft.id,
                                revision: record.draft.revision,
                                previousRevision: previous.revision,
                              })
                            }
                          >
                            {e.restore}
                          </button>
                        </div>
                      ))}
                    </details>
                  )}
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
                <label className="p-check">
                  <input
                    type="checkbox"
                    checked={editing.featured ?? false}
                    onChange={(event) =>
                      field("featured", event.target.checked)
                    }
                  />
                  {e.featured}
                </label>
                <p className="p-muted">{e.featuredHelp}</p>
                <label className="p-field">
                  {e.cover}
                  <select
                    value={editing.cover?.id ?? ""}
                    onChange={(event) =>
                      field(
                        "cover",
                        event.target.value
                          ? {
                              id: event.target.value,
                              alt: editing.cover?.alt ?? {
                                en: "",
                                ja: "",
                                "zh-cn": "",
                              },
                            }
                          : undefined,
                      )
                    }
                  >
                    <option value="">{e.noCover}</option>
                    {state.media.map((asset) => (
                      <option key={asset.id} value={asset.id}>
                        {asset.name}
                      </option>
                    ))}
                  </select>
                </label>
                <CoverImage cover={editing.cover} locale={locale} />
                {locales.map((language) => (
                  <fieldset key={language}>
                    <legend>
                      {language === "en"
                        ? "English"
                        : language === "ja"
                          ? "日本語"
                          : "简体中文"}
                    </legend>
                    {editing.cover && (
                      <label className="p-field">
                        {e.alt}
                        <input
                          maxLength={240}
                          value={editing.cover.alt[language]}
                          onChange={(event) =>
                            field("cover", {
                              ...editing.cover,
                              alt: {
                                ...editing.cover!.alt,
                                [language]: event.target.value,
                              },
                            })
                          }
                        />
                      </label>
                    )}
                    {(["title", "summary"] as const).map((key) => (
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
                    <BodyEditor
                      label={c.body}
                      locale={locale}
                      value={editing.translations[language].body}
                      onChange={(body) =>
                        field("translations", {
                          ...editing.translations,
                          [language]: {
                            ...editing.translations[language],
                            body,
                          },
                        })
                      }
                    />
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
                    onClick={() => transition(() => setEditing(null))}
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
              <div className="p-row">
                <label className="p-field">
                  {c.status}
                  <select
                    value={statusFilter}
                    onChange={(event) => {
                      setStatusFilter(event.target.value);
                      setSelected([]);
                    }}
                  >
                    <option value="">{e.statusAll}</option>
                    {["new", "in-progress", "resolved", "closed"].map(
                      (status) => (
                        <option key={status} value={status}>
                          {statuses[status]}
                        </option>
                      ),
                    )}
                  </select>
                </label>
                <label className="p-field">
                  {e.batch}
                  <select
                    value={batchStatus}
                    onChange={(event) => setBatchStatus(event.target.value)}
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
                  disabled={!selected.length || api.busy}
                  onClick={() =>
                    act({
                      action: "submission-batch",
                      status: batchStatus,
                      items: state.submissions
                        .filter((item) => selected.includes(item.id))
                        .map((item) => ({
                          id: item.id,
                          revision: item.revision,
                        })),
                    })
                  }
                >
                  {e.batch} ({selected.length})
                </button>
              </div>
              <p className="p-muted">{e.noneSelected}</p>
              {!submissions.length && <p>{c.noRecords}</p>}
              {submissions.map((item) => (
                <article className="p-card" key={item.id}>
                  <label className="p-check">
                    <input
                      type="checkbox"
                      checked={selected.includes(item.id)}
                      disabled={
                        !selected.includes(item.id) && selected.length >= 50
                      }
                      onChange={(event) =>
                        setSelected((ids) =>
                          event.target.checked
                            ? [...ids, item.id]
                            : ids.filter((id) => id !== item.id),
                        )
                      }
                    />
                    {e.select} · {item.name}
                  </label>
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
                            restore: e.restore,
                            import: e.backup,
                            "media-upload": e.upload,
                            "media-delete": c.delete,
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
