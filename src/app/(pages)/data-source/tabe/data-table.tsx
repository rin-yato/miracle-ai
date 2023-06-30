"use client";

import React from "react";

import { Input } from "@/components/ui/input";
import {
  DataTable,
  DataTablePagination,
  DataTableViewOptions,
} from "@/components/data-table";
import { DataTableFacetedFilter } from "@/components/data-table/faceted-filter";

import { statusOptions } from "./columns";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  className?: string;
}

export function DataSourceDataTable<TData, TValue>({
  columns,
  data,
  className,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    enableFilters: true,

    state: {
      sorting,
      columnFilters,
      rowSelection,
    },

    enableGlobalFilter: false,
  });

  return (
    <div className={className}>
      <div className="flex items-center gap-x-5 py-4">
        <Input
          placeholder="Filter with url..."
          value={(table.getColumn("url")?.getFilterValue() as string) ?? ""}
          onChange={(event) =>
            table.getColumn("url")?.setFilterValue(event.target.value)
          }
          className="h-8 w-[150px] lg:w-[250px]"
        />
        {table.getColumn("status") && (
          <DataTableFacetedFilter
            options={statusOptions}
            title="Status"
            column={table.getColumn("status")}
          />
        )}
        <DataTableViewOptions table={table} />
      </div>
      <DataTable table={table} columns={columns} data={data} />
      <div className="my-5" />
      <DataTablePagination table={table} />
    </div>
  );
}
