// Code Challenge and Verifier
export async function generateCodeVerifier() {
	const rando = generateRandomCode();
	return base64UrlEncode(rando);
}

export async function generateCodeChallenge(codeVerifier: string) {
	const digestOp = await crypto.subtle.digest({ name: 'SHA-256' }, new TextEncoder().encode(codeVerifier));
	const hash = convertBufferToString(digestOp);
	return base64UrlEncode(hash);
}

function generateRandomCode() {
	const array = new Uint8Array(32);
	crypto.getRandomValues(array);
	return String.fromCharCode.apply(null, Array.from(array));
}

function base64UrlEncode(str: string) {
	const base64 = btoa(str);
	// This is to ensure that the encoding does not have +, /, or = characters in it.
	return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function convertBufferToString(hash: ArrayBuffer) {
	const uintArray = new Uint8Array(hash);
	const numberArray = Array.from(uintArray);
	return String.fromCharCode(...numberArray);
}

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
	const clientId = process.env.CLIENT_ID;
	const clientSecret = process.env.CLIENT_SECRET;
	const credentials = btoa(`${clientId}:${clientSecret}`);

	return credentials;
}
