import Cookies from 'js-cookie';
import { fetchDocuments } from '../apiRequests';

// Reads cookies and checks if they exist and if they matchup with the User collection
export async function redirectWhenLoginSaved() {
	if (
		(Cookies.get('savedLogin-username') != undefined ||
			Cookies.get('savedLogin-email') != undefined) &&
		Cookies.get('savedLogin-password') != undefined
	) {
		await fetchDocuments('User').then((users) => {
			for (let i of users) {
				if (
					i.username === Cookies.get('savedLogin-username') &&
					String(i.passwordHash) === Cookies.get('savedLogin-password') &&
					i.role === Cookies.get('savedLogin-role')
				) {
					window.location.href = '/home';
					break;
				}
			}
		});
	}
}

// reads cookies and checks if they exist
export async function redirectWhenNotLoggedIn() {
	if (
		Cookies.get('savedLogin-username') == undefined ||
		Cookies.get('savedLogin-role') == undefined ||
		Cookies.get('savedLogin-password') == undefined
	) {
		window.location.href = '/';
	}
}
