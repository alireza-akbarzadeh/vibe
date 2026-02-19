import type { Table } from "@tanstack/react-table";
import * as React from "react";

// Define the context with a generic TData
interface TableContextValue<TData = unknown> {
	table: Table<TData>;
}

const TableContext = React.createContext<TableContextValue<unknown> | null>(
	null,
);

export function useTableContext<TData>() {
	const context = React.use(TableContext);
	if (!context) {
		throw new Error("Table components must be wrapped in <Table.Root />");
	}
	// Cast to the specific TData type requested by the caller
	return context as TableContextValue<TData>;
}

export function TableRoot<TData>({
	children,
	table,
}: {
	children: React.ReactNode;
	table: Table<TData>;
}) {
	return (
		<TableContext.Provider value={{ table }}>{children}</TableContext.Provider>
	);
}
