import { sql, type SQL } from "drizzle-orm";

type SearchConfig = "english" | "simple";

function searchConfigSql(config: SearchConfig) {
  return config === "simple" ? sql`'simple'` : sql`'english'`;
}

export function normalizeSearchQuery(query: string) {
  return query.trim().replace(/\s+/g, " ");
}

export function hasSearchQuery(query?: string | null) {
  return Boolean(query && normalizeSearchQuery(query).length >= 2);
}

export function toPlainTsQuery(config: SearchConfig, query: string) {
  return sql`plainto_tsquery(${searchConfigSql(config)}, ${normalizeSearchQuery(
    query,
  )})`;
}

export function searchVectorMatches(
  searchVector: SQL | unknown,
  config: SearchConfig,
  query: string,
) {
  return sql`${searchVector} @@ ${toPlainTsQuery(config, query)}`;
}

export function searchRank(
  searchVector: SQL | unknown,
  config: SearchConfig,
  query: string,
) {
  return sql<number>`ts_rank(${searchVector}, ${toPlainTsQuery(config, query)})`;
}
