import { gql } from "@apollo/client";

export const GET_MESSAGES = gql`
  query GetMessages($first: Int, $after: MessagesCursor) {
    messages(first: $first, after: $after) {
      edges {
        node {
          id
          text
          status
          updatedAt
          sender
        }
        cursor
      }
      pageInfo {
        hasNextPage
        endCursor
      }
    }
  }
`;


export const SEND_MESSAGE = gql`
  mutation SendMessage($text: String!) {
    sendMessage(text: $text) {
      id
      text
      status
      updatedAt
      sender
    }
  }
`;

export const MESSAGE_ADDED = gql`
  subscription MessageAdded {
    messageAdded {
      id
      text
      status
      updatedAt
      sender
    }
  }
`;
