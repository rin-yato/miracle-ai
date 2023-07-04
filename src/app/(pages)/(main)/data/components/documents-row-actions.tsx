"use client";

import useDocument from "@/hooks/use-documents";

import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Icons } from "@/components/icons";

import { DataSource } from "../data-table/column/documents";
import { Row } from "@tanstack/react-table";

type DataTableRowActionsProps = {
  row: Row<DataSource>;
};

export function DocumentsRowActions({ row }: DataTableRowActionsProps) {
  const { deleteDocument } = useDocument();

  const handleDelete = () => {
    const id = row.original.id;
    deleteDocument(id);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
        >
          <Icons.MoreHorizontal className="h-4 w-4" />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[160px]">
        <DropdownMenuItem>
          <Icons.Pen className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem>
          <Icons.IterationCw className="mr-2 h-3.5 w-3.5 text-muted-foreground/70" />
          Retrain
        </DropdownMenuItem>
        <DropdownMenuSeparator />
        <DropdownMenuItem isDestructive onClick={handleDelete}>
          <Icons.Trash2 className="mr-2 h-3.5 w-3.5" />
          Delete
          <DropdownMenuShortcut>⌘⌫</DropdownMenuShortcut>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
