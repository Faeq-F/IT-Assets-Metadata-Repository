import type { ToastStore } from '@skeletonlabs/skeleton';

/**
 * Creates a toast message that asks the user to "Please fill in all of the fields" with an error background. Timeout = 3000.
 * @param toastStore The apps ToastStore
 * @author Faeq Faisal - faeqfaisal@hotmail.co.uk & zlac318@live.rhul.ac.uk
 */
export function emptyFieldAlert(toastStore: ToastStore) {
	toastStore.trigger({
		message: 'Please fill in all of the fields',
		background: 'variant-ghost-error',
		timeout: 3000
	});
}

/**
 * Creates a toast message that tells the user "You may have to refresh association lists" with a warning background. Timeout = 3000.
 * @param toastStore The apps ToastStore
 * @author Faeq Faisal - faeqfaisal@hotmail.co.uk & zlac318@live.rhul.ac.uk
 */
export function refreshAssociationListsAlert(toastStore: ToastStore) {
	toastStore.trigger({
		message: 'You may have to refresh association lists',
		background: 'variant-ghost-warning',
		timeout: 3000
	});
}
