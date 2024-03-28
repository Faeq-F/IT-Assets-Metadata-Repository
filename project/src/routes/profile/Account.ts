import { deleteDocument, fetchDocuments } from "$lib/apiRequests";
import { redirectWhenNotLoggedIn } from "$lib/scripts/pageAccess";
import type { ToastStore } from "@skeletonlabs/skeleton";
import Cookies from 'js-cookie';

/**
 * Deletes the currently logged in user from the database and removes the saved user cookies
 * @param toastStore The apps toastStore
 */
	export function deleteAccount(toastStore:ToastStore) {
		// this if statement asks the user to confirm if they want to delete their account
		if (confirm('Are you sure you want to delete your account?')) {
			fetchDocuments('User').then((Users) => {
				// this for loop iterates through all the users
				for (let i of Users) {
					/*
					*  this if statement compares the username of user i with
					 * the username saved in the cookies
					*/
					if (i.username == Cookies.get('savedLogin-username')) {
						/*
						*this deletes the user and changes the page to display a relevant message
						*then logs the user out so they go back to the login page.
						*/
						deleteDocument('User', i._id).then(() => {
							toastStore.trigger({
								message: 'Account deleted',
								background: 'variant-ghost-success',
								timeout: 3000
							});

							logOut();
						});
					}
				}
			});
		}
	}

	/**
	 * Logs the user out of their account by deleting the user cookies
	 */
	export function logOut() {
		Cookies.remove('savedLogin-username');
		Cookies.remove('savedLogin-email');
		Cookies.remove('savedLogin-password');
		Cookies.remove('savedLogin-role');
		redirectWhenNotLoggedIn();
	}