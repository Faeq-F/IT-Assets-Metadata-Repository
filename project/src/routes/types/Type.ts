import { deleteDocument } from '$lib/apiRequests';

export async function deleteAssetType(
	toastStore: { trigger: (arg0: { message: string; background: string; timeout: number }) => void },
	id: string
) {
	await deleteDocument('AssetType', id);
	toastStore.trigger({
		message: 'Asset Type deleted',
		background: 'variant-ghost-success',
		timeout: 3000
	});
	// Refresh the page
	location.reload();
}
