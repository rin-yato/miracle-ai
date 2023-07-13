import { cn } from "@/lib/utils";
import { Message } from "ai";

import moment from "moment";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

type Props = Partial<Message> & { displayDate?: boolean };

export function Message({ role, content, createdAt, displayDate }: Props) {

  const isAI = role === 'assistant';

  const twBorderRadius = displayDate
    ? isAI
      ? "rounded-tl-none"
      : "rounded-br-none ml-auto"
    : "rounded-xl";

  return (
    <div className="group flex flex-col first:mt-2 last:mb-2" data-is-ai={isAI}>
      <div
        className={cn(
          "w-fit max-w-[80%] break-words rounded-2xl bg-accent px-3 py-1.5 group-data-[is-ai=true]:bg-sky-50 group-data-[is-ai=true]:dark:bg-gray-800",
          twBorderRadius
        )}
      >
        <ReactMarkdown remarkPlugins={ [remarkGfm] } linkTarget="_blank" components={ {
          a: ({node, ...props}) => <a {...props} className="prose text-blue-500 hover:underline" />
        }}>
        {content as string}
        </ReactMarkdown>
      </div>
      {displayDate && (
        <p className={cn("px-2 pt-0.5 text-xs ", !isAI && "ml-auto")}>
          {moment(createdAt).fromNow()}
        </p>
      )}
    </div>
  );
}
