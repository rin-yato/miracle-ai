import React from "react";
import { useRouter } from "next/navigation";

import { AI_PROMPT, NO_ANSWER_RESPONSE } from "@/lib/constant/prompts";
import useConfig from "@/hooks/use-config";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Textarea } from "@/components/ui/textarea";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { z } from "zod";

const formSchema = z.object({
  prompt: z.string(),
  noAnswer: z.string(),
});

type Props = {
  prompt?: string | null;
  noAnswer?: string | null;
};

export function AdvanceConfig({ prompt, noAnswer }: Props) {
  const { update } = useConfig();
  const router = useRouter();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      prompt: prompt || AI_PROMPT,
      noAnswer: noAnswer || NO_ANSWER_RESPONSE,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    toast.promise(
      update({ no_answer: values.noAnswer, prompt: values.prompt }),
      {
        loading: "Saving changes...",
        success: "Changes saved!",
        error: "Failed to save changes.",
      }
    );
  }

  function handleReset(values: Partial<z.infer<typeof formSchema>>) {
    const formValues = form.getValues();
    toast.promise(update({ ...values }), {
      loading: "Resetting changes...",
      success: "Changes resetted!",
      error: "Failed to reset changes.",
    });
    router.refresh();
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="prompt"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-end justify-between pb-0.5">
                <FormLabel>AI Prompt</FormLabel>
                <Button
                  type="button"
                  variant="link"
                  className="h-fit p-0"
                  onClick={() => handleReset({ prompt: AI_PROMPT })}
                >
                  reset
                </Button>
              </div>
              <FormControl>
                <Textarea
                  placeholder="Intructions for the AI to follow."
                  className="min-h-[130px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is the prompt that will instruct the AI on how to reply to
                the user&apos;s question.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="noAnswer"
          render={({ field }) => (
            <FormItem>
              <div className="flex items-end justify-between pb-0.5">
                <FormLabel>No Answer Response</FormLabel>
                <Button
                  type="button"
                  variant="link"
                  className="h-fit p-0"
                  onClick={() => handleReset({ noAnswer: NO_ANSWER_RESPONSE })}
                >
                  reset
                </Button>
              </div>
              <FormControl>
                <Textarea
                  placeholder="Enter a response for when the AI doesn't know how to answer the question."
                  className="min-h-[60px]"
                  {...field}
                />
              </FormControl>
              <FormDescription>
                This is the response that will be returned if the AI does not
                know the answer to the question.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
