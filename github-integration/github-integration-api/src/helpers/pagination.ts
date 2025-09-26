export interface QueryOptions {
  page?: number;
  limit?: number;
  sortField?: string;
  sortOrder?: "asc" | "desc";
  filter?: Record<string, any>;
  search?: string;
}

export const parseQueryOptions = (query: any): QueryOptions => {
  const page = Math.max(1, parseInt(query.page as string || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(query.limit as string || "20", 10)));
  const sortField = query.sortField as string | undefined;
  const sortOrder = (query.sortOrder === "asc" ? "asc" : "desc");
  const filter = query.filter ? JSON.parse(query.filter) : undefined;
  const search = query.search as string | undefined;
  return { page, limit, sortField, sortOrder, filter, search };
};