import {
  WebSocketGateway,
  WebSocketServer,
  SubscribeMessage,
  OnGatewayConnection,
  OnGatewayDisconnect,
  ConnectedSocket,
  MessageBody,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { Logger } from '@nestjs/common';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class InboxGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer()
  server: Server;

  private readonly logger = new Logger(InboxGateway.name);

  handleConnection(client: Socket) {
    this.logger.log(`Client connected to WebSocket: ${client.id}`);
  }

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected from WebSocket: ${client.id}`);
  }

  @SubscribeMessage('join_tenant')
  handleJoinTenant(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { tenantId: string },
  ) {
    if (data?.tenantId) {
      client.join(`tenant_${data.tenantId}`);
      this.logger.log(`Client ${client.id} joined room tenant_${data.tenantId}`);
      return { status: 'joined', room: `tenant_${data.tenantId}` };
    }
  }

  @SubscribeMessage('join_conversation')
  handleJoinConversation(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: { conversationId: string },
  ) {
    if (data?.conversationId) {
      client.join(`conv_${data.conversationId}`);
      return { status: 'joined', room: `conv_${data.conversationId}` };
    }
  }

  /**
   * Broadcast new message to tenant room and conversation room
   */
  broadcastNewMessage(tenantId: string, conversationId: string, message: any) {
    if (this.server) {
      this.server.to(`tenant_${tenantId}`).emit('new_message_alert', { conversationId, message });
      this.server.to(`conv_${conversationId}`).emit('message_received', message);
    }
  }
}
