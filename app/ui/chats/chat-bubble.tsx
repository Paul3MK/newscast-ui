import clsx from "clsx";

export function ChatBubble({ content, sender, time }) {
  return (
    <div
      className={clsx(
        "bg-green-200 py-2 px-4 my-2 rounded-sm self-start grid gap-1 grid-cols-none max-w-[60%]",
        {
          "bg-green-950 text-white self-end": sender === "7283332958067363841",
        },
      )}
    >
      <span>{content}</span>
      <span className="text-xs font-medium justify-self-end">
        {new Date(Number(time)).toLocaleTimeString().slice(0, 5)}
      </span>
      {/* <span>{time}</span> */}
    </div>
  );
}
