"use client";

import React from "react";

import { Table } from "@/types/schema";

import useDocument from "@/hooks/use-documents";

import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { FacetedFilterOption } from "@/components/data-table/faceted-filter";

import { DocumentsRowActions } from "../../components/documents-row-actions";
import { ColumnDef, Row } from "@tanstack/react-table";

export const statusOptions: Array<FacetedFilterOption> = [
  { label: "Trained", value: "trained" },
  { label: "Untrained", value: "untrained" },
  { label: "Training", value: "training" },
];

export type DataSource = Required<Table<"documents", "single">>;

export const DocumentsColumns: ColumnDef<DataSource>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={table.getIsAllPageRowsSelected()}
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "url",
    header: ({ column }) => (
      <DataTableColumnHeader minimal column={column} title="Url" />
    ),
  },
  {
    accessorKey: "activation",
    header: ({ column }) => (
      <DataTableColumnHeader minimal column={column} title="Activation" />
    ),
    cell: ({ row }) => <ToggleActivation row={row} />,
  },
  {
    accessorKey: "last_trained",
    header: ({ column }) => (
      <DataTableColumnHeader minimal column={column} title="Last Trained" />
    ),
    cell: ({ row }) => (
      <>{new Date(row.getValue("last_trained"))?.toDateString()}</>
    ),
  },
  {
    id: "actions",
    header: "Actions",
    cell: ({ row }) => <DocumentsRowActions row={row} />,
  },
];

function ToggleActivation({ row }: { row: Row<DataSource> }) {
  const { toggleActivation } = useDocument();
  const [checked, setChecked] = React.useState(row.original.activation);

  return (
    <Switch
      defaultChecked={row.getValue("activation")}
      checked={checked ?? false}
      onCheckedChange={async (value) => {
        setChecked((prev) => !prev);
        const res = await toggleActivation(row.original.id, value);
        if (!res) {
          setChecked((prev) => !prev);
        }
      }}
    />
  );
}
