import { fetchDocuments, updateDocument } from '$lib/apiRequests';
import type { ToastStore } from '@skeletonlabs/skeleton';
import Cookies from 'js-cookie';

/**
 * Changes the roles permissions of register users
 * @param toastStore The apps toastStore
 * @author Thomas Appleby - zlac196@live.rhul.ac.uk
 */
export function updateUserPermissions(toastStore: ToastStore) {
	// gets all select elements on the document
	let selects = document.getElementsByTagName('SELECT');
	// loops through each select element
	for (let i of selects) {
		// fetches the User collection document
		fetchDocuments('User').then((userDocument) => {
			// find the user whose username matches the username in the current select element
			let user = userDocument.find(
				(user: { username: string }) => user.username === (i as HTMLSelectElement).dataset.username
			);
			// get the user's password hash
			let password = user.passwordHash;
			// create a new user object with the new role
			let newUserObject = {
				username: (i as HTMLSelectElement).dataset.username,
				email: (i as HTMLSelectElement).dataset.email,
				role: (i as HTMLSelectElement).value,
				passwordHash: password
			};
			// update saved cookies if the current user is being updated
			if (newUserObject.username == Cookies.get('savedLogin-username')) {
				// update the role, username, email, and password hash in cookies
				Cookies.set('savedLogin-role', '' + newUserObject.role, { expires: 70 });
				Cookies.set('savedLogin-username', '' + newUserObject.username, { expires: 70 });
				Cookies.set('savedLogin-email', '' + newUserObject.email, { expires: 70 });
				Cookies.set('savedLogin-password', '' + newUserObject.passwordHash, { expires: 70 });
			}
			// loop through each user in the document
			for (let i of userDocument) {
				/*
				 * if the username in the document matches the username of the new user object
				 * update user document with the new role
				 */
				if (i.username == newUserObject.username) {
					// create new FormData to send updated data
					const data = new FormData();
					data.append('newData', JSON.stringify(newUserObject));
					// update the User collection with the new data
					updateDocument('User', i._id, data)
						.then((response) => {
							// log response and trigger a notification for successful role change
							console.log(response);
						})
						.catch((error) => {
							// log error if update fails
							console.error('Update user role error', error);
						});
				}
			}
			toastStore.trigger({
				message: 'Roles updated',
				background: 'variant-ghost-success',
				timeout: 3000
			});
		});
	}
}
