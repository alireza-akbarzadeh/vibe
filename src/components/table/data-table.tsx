import { TableBody } from "./table-body";
import { TableBulkActions } from "./table-bulk-actions";
import { TableRoot } from "./table-context";
import { TableFilterTabs } from "./table-filter-tabs";
import { TableLoading } from "./table-loading";
import { TablePagination } from "./table-pagination";
import { TableSearch } from "./table-search";
import { TableStatusFilters } from "./table-status-filters";

/**
 * # Unified Data Table System
 * A compound component system powered by TanStack Table and React Context.
 * * ## Core Concepts:
 * 1. **Context Driven**: All sub-components must be wrapped in `<Table.Root>`.
 * 2. **Modular UI**: Sub-components (Search, Pagination, etc.) can be placed anywhere
 * within the Root to allow for flexible layouts (Mobile vs Desktop).
 * 3. **Prop-less Sync**: Sub-components pull the `table` instance automatically via context.
 * * ## Component Registry:
 * - `Root`: The Provider. Pass the `useReactTable` instance here.
 * - `Search`: Global or column-specific text filtering.
 * - `FilterTabs`: Categorical filtering (e.g., Roles).
 * - `StatusFilters`: Searchable dropdown for status-based filtering.
 * - `Body`: The actual table grid with sticky headers and scroll management.
 * - `Pagination`: Page navigation and row selection summary.
 * - `BulkActions`: Contextual buttons (Delete/Export) that appear when rows are selected.
 * - `Loading`: Skeleton state matching the table layout.
 * * @example
 * ```tsx
 * const table = useReactTable({ ... });
 * * <Table.Root table={table}>
 * <div className="header">
 * <Table.Search placeholder="Search..." />
 * <Table.BulkActions onDelete={(rows) => purge(rows)} />
 * </div>
 * * <Table.Body columnsCount={5} />
 * * <Table.Pagination />
 * </Table.Root>
 * ```
 */
export const Table = {
	Root: TableRoot,
	Search: TableSearch,
	FilterTabs: TableFilterTabs,
	StatusFilters: TableStatusFilters,
	Body: TableBody,
	Pagination: TablePagination,
	BulkActions: TableBulkActions,
	Loading: TableLoading,
};
