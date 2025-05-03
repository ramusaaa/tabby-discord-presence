import { Client } from 'discord-rpc';

interface TabbyPlugin {
    activate(): Promise<void>;
    deactivate(): Promise<void>;
}

interface DiscordActivity {
    details: string;
    state: string;
    largeImageKey: string;
    largeImageText: string;
    smallImageKey: string;
    smallImageText: string;
    startTimestamp: number;
    instance: boolean;
}

const CONFIG = {
    CLIENT_ID: '1115310660818047208',
    UPDATE_INTERVAL: 15000,
    DEFAULT_ACTIVITY: {
        details: 'Using Tabby Terminal',
        state: 'Coding',
        largeImageKey: 'tabby',
        largeImageText: 'Tabby Terminal',
        smallImageKey: 'coding',
        smallImageText: 'Coding',
        instance: false,
    } as const,
} as const;

class DiscordPresenceError extends Error {
    constructor(message: string, public readonly originalError?: unknown) {
        super(message);
        this.name = 'DiscordPresenceError';
    }
}

export class DiscordPresencePlugin implements TabbyPlugin {
    private rpc: Client;
    private updateInterval: NodeJS.Timeout | null = null;
    private lastActivity: DiscordActivity | null = null;

    constructor() {
        this.rpc = new Client({ transport: 'ipc' });
    }

    async activate(): Promise<void> {
        try {
            console.log('Discord RPC başlatılıyor...');
            
            await this.connect();
            await this.startPresenceUpdates();
            
            console.log('Discord Rich Presence aktif!');
        } catch (error) {
            throw new DiscordPresenceError('Discord bağlantısı başlatılamadı', error);
        }
    }

    async deactivate(): Promise<void> {
        try {
            await this.stopPresenceUpdates();
            await this.disconnect();
            
            console.log('Discord Rich Presence devre dışı!');
        } catch (error) {
            throw new DiscordPresenceError('Discord bağlantısı kapatılamadı', error);
        }
    }

    private async connect(): Promise<void> {
        try {
            await this.rpc.login({ clientId: CONFIG.CLIENT_ID });
        } catch (error) {
            throw new DiscordPresenceError('Discord\'a bağlanılamadı', error);
        }
    }

    private async disconnect(): Promise<void> {
        try {
            await this.rpc.destroy();
        } catch (error) {
            throw new DiscordPresenceError('Discord bağlantısı kapatılamadı', error);
        }
    }

    private async startPresenceUpdates(): Promise<void> {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
        }

        await this.updatePresence();
        
        this.updateInterval = setInterval(
            () => this.updatePresence(),
            CONFIG.UPDATE_INTERVAL
        );
    }

    private async stopPresenceUpdates(): Promise<void> {
        if (this.updateInterval) {
            clearInterval(this.updateInterval);
            this.updateInterval = null;
        }
    }

    private async updatePresence(): Promise<void> {
        try {
            const currentActivity: DiscordActivity = {
                ...CONFIG.DEFAULT_ACTIVITY,
                startTimestamp: Date.now(),
            };

            if (this.shouldUpdateActivity(currentActivity)) {
                console.log('Durum güncelleniyor:', currentActivity);
                await this.rpc.setActivity(currentActivity);
                this.lastActivity = currentActivity;
                console.log('Durum güncellendi');
            }
        } catch (error) {
            throw new DiscordPresenceError('Durum güncellenemedi', error);
        }
    }

    private shouldUpdateActivity(newActivity: DiscordActivity): boolean {
        return JSON.stringify(newActivity) !== JSON.stringify(this.lastActivity);
    }
}

export default DiscordPresencePlugin; 