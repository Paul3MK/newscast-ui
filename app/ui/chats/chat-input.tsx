"use client";

import { useContext, useState } from "react";
import { Button } from "../button";
import { Input } from "../input";
import { ChatContext } from "./chat-context";
import { ArrowRightIcon, ArrowUpRightIcon } from "@heroicons/react/24/outline";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormControl, FormField } from "../form";
import SnowflakeGenerator from "@/snowflake";
import { db } from "@/db";

const chatInputSchema = z.object({
  input: z.string(),
});

export default function ChatInput({ chatId }: { chatId: string }) {
  const { send, isReady, value } = useContext(ChatContext);
  const searchParams = useSearchParams();
  const recipient = searchParams.get("chatId");
  const [message, setMessage] = useState<string>("");

  const form = useForm<z.infer<typeof chatInputSchema>>({
    resolver: zodResolver(chatInputSchema),
    defaultValues: {
      input: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof chatInputSchema>) => {
    console.log(values, new SnowflakeGenerator(1).generate());
    const recipient = (
      await db.chats.where("chatId").equals(chatId).toArray()
    )[0].phoneNumber;
    try {
      const messageId = new SnowflakeGenerator(1).generate().toString();
      const id = await db.messages.add({
        chatId: chatId,
        messageId,
        content: values.input,
        timestamp: Date.now(),
        sender: "7283332958067363841",
        recipient,
        role: "user",
        createdAt: new Date(),
        syncStatus: "created",
      });
      if (id) {
        await db.chats.update(chatId, {
          lastMessageAt: new Date(),
        });
      }

      console.log(id);

      if (isReady) {
        send(
          JSON.stringify({
            message_id: messageId,
            message_timestamp: Date.now(),
            message_body: values.input,
            message_chat: chatId,
            message_sender: "7283332958067363841",
            message_recipient: recipient,
          }),
        );
      }
      form.reset();
    } catch (e) {
      console.warn(e);
    }
  };

  return (
    <div>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="grid grid-flow-col grid-cols-[1fr_120px] gap-4 w-full mt-2"
        >
          <FormField
            control={form.control}
            name="input"
            render={({ field }) => (
              <FormControl>
                <Input
                  type="text"
                  className="border-0 bg-white p-2 text-black w-full"
                  autoComplete="off"
                  {...field}
                  // value={message}
                  // onChange={(e) => setMessage(e.currentTarget.value)}
                />
              </FormControl>
            )}
          />
          <Button type="submit">
            Send <ArrowRightIcon />
          </Button>
        </form>
      </Form>
    </div>
  );
}
