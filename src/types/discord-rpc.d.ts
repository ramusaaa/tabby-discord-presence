declare module 'discord-rpc' {
    export interface ClientOptions {
        transport: 'ipc';
    }

    export interface LoginOptions {
        clientId: string;
    }

    export interface Activity {
        details?: string;
        state?: string;
        largeImageKey?: string;
        largeImageText?: string;
        smallImageKey?: string;
        smallImageText?: string;
        startTimestamp?: number;
        instance?: boolean;
    }

    export class Client {
        constructor(options: ClientOptions);
        login(options: LoginOptions): Promise<void>;
        setActivity(activity: Activity): Promise<void>;
        destroy(): Promise<void>;
    }
} 