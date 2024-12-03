import '@shopify/shopify-app-remix/adapters/node';
import { ApiVersion, AppDistribution, shopifyApp } from '@shopify/shopify-app-remix/server';
import { PrismaSessionStorage } from '@shopify/shopify-app-session-storage-prisma';
import { restResources } from '@shopify/shopify-api/rest/admin/2024-10';
import prisma from './db.server';

console.log('🚀 Starting server...');
console.log('🔐 Shopify API Key:', process.env.SHOPIFY_API_KEY);
console.log('🔑 Shopify API Secret:', process.env.SHOPIFY_API_SECRET);
console.log('🔗 Shopify App URL:', process.env.SHOPIFY_APP_URL);

const shopify = shopifyApp({
	apiKey: process.env.SHOPIFY_API_KEY,
	apiSecretKey: process.env.SHOPIFY_API_SECRET || '',
	apiVersion: ApiVersion.October24,
	scopes: process.env.SCOPES?.split(','),
	appUrl: process.env.SHOPIFY_APP_URL || '',
	// appUrl: 'https://cbd3-2604-3d08-4e82-a500-f884-c95-d7-f794.ngrok-free.app/',
	authPathPrefix: '/auth',
	sessionStorage: new PrismaSessionStorage(prisma),
	distribution: AppDistribution.AppStore,
	restResources,
	isEmbeddedApp: false,
	future: {
		unstable_newEmbeddedAuthStrategy: false,
	},
	...(process.env.SHOP_CUSTOM_DOMAIN ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] } : {}),
});

console.log('🔌 Shopify Auth:', shopify.authenticate.admin);

export default shopify;
export const apiVersion = ApiVersion.October24;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
