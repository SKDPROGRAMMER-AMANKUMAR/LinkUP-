import { Client ,Databases,Account} from 'appwrite';

export const PROJECT_ID = '676057db002713ca469f'
export const DATABASE_ID = '67605cc9000a28b48084'
export const COLLECTION_ID = '67605ce500151cd691b6'

const client = new Client();

client
     .setEndpoint('https://cloud.appwrite.io/v1')
     .setProject('676057db002713ca469f');

export const databases = new Databases(client);
export const account = new Account(client);

export default client;     