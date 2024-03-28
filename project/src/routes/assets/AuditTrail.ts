import Update from '$lib/components/cards/auditTrail/Update.svelte';
import Add from '$lib/components/cards/auditTrail/Add.svelte';
import Remove from '$lib/components/cards/auditTrail/Remove.svelte';
import { fetchDocumentByID } from '$lib/apiRequests';

/**
 *
 * @param diff
 * @author Shurjeel Mahmood - zltm723@live.rhul.ac.uk
 */
export async function parseDiff(diff: any) {
	for (const item of diff) {
		if (item.changes && Array.isArray(item.changes)) {
			await parseChanges(item.changes);
		} else {
			await displayTrailComponent(item.type, item.key, item.value, item.oldValue);
		}
	}
}

/**
 *
 * @param changes
 * @author Shurjeel Mahmood - zltm723@live.rhul.ac.uk
 */
async function parseChanges(changes: any) {
	for (const change of changes) {
		if (change.changes && Array.isArray(change.changes)) {
			await parseChanges(change.changes);
		} else {
			await displayTrailComponent(change.type, change.key, change.value, change.oldValue);
		}
	}
}


// this function is used to display each entry in the audit log for the asset
/**
 *
 * @param type
 * @param key
 * @param value
 * @param oldValue
 * @author Faeq Faisal - faeqfaisal@hotmail.co.uk & zlac318@live.rhul.ac.uk
 */
export async function displayTrailComponent(
	type: string,
	key: string,
	value: string,
	oldValue: string | undefined
) {
	if (('' + value).startsWith('DOCUMENT-ID: ')) {
		await fetchDocumentByID(value.replace('DOCUMENT-ID: ', '')).then(async (doc) => {
			value = '*Deleted item*';
			if (doc.assetName) value = doc.assetName;
			else if (doc.username) value = doc.username;
		});
	}
	if (oldValue != undefined && (oldValue + '').startsWith('DOCUMENT-ID: ')) {
		await fetchDocumentByID(oldValue.replace('DOCUMENT-ID: ', '')).then(async (doc) => {
			value = '*Deleted item*';
			if (doc.assetName) oldValue = doc.assetName;
			else if (doc.username) oldValue = doc.username;
		});
	}
	// this is the code for displaying the update component of the audit trail of the asset
	if (type == 'UPDATE') {
		new Update({
			target: document.querySelector('#auditTrailDiv') as HTMLDivElement,
			props: {
				key: key,
				newValue: value,
				oldValue: oldValue
			}
		});
		// this is the code for displaying the add component of the audit trail of the asset
	} else if (type == 'ADD') {
		new Add({
			target: document.querySelector('#auditTrailDiv') as HTMLDivElement,
			props: {
				key: key,
				newValue: value
			}
		});
		// this is the code for displaying the remove component of the audit trail of the asset
	} else {
		new Remove({
			target: document.querySelector('#auditTrailDiv') as HTMLDivElement,
			props: {
				key: key,
				value: value
			}
		});
	}
}
