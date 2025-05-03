"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiscordPresencePlugin = void 0;
const discord_rpc_1 = require("discord-rpc");
// Constants
const CONFIG = {
    CLIENT_ID: '1115310660818047208',
    UPDATE_INTERVAL: 15000, // 15 seconds
    DEFAULT_ACTIVITY: {
        details: 'Using Tabby Terminal',
        state: 'Coding',
        largeImageKey: 'tabby',
        largeImageText: 'Tabby Terminal',
        smallImageKey: 'coding',
        smallImageText: 'Coding',
        instance: false,
    },
};
// Error handling
class DiscordPresenceError extends Error {
    constructor(message, originalError) {
        super(message);
        this.originalError = originalError;
        this.name = 'DiscordPresenceError';
    }
}
class DiscordPresencePlugin {
    constructor() {
        this.updateInterval = null;
        this.lastActivity = null;
        this.rpc = new discord_rpc_1.Client({ transport: 'ipc' });
    }
    async activate() {
        try {
            console.log('Discord RPC başlatılıyor...');
            await this.connect();
            await this.startPresenceUpdates();
            console.log('Discord Rich Presence aktif!');
        }
        catch (error) {
            throw new DiscordPresenceError('Discord bağlantısı başlatılamadı', error);
        }
    }
    async deactivate() {
        try {
            await this.stopPresenceUpdates();
            await this.disconnect();
            console.log('Discord Rich Presence devre dışı!');
        }
        catch (error) {
            throw new DiscordPresenceError('Discord bağlantısı kapatılamadı', error);
        }
    }
    async connect() {
        try {
            await this.rpc.login({ clientId: CONFIG.CLIENT_ID });
        }
        catch (error) {
            throw new DiscordPresenceError('Discord\'a bağlanılamadı', error);
        }
    }
    async disconnect() {
        try {
            await this.rpc.destroy();
        }
        catch (error) {
            throw new DiscordPresenceError('Discord bağlantısı kapatılamadı', error);
        }
    }
    async startPresenceUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }
        await this.updatePresence();
        this.updateInterval = setInterval(() => this.updatePresence(), CONFIG.UPDATE_INTERVAL);
    }
    async stopPresenceUpdates() {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }
    async updatePresence() {
        try {
            const currentActivity = {
                ...CONFIG.DEFAULT_ACTIVITY,
                startTimestamp: Date.now(),
            };
            if (this.shouldUpdateActivity(currentActivity)) {
                console.log('Durum güncelleniyor:', currentActivity);
                await this.rpc.setActivity(currentActivity);
                this.lastActivity = currentActivity;
                console.log('Durum güncellendi');
            }
        }
        catch (error) {
            throw new DiscordPresenceError('Durum güncellenemedi', error);
        }
    }
    shouldUpdateActivity(newActivity) {
        return JSON.stringify(newActivity) !== JSON.stringify(this.lastActivity);
    }
}
exports.DiscordPresencePlugin = DiscordPresencePlugin;
exports.default = DiscordPresencePlugin;
