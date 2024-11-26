// State Management
export async function generateState(): Promise<string> {
	const timestamp = Date.now().toString();
	const randomString = Math.random().toString(36).substring(2);

	return timestamp + randomString;
}

// Nonce Sense
export async function generateNonce(length: number) {
	const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
	let nonce = '';

	for (let i = 0; i < length; i++) {
		const randomIndex = Math.floor(Math.random() * characters.length);
		nonce += characters.charAt(randomIndex);
	}

	return nonce;
}

export async function getNonce(token: string) {
	return decodeJwt(token).payload.nonce;
}

export function decodeJwt(token: string) {
	const [header, payload, signature] = token.split('.');

	const decodedHeader = JSON.parse(atob(header));
	const decodedPayload = JSON.parse(atob(payload));

	return {
		header: decodedHeader,
		payload: decodedPayload,
		signature,
	};
}

// Authorization Header
export async function headerCredentials(): Promise<string> {
	const clientId = process.env.SHOPIFY_API_KEY;
	const clientSecret = process.env.SHOPIFY_API_SECRET;
	const credentials = btoa(`${clientId}:${clientSecret}`);

	return credentials;
}
