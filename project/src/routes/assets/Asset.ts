import { deleteDocument, fetchDocuments } from "$lib/apiRequests";

/**
 * Sends a request to the database API to delete the asset and its corresponding audit trail
 * @param id the _id of the document to delete
 * @param toastStore the toastStore for the app. used to show success / error toasts
 * @author Faeq Faisal
 * @email faeqfaisal@hotmail.co.uk
 * @email zlac318@live.rhul.ac.uk
 * @author Christian-Frederick Cubos
 * @email zlac145@live.rhul.ac.uk
 */
	export async function deleteAsset(id:string, toastStore: any) {
		var auditid: string;
		await deleteDocument('Asset', id).then(async () => {
			await fetchDocuments('diff')
				.then((fetchedAudits) => {
					for (let i of fetchedAudits) {
						if (i.reference == id) {
							auditid = i._id;
						}
					}
					console.log(auditid);
					return auditid;
				})
				.then(async (auditid) => {
					await deleteDocument('diff', auditid);
					toastStore.trigger({
						message: 'Asset deleted',
						background: 'variant-ghost-success',
						timeout: 3000
					});
				})
				.catch((err) => {
					return err;
				});
		});
		// Refresh the page
		location.reload();
	}