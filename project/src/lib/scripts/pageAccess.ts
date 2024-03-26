import Cookies from 'js-cookie';
import { fetchDocuments } from '../apiRequests';

/**
 * Reads the user cookies from the browser, checks them against the database and redirects the user to the home page of the app if they are correct. Used only on the login and register pages.
 * @author Faeq Faisal
 * @email faeqfaisal@hotmail.co.uk
 * @email zlac318@live.rhul.ac.uk
 * @author Christian-Frederick Cubos
 * @email zlac145@live.rhul.ac.uk
 */
export async function redirectWhenLoginSaved(): Promise<void> {
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

/**
 * Reads the user cookies from the browser, checks them against the database and redirects the user to the login page of the app if they are incorrect or non-existent. Runs on every page load of the app.
 * @author Faeq Faisal
 * @email faeqfaisal@hotmail.co.uk
 * @email zlac318@live.rhul.ac.uk
 * @author Christian-Frederick Cubos
 * @email zlac145@live.rhul.ac.uk
 */
export async function redirectWhenNotLoggedIn(): Promise<void> {
	if (
		Cookies.get('savedLogin-username') == undefined ||
		Cookies.get('savedLogin-role') == undefined ||
		Cookies.get('savedLogin-password') == undefined
	) {
		window.location.href = '/';
	}
}
