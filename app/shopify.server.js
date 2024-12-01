import '@shopify/shopify-app-remix/adapters/node';
import { ApiVersion, AppDistribution, shopifyApp } from '@shopify/shopify-app-remix/server';
import { PrismaSessionStorage } from '@shopify/shopify-app-session-storage-prisma';
import { restResources } from '@shopify/shopify-api/rest/admin/2024-10';
import prisma from './db.server';

console.log('🟢 Shopify server.js');

// log all environment variables used in this file

const envVariables = [
	{ name: 'SHOPIFY_API_KEY', message: '🔑 Shopify API Key' },
	{ name: 'SHOPIFY_API_SECRET', message: '🔒 Shopify API Secret' },
	{ name: 'SCOPES', message: '📜 Scopes' },
	{ name: 'SHOPIFY_APP_URL', message: '🌐 Shopify App URL' },
	{ name: 'SHOP_CUSTOM_DOMAIN', message: '🏠 Shop Custom Domain' },
];

envVariables.forEach((envVar) => {
	console.log(`${envVar.message}: ${process.env[envVar.name]}`);
});

const shopify = shopifyApp({
	apiKey: process.env.SHOPIFY_API_KEY,
	apiSecretKey: process.env.SHOPIFY_API_SECRET || '',
	apiVersion: ApiVersion.October24,
	scopes: process.env.SCOPES?.split(','),
	// appUrl: process.env.SHOPIFY_APP_URL || '',
	appUrl: 'https://565f-2604-3d08-4e82-a500-4cc3-afca-b09c-e2be.ngrok-free.app',
	authPathPrefix: '/auth',
	sessionStorage: new PrismaSessionStorage(prisma),
	distribution: AppDistribution.AppStore,
	restResources,
	isEmbeddedApp: false,
	future: {
		unstable_newEmbeddedAuthStrategy: true,
	},
	...(process.env.SHOP_CUSTOM_DOMAIN ? { customShopDomains: [process.env.SHOP_CUSTOM_DOMAIN] } : {}),
});

console.log('🎉 SSSSShopify:', shopify);

export default shopify;
export const apiVersion = ApiVersion.October24;
export const addDocumentResponseHeaders = shopify.addDocumentResponseHeaders;
export const authenticate = shopify.authenticate;
export const unauthenticated = shopify.unauthenticated;
export const login = shopify.login;
export const registerWebhooks = shopify.registerWebhooks;
export const sessionStorage = shopify.sessionStorage;
