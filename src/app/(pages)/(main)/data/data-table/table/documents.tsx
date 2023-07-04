"use client";

import React from "react";

import useConfirmation from "@/hooks/use-confirmation";
import useDocument from "@/hooks/use-documents";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DataTable,
  DataTablePagination,
  DataTableViewOptions,
} from "@/components/data-table";

import { DataSource } from "../column/documents";
import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";

interface DataTableProps {
  columns: ColumnDef<DataSource>[];
  data: DataSource[];
  className?: string;
}

export function DataSourceDataTable({
  columns,
  data,
  className,
}: DataTableProps) {
  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [rowSelection, setRowSelection] = React.useState({});
  const { createConfirmation } = useConfirmation();
  const { deleteDocument } = useDocument();

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

  const selectedRows = table.getSelectedRowModel().rows;

  function handleDelete() {
    createConfirmation({
      type: "destructive",
      title: `Delete ${selectedRows.length} items`,
      description: `This is a permanent action, and cannot be undone.`,
      onConfirm: () => {
        selectedRows.forEach((row) => {
          deleteDocument(row.original.id);
        });
      },
    });
  }

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
        {/* {table.getColumn("status") && (
          <DataTableFacetedFilter
            options={statusOptions}
            title="Status"
            column={table.getColumn("status")}
          />
        )} */}
        <div className="ml-auto flex gap-5">
          {!!selectedRows.length && (
            <Button
              size="sm"
              variant="outline-destructive"
              className="ml-auto"
              onClick={handleDelete}
            >
              Delete {selectedRows.length} items
            </Button>
          )}
          <DataTableViewOptions table={table} />
        </div>
      </div>
      <DataTable table={table} columns={columns} data={data} />
      <div className="my-5" />
      <DataTablePagination table={table} />
    </div>
  );
}
