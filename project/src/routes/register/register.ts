import { insertDocument } from '$lib/apiRequests';
import { hashCode } from '$lib/scripts/validateUserDetails';
import type { ToastStore } from '@skeletonlabs/skeleton';
import Cookies from 'js-cookie';

/**
 * Gets user information, verifies the data and sends it to User database if valid.
 * @param email The users email
 * @param username The users username
 * @param password The users password
 * @param toastStore The apps toastStore
 * @author Christian-Frederick Cubos - zlac145@live.rhul.ac.uk
 */
export function registerUser(
	username: string,
	email: string,
	password: string,
	toastStore: ToastStore
) {
	let role = 'viewer';

	if (username && password && email) {
		var passwordHash = hashCode(password);
		var userObj = { username: username, passwordHash: passwordHash, email: email, role: role };

		const data = new FormData();
		data.append('newData', JSON.stringify(userObj));

		insertDocument('User', data)
			.then((response) => {
				console.log(response);
				Cookies.set('savedLogin-username', username, { expires: 70 });
				Cookies.set('savedLogin-email', email, { expires: 70 });
				Cookies.set('savedLogin-password', '' + passwordHash, { expires: 70 });
				Cookies.set('savedLogin-role', '' + role, { expires: 70 });
				toastStore.trigger({
					message: 'Account created',
					background: 'variant-ghost-success',
					timeout: 3000
				});
				window.location.href = '../home';
			})
			.catch((error) => {
				console.error('Registering user error: ', error);
			});
	}
}
