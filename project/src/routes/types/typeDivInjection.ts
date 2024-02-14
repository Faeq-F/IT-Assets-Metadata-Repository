import { fetchDocuments } from '../api/apiRequests';

export async function injectTypeDivs():Promise<boolean> {
	return fetchDocuments('AssetType').then((assetTypeDocuments) => {
		const typesContainer = document.getElementsByClassName('typesContainer')[0];
		typesContainer.innerHTML = "";
		if (assetTypeDocuments.length > 0) {
			for (let i of assetTypeDocuments) {
				var child = document.createElement('someuniquetag');
				child.innerHTML =
					'<div class="card assetCard variant-ghost-surface" style="padding: 10px; margin: 10px;">' +
					i.typeName +
					'<br /><br />Fields required: ' +
					JSON.stringify(i.metadataFields) +
					'</div>';

				typesContainer.appendChild(child);

				child.outerHTML = child.outerHTML.replace(/<\/?someuniquetag>/, '');
			}
			return true;
		}
		return false;
	});

}