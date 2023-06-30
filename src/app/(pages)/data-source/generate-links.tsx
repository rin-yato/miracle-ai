import React, { MouseEvent } from "react";

import useAddSource from "@/hooks/use-add-source";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import {
  DataTable,
  DataTableColumnHeader,
  DataTablePagination,
} from "@/components/data-table";
import { Icons } from "@/components/icons";

import {
  ColumnDef,
  ColumnFiltersState,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  SortingState,
  useReactTable,
} from "@tanstack/react-table";
import { toast } from "react-hot-toast";

export function GenerateLinks() {
  const { generateUrls } = useAddSource();
  const [inputUrl, setInputUrl] = React.useState<string>("");
  const [generatedUrls, setGeneratedUrls] = React.useState<
    Awaited<ReturnType<typeof generateUrls>>
  >([]);
  const [loading, setLoading] = React.useState<boolean>(false);

  async function handleStart() {
    setLoading(true);
    try {
      if (!inputUrl) {
        toast.error("Please enter url");
        return;
      }
      const urls = await generateUrls(inputUrl);
      setGeneratedUrls(urls);
    } catch (error) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data: generatedUrls,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    enableRowSelection: true,
    getPaginationRowModel: getPaginationRowModel(),

    state: {
      sorting,
      columnFilters,
      rowSelection,
    },

    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
  });

  return (
    <div>
      <form
        onSubmit={(e) => e.preventDefault()}
        className="mb-3 mt-7 flex gap-3"
      >
        <Input
          onChange={(e) => setInputUrl(e.target.value)}
          value={inputUrl}
          placeholder="https://example.com..."
          className="max-w-[250px]"
        />
        <Button onClick={handleStart} disabled={loading} className="group">
          <Icons.Loader2
            size={18}
            className="mr-2 hidden animate-spin group-disabled:block"
          />
          Start
        </Button>
      </form>

      {!!generatedUrls.length && (
        <React.Fragment>
          <DataTable columns={columns} data={generatedUrls} table={table} />
          <div className="my-5" />
          <DataTablePagination table={table} />
        </React.Fragment>
      )}
    </div>
  );
}

type GeneratedLink = { url: string; id: string };

const columns: ColumnDef<GeneratedLink>[] = [
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
    id: "No.",
    header: ({ column }) => (
      <DataTableColumnHeader minimal column={column} title="No." />
    ),
    cell: ({ row }) => <span>{row.index + 1}</span>,
  },
  {
    accessorKey: "url",
    header: ({ column }) => (
      <DataTableColumnHeader minimal column={column} title="Url" />
    ),
  },
  {
    id: "actions",
    header: ({ table }) => {
      const selectedRows = table.getSelectedRowModel();
      return (
        <Button
          onClick={() => {
            console.log(selectedRows);
          }}
          size="sm"
          className="w-max"
          variant="outline"
        >
          Add {selectedRows.rows.length || "All"}
        </Button>
      );
    },
    cell: () => (
      <Button size="sm" variant="outline" className="ml-1.5">
        add
      </Button>
    ),
  },
];
