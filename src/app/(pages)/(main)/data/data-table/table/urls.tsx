import React, { useMemo } from "react";

import useDocument from "@/hooks/use-documents";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { DataTable, DataTablePagination } from "@/components/data-table";
import { Icons } from "@/components/icons";

import { UrlsColumns } from "../column/urls";
import {
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
  const { generateUrls, documents } = useDocument();
  const [inputUrl, setInputUrl] = React.useState<string>("");
  const [generatedUrls, setGeneratedUrls] = React.useState<
    Awaited<ReturnType<typeof generateUrls>>
  >([]);

  const data = useMemo(() => {
    return generatedUrls.filter((generatedUrl) => {
      return !documents.find((doc) => doc.url === generatedUrl.url);
    });
  }, [documents, generatedUrls]);

  const [loading, setLoading] = React.useState<boolean>(false);

  const [sorting, setSorting] = React.useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  );
  const [rowSelection, setRowSelection] = React.useState({});

  const table = useReactTable({
    data,
    columns: UrlsColumns,
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
          <DataTable columns={UrlsColumns} data={data} table={table} />
          <div className="my-5" />
          <DataTablePagination table={table} />
        </React.Fragment>
      )}
    </div>
  );
}
