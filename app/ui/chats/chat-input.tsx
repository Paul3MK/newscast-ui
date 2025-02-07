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

  const onSubmit = (values: z.infer<typeof chatInputSchema>) => {
    console.log(values);
    if (isReady) {
      const recipient = value?.chatList.filter((t) => t.chatId == chatId)[0]
        .phone_number;
      send(
        JSON.stringify({
          message_timestamp: Date.now(),
          message_body: values.input,
          message_chat: chatId,
          message_sender: "7283332958067363841",
          message_recipient: recipient,
        }),
      );
    }
    form.reset();
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

async function SendMessage() {
  // const ws = new WebSocket("ws://127.0.0.1:8002/ws/chat");

  websocket.send(
    JSON.stringify({
      message_timestamp: Date.now(),
      message_body: message,
      message_status: "delivered",
      message_sender: "9999",
      message_recipient: recipient,
    }),
  );
}
