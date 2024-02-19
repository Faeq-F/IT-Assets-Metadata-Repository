import { fetchDocuments } from '../api/apiRequests';

export function injectAssetDivs(): Promise<boolean> {
	return fetchDocuments('Asset').then((assetDocuments) => {
		const assetsContainer = document.getElementsByClassName('assetsContainer')[0];
		assetsContainer.innerHTML = '';
		if (assetDocuments.length > 0) {
			for (let i of assetDocuments) {
				var child = document.createElement('someuniquetag');
				child.innerHTML =
					'<div style="z-index:1;position: relative;padding:10px;border-radius:5px;background-color: #ffffff; box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,rgba(0, 0, 0, 0.3) 0px 1px 3px -1px; margin: 10px;" style="padding: 20px; margin: 10px;" data-stringifiedjson=\''+ JSON.stringify(i) +'\' class="card assetCard variant-ghost-surface" style="padding: 10px; margin: 10px;">' +
					i.assetName +
					'Link: ' +
					i.assetLink +
					'Type: ' +
					i.assetType +
					'Metadata: ' +
					JSON.stringify(i.metadataFields, null, '\n') +
					'</div>';

				assetsContainer.appendChild(child);

				child.outerHTML = child.outerHTML.replace(/<\/?someuniquetag>/, '');
			}
			injectDivStyles();
			return true;
		}
		return false;
	});
}

export function injectDivStyles() {
	const assetsContainer = document.getElementsByClassName('assetsContainer')[0];
	for (let i of assetsContainer.getElementsByTagName('DIV')) {
		console.log(i);
	}
}