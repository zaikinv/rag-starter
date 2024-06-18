import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  MessageBody,
  ConnectedSocket,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { ChatService } from './chat/chat.service';

type Message = {
  status: 'streaming' | 'completed' | 'idle';
  data?: {
    message?: string;
    vectorStoreCollectionName?: string;
    sources?: Array<{ url: string; score: number }>;
    debug?: Record<any, any>;
  };
};

interface ServerToClientEvents {
  chat: (e: Message) => void;
}

interface ClientToServerEvents {
  chat: (e: Message) => void;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class AppGateway {
  constructor(private readonly chatService: ChatService) {}

  @WebSocketServer()
  server: Server<ServerToClientEvents, ClientToServerEvents>;

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() message: Message,
  ) {
    await this.chatService.getResponse(message, client);
  }
}
