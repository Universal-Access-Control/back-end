declare namespace NodeJS {
  export interface ProcessEnv {
    NODE_ENV: 'development' | 'production' | 'test';
    DEBUG: string;
    MQTT_URL: string;
    MQTT_PORT: string;
    MQTT_CLIENT_ID: string;
    MQTT_USERNAME?: string;
    MQTT_PASSWORD?: string;
    MONGODB_URL: string;
  }
}
