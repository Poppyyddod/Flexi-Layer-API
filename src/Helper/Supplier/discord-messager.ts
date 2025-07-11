import axios from 'axios';
import { loadEnvConfig } from '@Configs/env';

const RAW_ENV = loadEnvConfig();

const GetDiscordChannel = (channelName: string): string => {
    if (channelName === "new_client") return RAW_ENV.DISCORD_CHANNEL_NEW_CLIENT;
    if (channelName === "new_order") return RAW_ENV.DISCORD_CHANNEL_NEW_ORDER;
    if (channelName === "status_changed") return RAW_ENV.DISCORD_CHANNEL_STATUS_CHANGED;
    if (channelName === "dispute_raised") return RAW_ENV.DISCORD_CHANNEL_DISPUTE_RAISED;
    if (channelName === "server_error") return RAW_ENV.DISCORD_CHANNEL_SERVER_ERROR;

    return "not found channel!";
}

type MappingFeatureType = 'signup' | 'order' | 'edit' | 'dispute' | 'error';

const MappingFeature = (feature: MappingFeatureType) => {
    switch (feature) {
        case 'signup':
            return 'new_client';
        case 'order':
            return 'new_order';
        case 'edit':
            return 'status_changed';
        case 'dispute':
            return 'dispute_raised';
        case 'error':
            return 'server_error';
        default:
            return 'not found feature!';
    }
}

export const sendDiscordWebhook = async (feature: MappingFeatureType, message: string) => {
    console.log('📡 [sendDiscordWebhook] Called with:', feature, message);

    try {
        const mappedFeature = MappingFeature(feature);
        console.log('🎯 Mapped Feature:', mappedFeature);

        const mappedChannel = GetDiscordChannel(mappedFeature);
        // console.log('🔗 Webhook URL:', mappedChannel);

        const response = await axios.post(mappedChannel, {
            content: message,
        });

        console.log(`✅ Message sent to Discord with status ${response.status}`);
    } catch (error: any) {
        if (error.response) {
            console.error('❌ Discord API error:', error.response.data);
        } else {
            console.error('❌ Unknown error:', error.message);
        }
    }
};
