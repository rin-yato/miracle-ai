"use client";

import { cn } from "@/lib/utils";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { DataTableColumnHeader } from "@/components/data-table/column-header";
import { FacetedFilterOption } from "@/components/data-table/faceted-filter";

import { ColumnDef } from "@tanstack/react-table";

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.
export type DataSource = {
  id: number;
  url: string;
  activation: "active" | "inactive";
  status: "trained" | "untrained" | "training";
  last_trained: Date;
};

export const statusOptions: Array<FacetedFilterOption> = [
  { label: "Trained", value: "trained" },
  { label: "Untrained", value: "untrained" },
  { label: "Training", value: "training" },
];

export const DataSourceColumns: ColumnDef<DataSource>[] = [
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
    cell: ({ row }) => (
      <Switch defaultChecked={row.getValue("activation") === "active"} />
    ),
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader minimal column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const bgColorList = {
        trained: "bg-green-500 dark:bg-green-600",
        untrained: "bg-amber-400 dark:bg-amber-500",
        training: "bg-sky-500",
      } as const;

      const lightBgColorList = {
        trained: "bg-green-200 dark:bg-green-700",
        untrained: "bg-amber-200 dark:bg-amber-400/60",
        training: "bg-sky-200 dark:bg-sky-700/80",
      } as const;

      const status = row.getValue<keyof typeof bgColorList>("status");

      const bgColor = bgColorList[status];
      const lightBgColor = lightBgColorList[status];

      return (
        <div className={cn("h-fit w-fit rounded-full p-1 ", lightBgColor)}>
          <Badge
            className={cn(
              "select-none capitalize text-white hover:bg-inherit",
              bgColor
            )}
          >
            {status}
          </Badge>
        </div>
      );
    },
    filterFn: (row, id, filterValue) => {
      return filterValue.includes(row.getValue("status"));
    },
  },
  {
    accessorKey: "last_trained",
    header: ({ column }) => (
      <DataTableColumnHeader minimal column={column} title="Last Trained" />
    ),
    cell: ({ row }) => (
      <>{(row.getValue("last_trained") as Date)?.toDateString()}</>
    ),
  },
];
