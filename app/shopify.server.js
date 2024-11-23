import '@shopify/shopify-app-remix/adapters/node';
import { ApiVersion, AppDistribution, shopifyApp } from '@shopify/shopify-app-remix/server';
import { PrismaSessionStorage } from '@shopify/shopify-app-session-storage-prisma';
import { restResources } from '@shopify/shopify-api/rest/admin/2024-07';
import prisma from './db.server';

// console.log all of the env variables used here, lead with lady beetle emoji
console.log('🐞 Shopify API Key:', process.env.SHOPIFY_API_KEY);
console.log('🐞 Shopify API Secret:', process.env.SHOPIFY_API_SECRET);
console.log('🐞 Shopify App URL:', process.env.SHOPIFY_APP_URL);
console.log('🐞 Shopify Custom Domain:', process.env.SHOP_CUSTOM_DOMAIN);
console.log('🐞 Shopify Scopes:', process.env.SCOPES);

const shopify = shopifyApp({
	apiKey: process.env.SHOPIFY_API_KEY,
	apiSecretKey: process.env.SHOPIFY_API_SECRET || '',
	apiVersion: ApiVersion.October24,
	scopes: process.env.SCOPES?.split(','),
	appUrl: process.env.SHOPIFY_APP_URL || '',
	authPathPrefix: '/dashboard',
	returnTo: '/dashboard',
	sessionStorage: new PrismaSessionStorage(prisma),
	distribution: AppDistribution.AppStore,
	restResources,
	future: {
		unstable_newEmbeddedAuthStrategy: true,
	},
	...(process.env.SHOP_CUSTOM_DOMAIN ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] } : {}),
});

export default shopify;
console.log('🐞 Shopify:', shopify);
export const apiVersion = ApiVersion.October24;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
console.log('🐞 Authenticate:', authenticate);
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
