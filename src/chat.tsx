import React, { useState } from "react";
import { ItemContent, Virtuoso } from "react-virtuoso";
import cn from "clsx";
import {
  MessageSender,
  type Message,
} from "../__generated__/resolvers-types";
import css from "./chat.module.css";

import { useMutation, useQuery, useSubscription } from "@apollo/client";
import { GET_MESSAGES, MESSAGE_ADDED, SEND_MESSAGE } from "./graphql/queries";

export const Chat: React.FC = () => {

  const [text, setText] = useState("");

  const { data, loading, error } = useQuery(GET_MESSAGES, {
    variables: { first: 20 },
  });

  const [sendMessage] = useMutation(SEND_MESSAGE);

  const [messages, setMessages] = useState<Message[]>([]);

  useSubscription(MESSAGE_ADDED, {
    onSubscriptionData: ({ subscriptionData }) => {
      const newMessage = subscriptionData.data?.messageAdded;
      if (newMessage) {
        setMessages((prev) => [...prev, newMessage]);
      }
    },
  });

  React.useEffect(() => {
    if (data?.messages?.edges) {
      const initialMessages = data.messages.edges.map((edge: any) => edge.node);
      setMessages(initialMessages);
    }
  }, [data]);

  const handleSend = async () => {
    if (!text.trim()) return;
    try {
      await sendMessage({ variables: { text } });
      setText("");
    } catch (err) {
      console.error("Error sending message:", err);
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading messages</div>;

  const Item: React.FC<Message> = ({ text, sender }) => (
    <div className={css.item}>
      <div
        className={cn(
          css.message,
          sender === MessageSender.Admin ? css.out : css.in
        )}
      >
        {text}
      </div>
    </div>
  );

  const getItem: ItemContent<Message, unknown> = (_, data) => <Item {...data} />;


  return (
    <div className={css.root}>
      <div className={css.container}>
        <Virtuoso className={css.list} data={messages} itemContent={getItem} />
      </div>
      <div className={css.footer}>
        <input
          type="text"
          className={css.textInput}
          placeholder="Message text"
          value={text}
          onChange={(e) => setText(e.target.value)}
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
};
