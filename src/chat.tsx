import React from "react";
import { ItemContent, Virtuoso } from "react-virtuoso";
import cn from "clsx";
import {
  MessageSender,
  type Message,
} from "../__generated__/resolvers-types";
import css from "./chat.module.css";

import { useQuery } from "@apollo/client";
import { GET_MESSAGES } from "./graphql/queries";

const Item: React.FC<Message> = ({ text, sender }) => {
  return (
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
};

const getItem: ItemContent<Message, unknown> = (_, data) => {
  return <Item {...data} />;
};

export const Chat: React.FC = () => {

  const { data, loading, error } = useQuery(GET_MESSAGES, {
    variables: { first: 20 },
  });

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error loading messages</div>;

  const messages: Message[] =
    data?.messages?.edges.map((edge: any) => edge.node) || [];


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
        />
        <button>Send</button>
      </div>
    </div>
  );
};
