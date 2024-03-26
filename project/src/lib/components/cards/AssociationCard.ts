import type { ModalComponent } from '@skeletonlabs/skeleton';
import ExpandedAsset from '../../../routes/assets/ExpandedAsset.svelte';
import ExpandedUser from '../../../routes/profile/ExpandedUser.svelte';

/**
 * Produces the relevant expanded Asset / User component as a skeletonUI ModalComponent
 * @param document the document to produce a ModalComponent for
 * @param type the type of the document; "Asset" or "User"
 * @returns the ModalComponent used for the ModalSettings of a Modal showing the document's details
 * @author Faeq Faisal
 * @email faeqfaisal@hotmail.co.uk
 * @email zlac318@live.rhul.ac.uk
 */
export function produceExpandModalComponent(document: any, type: string): ModalComponent {
	if (type == 'Asset') {
		return {
			ref: ExpandedAsset,
			props: {
				id: document._id,
				assetName: document.assetName,
				assetLink: document.assetLink,
				assetType: document.assetType,
				metadataFields: document.metadataFields
			}
		};
	} else {
		return {
			ref: ExpandedUser,
			props: {
				id: document._id,
				username: document.username,
				email: document.email,
				role: document.role
			}
		};
	}
}
