
export type IGenericResponse = {
  status: string;
  message: string;
};

export type IMessage = {
  id: string;
  nome: string;
  mensagem: string;
  data: Date;
};

export type IMessageResponse = {
  status: string;
  mensagem: IMessage;
};

export type IMessagesResponse = {
  status: string;
  results: number;
  mensagem: IMessage[];
};