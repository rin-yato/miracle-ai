"use client";

import React from "react";

import useSession from "@/hooks/use-session";

import Text from "@/components/ui/text";

import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { dracula } from "react-syntax-highlighter/dist/esm/styles/prism";

export default function DocsPage() {
  const { session } = useSession();

  if (!session?.user.id) {
    return null;
  }

  return (
    <main className="flex flex-1 flex-col p-7">
      <div className="max-w-lg">
        <Text variant="caption">Setup & Installation</Text>
        <Text className="mb-2 max-w-md text-gray-500">
          A setup guide for this chatbot, it is very easy to setup and use. Its
          also available in almost everything you need.
        </Text>
        <Text className="mt-3 max-w-md">
          1. Add the script tag into your HTML file.
        </Text>
        <SyntaxHighlighter
          showLineNumbers
          language="html"
          style={dracula}
          customStyle={{
            fontSize: "0.8rem",
          }}
        >
          {`<script 
  type="module"
  src="https://cdn.jsdelivr.net/gh/rin-yato/chat-widget@main/dist/index.js"
/>`}
        </SyntaxHighlighter>
        <Text className="mt-3 max-w-md">
          2. Add the div tag with the `id` and `api-key` attribute.
        </Text>
        <SyntaxHighlighter
          showLineNumbers
          language="html"
          style={dracula}
          customStyle={{
            fontSize: "0.8rem",
          }}
        >
          {`<div 
  id="just-miracle-ai-chat-widget"
  api-key="${session.user.id}"
/>`}
        </SyntaxHighlighter>
      </div>
      <div className="mt-10 max-w-lg">
        <Text variant="caption">Plain HTML file</Text>
        <Text className="mb-2 max-w-md text-gray-500">
          If you are using a plain HTML file, you directly add the script tag
          into your HTML file, and start using it.
        </Text>
        <SyntaxHighlighter
          showLineNumbers
          language="html"
          style={dracula}
          customStyle={{
            fontSize: "0.8rem",
          }}
        >
          {`<div
  id="just-miracle-ai-chat-widget"
  api-key="${session.user.id}"
/>
<script 
  type="module"
  src="https://cdn.jsdelivr.net/gh/rin-yato/chat-widget@main/dist/index.js"
/>`}
        </SyntaxHighlighter>
      </div>
      <div className="mt-10 max-w-lg">
        <Text variant="caption">NextJS 13</Text>
        <Text className="mb-2 max-w-md text-gray-500">
          If you are using the APP directory, you can import the `Script`
          component from `next/script` and use it in the body.
        </Text>
        <SyntaxHighlighter
          lineProps={(lineNumber) => {
            const style: any = { display: "block", width: "fit-content" };
            if (lineNumber === 3) {
              style.backgroundColor = "white !important";
            }
            return { style };
          }}
          showLineNumbers
          language="tsx"
          style={dracula}
          customStyle={{
            fontSize: "0.8rem",
          }}
        >
          {`import "@/styles/global.css";
import Script from "next/script";

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="flex min-h-screen flex-col">
        <div>
          {children}
        </div>

        <div
          id="just-miracle-ai-chat-widget"
          api-key="${session.user.id}"
        />
        <Script 
          type="module"
          src="https://cdn.jsdelivr.net/gh/rin-yato/chat-widget@main/dist/index.js"
        />
      </body>
    </html>
  );
}`}
        </SyntaxHighlighter>
      </div>
    </main>
  );
}
