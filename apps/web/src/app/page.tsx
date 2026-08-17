import Form from "next/form";
import {
  FitmentStatus,
  type FitmentStatusValue,
} from "@/components/fitment-status";

type PageSearchParams = Promise<{
  q?: string | string[];
  page?: string | string[];
}>;

type Money = {
  amountMinor: number;
  currency: "EUR";
};

type SearchItem = {
  productId: string;
  title: string;
  brand?: string;
  price: Money;
  fitment: {
    status: FitmentStatusValue;
    ruleScore: number;
    calibratedProbability: number | null;
    evidence: Record<string, unknown>[];
    warnings?: string[];
  };
};

type SearchResponse = {
  items: SearchItem[];
  page: number;
  total: number;
};

type SearchState =
  | { status: "idle" }
  | { status: "success"; data: SearchResponse }
  | { status: "invalid"; message: string }
  | { status: "error"; message: string };

const apiBaseUrl = process.env.API_PUBLIC_URL ?? "http://localhost:4000";

function firstParam(value: string | string[] | undefined) {
  if (Array.isArray(value)) return value[0];
  return value;
}

function parsePage(value: string | string[] | undefined) {
  const rawPage = firstParam(value);
  if (!rawPage) return 1;

  const page = Number(rawPage);
  return Number.isInteger(page) && page > 0 ? page : 1;
}

function formatPrice(price: Money) {
  return new Intl.NumberFormat("bg-BG", {
    style: "currency",
    currency: price.currency,
  }).format(price.amountMinor / 100);
}

async function searchParts(query: string, page: number): Promise<SearchState> {
  if (!query) return { status: "idle" };
  if (query.length > 120) {
    return { status: "invalid", message: "Заявката е твърде дълга." };
  }

  const params = new URLSearchParams({ q: query, page: String(page) });

  try {
    const response = await fetch(`${apiBaseUrl}/search?${params.toString()}`, {
      cache: "no-store",
    });

    if (response.status === 400) {
      return { status: "invalid", message: "Проверете въведения номер или текст." };
    }

    if (!response.ok) {
      return { status: "error", message: "Търсенето временно не е налично." };
    }

    const data = (await response.json()) as SearchResponse;
    return { status: "success", data };
  } catch {
    return { status: "error", message: "API услугата не отговори." };
  }
}

function ResultsPanel({ state }: { state: SearchState }) {
  if (state.status === "idle") {
    return (
      <section className="border-t border-[var(--koli-divider)] py-8 text-[var(--koli-text-secondary)]">
        Въведете OEM номер, номер на част или име на продукт.
      </section>
    );
  }

  if (state.status === "invalid" || state.status === "error") {
    return (
      <section
        className="border-t border-[var(--koli-divider)] py-8"
        aria-live="polite"
      >
        <div className="rounded-md border border-[var(--koli-error)] bg-[var(--koli-surface)] p-4 text-[var(--koli-error)]">
          {state.message}
        </div>
      </section>
    );
  }

  if (state.data.items.length === 0) {
    return (
      <section className="border-t border-[var(--koli-divider)] py-8">
        <div className="rounded-md border border-[var(--koli-divider)] bg-[var(--koli-surface)] p-5">
          <h2 className="font-semibold text-[var(--koli-text)]">Няма намерени части</h2>
          <p className="mt-2 text-sm text-[var(--koli-text-secondary)]">
            Опитайте с OEM номер без интервали или с по-кратко име на част.
          </p>
        </div>
      </section>
    );
  }

  return (
    <section className="border-t border-[var(--koli-divider)] py-8">
      <div className="mb-4 flex flex-wrap items-end justify-between gap-3">
        <div>
          <h2 className="text-xl font-semibold text-[var(--koli-text)]">Резултати</h2>
          <p className="text-sm text-[var(--koli-text-muted)]">
            {state.data.total} намерени продукта
          </p>
        </div>
        <span className="rounded-full bg-[var(--koli-led-soft)] px-3 py-1 text-sm font-medium text-[var(--koli-secondary)]">
          Страница {state.data.page}
        </span>
      </div>

      <div className="grid gap-3">
        {state.data.items.map((item) => (
          <article
            key={item.productId}
            className="rounded-md border border-[var(--koli-divider)] bg-[var(--koli-surface)] p-4 shadow-sm"
          >
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="min-w-0">
                <p className="text-sm font-medium text-[var(--koli-primary)]">
                  {item.brand ?? "Марка не е посочена"}
                </p>
                <h3 className="mt-1 text-lg font-semibold text-[var(--koli-text)]">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm text-[var(--koli-text-muted)]">
                  ID продукт: {item.productId}
                </p>
              </div>

              <div className="shrink-0 text-left sm:text-right">
                <p className="text-lg font-semibold text-[var(--koli-text)]">
                  {formatPrice(item.price)}
                </p>
                <div className="mt-3 sm:max-w-64">
                  <FitmentStatus
                    status={item.fitment.status}
                    ruleScore={item.fitment.ruleScore}
                    warnings={item.fitment.warnings}
                  />
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export default async function Home({
  searchParams,
}: {
  searchParams: PageSearchParams;
}) {
  const params = await searchParams;
  const query = (firstParam(params.q) ?? "").trim();
  const page = parsePage(params.page);
  const searchState = await searchParts(query, page);

  return (
    <main className="min-h-screen bg-[var(--koli-bg)] px-4 py-6 text-[var(--koli-text)] sm:px-6 lg:px-8">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-8">
        <header className="flex flex-col gap-3 border-b border-[var(--koli-divider)] pb-6">
          <p className="text-sm font-semibold uppercase tracking-[0.08em] text-[var(--koli-primary)]">
            Koli Parts
          </p>
          <h1 className="max-w-3xl text-3xl font-bold leading-tight sm:text-4xl">
            Търсене на авточасти по OEM номер, марка или име
          </h1>
          <p className="max-w-2xl text-base leading-7 text-[var(--koli-text-secondary)]">
            Виждате само реални резултати от API. Когато съвместимостта още не е
            проверена, интерфейсът го показва ясно.
          </p>
        </header>

        <Form action="/" className="flex flex-col gap-3 sm:flex-row">
          <label className="sr-only" htmlFor="q">
            Заявка за търсене
          </label>
          <input
            id="q"
            name="q"
            type="search"
            maxLength={120}
            defaultValue={query}
            placeholder="Напр. 34116858910"
            className="min-h-12 flex-1 rounded-md border border-[var(--koli-border)] bg-[var(--koli-surface)] px-4 text-base text-[var(--koli-text)] outline-none transition focus:border-[var(--koli-primary)] focus:ring-2 focus:ring-[var(--koli-led)]"
          />
          <button
            type="submit"
            className="min-h-12 rounded-md bg-[var(--koli-primary)] px-6 text-base font-semibold text-[var(--koli-on-primary)] transition hover:brightness-95 focus:outline-none focus:ring-2 focus:ring-[var(--koli-led)] focus:ring-offset-2"
          >
            Търси
          </button>
        </Form>

        <ResultsPanel state={searchState} />
      </div>
    </main>
  );
}
