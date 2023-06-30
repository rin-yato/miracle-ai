"use client";

import React from "react";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

import { GenerateLinks } from "./generate-links";
import { DataSource, DataSourceColumns } from "./tabe/columns";
import { DataSourceDataTable } from "./tabe/data-table";

const fakeData: DataSource[] = [
  {
    id: 1,
    url: "https://factoryx.dev",
    activation: "active",
    status: "untrained",
    last_trained: new Date(),
  },
  {
    id: 2,
    url: "https://dreamslab.dev",
    activation: "inactive",
    status: "trained",
    last_trained: new Date(),
  },
  {
    id: 3,
    url: "https://rinyato.com",
    activation: "active",
    status: "training",
    last_trained: new Date(),
  },
];

export default function DataPage() {
  return (
    <main className="flex-1 p-4">
      <Tabs defaultValue="data-source">
        <TabsList>
          <TabsTrigger value="data-source">Data Source</TabsTrigger>
          <TabsTrigger value="add-data">Add Data</TabsTrigger>
        </TabsList>
        <TabsContent value="data-source">
          <DataSourceDataTable
            columns={DataSourceColumns}
            data={fakeData}
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
