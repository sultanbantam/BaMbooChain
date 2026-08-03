import { io, Socket } from 'socket.io-client';
import { Platform } from 'react-native';
import * as SecureStore from './storage';
import { SOCKET_URL } from './config';

class SocketService {
  public socket: Socket | null = null;
  private activeToken: string | null = null;

  public async connect(tokenOverride?: string | null) {
    if (this.socket?.connected && (!tokenOverride || tokenOverride === this.activeToken)) return;

    let token = tokenOverride || null;
    if (Platform.OS === 'web') {
      token = token || localStorage.getItem('token');
    } else {
      token = token || await SecureStore.getItemAsync('token');
    }

    if (!token) return;

    if (this.socket) {
      this.disconnect();
    }

    this.activeToken = token;
    this.socket = io(SOCKET_URL, {
      query: { token },
      transports: ['websocket']
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server:', this.socket?.id);
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket');
    });
  }

  public disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    this.activeToken = null;
  }
}

export const socketService = new SocketService();