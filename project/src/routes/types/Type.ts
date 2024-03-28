import { deleteDocument } from '$lib/apiRequests';
import type { ToastStore } from '@skeletonlabs/skeleton';

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
