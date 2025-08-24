
export enum Sender {
  User = 'user',
  Agent = 'agent'
}

export interface Message {
  sender: Sender;
  text: string;
}
