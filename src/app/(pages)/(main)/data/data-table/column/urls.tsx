import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "@/components/data-table";

import { CellContext, ColumnDef, HeaderContext } from "@tanstack/react-table";
import useDocument from "@/hooks/use-documents";

type GeneratedLink = { url: string; id: string };

export const UrlsColumns: ColumnDef<GeneratedLink>[] = [
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
    header: AddAllButton,
    cell: AddButton,
  },
];

function AddAllButton({ table }: HeaderContext<GeneratedLink, unknown>) {
  const selectedRows = table.getSelectedRowModel();
  const { addSource } = useDocument();
  async function handleAddAll() {
    if (selectedRows.rows.length === 0) {
      const allRows = table.getCoreRowModel();
      const urls = allRows.rows.map((row) => row.original.url);
      await addSource(urls);
      return;
    }

    const urls = selectedRows.rows.map((row) => row.original.url);
    await addSource(urls);
  }
  return (
    <Button
      onClick={handleAddAll}
      size="sm"
      className="w-max"
      variant="outline"
    >
      Add {selectedRows.rows.length || "All"}
    </Button>
  );
}

function AddButton({ row }: CellContext<GeneratedLink, unknown>) {
  const { addSource } = useDocument();
  return (
    <Button
      size="sm"
      variant="outline"
      className="ml-1.5"
      onClick={() => {
        const url = row.original.url;
        addSource(url);
      }}
    >
      add
    </Button>
  );
}
