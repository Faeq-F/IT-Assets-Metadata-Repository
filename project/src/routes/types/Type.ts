import { deleteDocument } from '$lib/apiRequests';
import type { ToastStore } from '@skeletonlabs/skeleton';

/**
 * Deletes an Asset Type from the database
 * @param toastStore The apps toastStore
 * @param id The _id of the Type to be deleted
 */
export async function deleteAssetType(toastStore: ToastStore, id: string) {
	await deleteDocument('AssetType', id);
	toastStore.trigger({
		message: 'Asset Type deleted',
		background: 'variant-ghost-success',
		timeout: 3000
	});
	// Refresh the page
	location.reload();
}
