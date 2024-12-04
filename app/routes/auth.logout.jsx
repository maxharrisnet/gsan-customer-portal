import { destroyUserSession } from '../session.server';

export const action = async ({ request }) => {
	return destroyUserSession(request);
};

export default function Logout() {
	return null;
}
