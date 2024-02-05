import axios from "axios";
import { CreateMessageInput } from "../components/messages/create.note";
import { IMessage, IMessageResponse, IMessagesResponse } from "./types";

const BASE_URL = "http://localhost:8000/api/";

export const noteApi = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

export const createMessageFn = async (message: CreateMessageInput) => {
  const response = await noteApi.post<IMessageResponse>("message/", message);
  return response.data;
};

export const getMessageFn = async (messageId: string) => {
  const response = await noteApi.get<IMessageResponse>(`message/${messageId}`);
  return response.data;
};

export const getMessagesFn = async (page = 1, limit = 10) => {
  const response = await noteApi.get<IMessagesResponse>(
    `messages?page=${page}&limit=${limit}`
  );
  return response.data;
};

