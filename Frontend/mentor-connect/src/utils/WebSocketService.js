import { Client } from "@stomp/stompjs";
import SockJS from "sockjs-client";
import '../utils/polyfills'; // Import polyfills directly

class WebSocketService {
    constructor() {
        this.client = null;
        this.subscriptions = new Map();
        this.connected = false;
    }

    connect(token) {
        if (this.client && this.connected) {
            console.log("WebSocket already connected");
            return Promise.resolve();
        }

        return new Promise((resolve, reject) => {
            try {
                // Make sure polyfills are applied before creating SockJS
                if (typeof global === 'undefined') {
                    window.global = window;
                }

                // Create STOMP client with SockJS
                this.client = new Client({
                    webSocketFactory: () => {
                        try {
                            // Connect to the backend WebSocket endpoint defined in WebSocketConfig.java
                            return new SockJS("http://localhost:8080/chat");
                        } catch (error) {
                            console.error("Error creating SockJS instance:", error);
                            throw error;
                        }
                    },
                    connectHeaders: {
                        Authorization: `Bearer ${token}`
                    },
                    reconnectDelay: 5000,
                    heartbeatIncoming: 4000,
                    heartbeatOutgoing: 4000,
                    debug: (process.env.NODE_ENV === 'development') ? console.log : null,
                });

                this.client.onConnect = () => {
                    console.log("Connected to WebSocket server");
                    this.connected = true;
                    resolve();
                };

                this.client.onStompError = (frame) => {
                    console.error("STOMP error", frame);
                    reject(frame);
                };

                this.client.onWebSocketClose = () => {
                    console.log("WebSocket connection closed");
                    this.connected = false;
                };

                this.client.onWebSocketError = (event) => {
                    console.error("WebSocket error:", event);
                    // Use a more descriptive error for debugging
                    reject(new Error("WebSocket connection error. See console for details."));
                };

                // Activate the client
                this.client.activate();
            } catch (error) {
                console.error("Error during WebSocket connection setup:", error);
                reject(error);
            }
        });
    }

    disconnect() {
        if (this.client) {
            this.client.deactivate();
            this.client = null;
            this.connected = false;
            this.subscriptions.clear();
            console.log("Disconnected from WebSocket server");
        }
    }

    subscribe(destination, callback) {
        if (!this.client || !this.connected) {
            console.error("WebSocket not connected, cannot subscribe");
            return null;
        }

        if (this.subscriptions.has(destination)) {
            console.log(`Already subscribed to ${destination}`);
            return this.subscriptions.get(destination);
        }

        const subscription = this.client.subscribe(destination, (message) => {
            try {
                const parsedMessage = JSON.parse(message.body);
                callback(parsedMessage);
            } catch (error) {
                console.error("Error parsing message", error);
                callback(message.body);
            }
        });

        this.subscriptions.set(destination, subscription);
        console.log(`Subscribed to ${destination}`);
        return subscription;
    }

    unsubscribe(destination) {
        if (this.subscriptions.has(destination)) {
            const subscription = this.subscriptions.get(destination);
            subscription.unsubscribe();
            this.subscriptions.delete(destination);
            console.log(`Unsubscribed from ${destination}`);
        }
    }

    sendMessage(destination, message) {
        if (!this.client || !this.connected) {
            console.error("WebSocket not connected, cannot send message");
            return false;
        }

        try {
            this.client.publish({
                destination: destination,
                body: JSON.stringify(message),
            });
            return true;
        } catch (error) {
            console.error("Error sending message:", error);
            return false;
        }
    }
}

// Create singleton instance
const webSocketService = new WebSocketService();
export default webSocketService; 