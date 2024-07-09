import io from "socket.io-client";

class SocketIOClient {
  constructor(url) {
    this.url = url;
    this.socket = null;
    this.messageQueue = [];
  }

  connect(onMessageCallback, onOpenCallback, onCloseCallback) {
    this.socket = io(this.url);

    this.socket.on("connect", () => {
      console.log("Socket.io connected.");
      if (typeof onOpenCallback === "function") {
        onOpenCallback(this);
      }
      // Process any messages that were queued before the connection was established
      this.processMessageQueue();
    });

    this.socket.on("message", (data) => {
      if (typeof onMessageCallback === "function") {
        onMessageCallback(data);
      }
    });

    this.socket.on("disconnect", () => {
      console.log("Socket.io disconnected.");
      if (typeof onCloseCallback === "function") {
        onCloseCallback();
      }
    });

    this.socket.on("connect_error", (error) => {
      console.error("Socket.io error:", error);
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
    }
  }

  sendMessage(message) {
    if (this.socket && this.socket.connected) {
      this.socket.emit("message", message);
    } else {
      console.error("Socket.io is not connected. Cannot send message.");
      // Queue the message to be sent when the connection is established
      this.messageQueue.push(message);
    }
  }

  processMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.sendMessage(message);
    }
  }
}

export default SocketIOClient;
