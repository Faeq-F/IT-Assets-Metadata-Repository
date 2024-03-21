import Cookies from 'js-cookie';
import { fetchDocuments } from '../apiRequests';

// const username = Cookies.get('savedLogin-username');
// const role = Cookies.get('savedLogin-role');

export async function redirectWhenLoginSaved() {
	if (
		(Cookies.get('savedLogin-username') != undefined ||
			Cookies.get('savedLogin-email') != undefined) &&
		Cookies.get('savedLogin-password') != undefined
	){
		await fetchDocuments('User').then((users) => {
			for (let i of users) {
				if (i.username === Cookies.get('savedLogin-username') && String(i.passwordHash) === Cookies.get('savedLogin-password') && i.role === Cookies.get('savedLogin-role')) {
					window.location.href = '/home';
				}
			}
		})
	} 

}

export async function redirectWhenNotLoggedIn() {
	if (
		(Cookies.get('savedLogin-username') == undefined ||
			Cookies.get('savedLogin-email') == undefined) &&
		Cookies.get('savedLogin-password') == undefined
	) {
		await fetchDocuments('User').then((users) => {
			for (let i of users) {
				if (i.username != Cookies.get('savedLogin-username') && String(i.passwordHash) != Cookies.get('savedLogin-password') && i.role != Cookies.get('savedLogin-role')) {
					window.location.href = '/';
				}
			}
		})
	}
}

/**
 * Gets cookie information and verifies whether it matches with database collection
 *
 * @param {*} username username stored in cookie
 * @param {*} password password stored in cookie
 * @param {*} role role stored in cookie
 * @return {*} true if cookie information matches database. False otherwise
*/
async function validCookie(username: any, password: any, role: any) {
	// console.log(username)
	// console.log(password)
	// console.log(role)
	await fetchDocuments('User').then((users) => {
		for (let i of users) {
			// console.log(i)
			if (i.username === username && i.passwordHash === password && i.role === role) {
				return true;
				// console.log(valid);
			}
		}
	})
	return false;
}
