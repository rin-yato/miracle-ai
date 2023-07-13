"use client";

import React from "react";

import useDocument from "@/hooks/use-documents";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { DocumentsColumns } from "./data-table/column/documents";
import { DataSourceDataTable } from "./data-table/table/documents";
import { GenerateLinks } from "./data-table/table/urls";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export default function DataPage() {
  const { documents } = useDocument();

  return (
    <main className="flex-1 p-4">
      <Tabs defaultValue="data-source">
        <TabsList>
          <TabsTrigger value="data-source">Data Source</TabsTrigger>
          <TabsTrigger value="add-data">Add Data</TabsTrigger>
        </TabsList>
        <TabsContent value="data-source">
          <DataSourceDataTable
            columns={DocumentsColumns}
            data={documents}
            className="max-w-3xl"
          />
        </TabsContent>
        <TabsContent value="add-data" className="max-w-4xl">
          <GenerateLinks />
        </TabsContent>
      </Tabs>
    </main>
  );
}
