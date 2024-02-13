//@ts-ignore
import { browser } from '$app/environment'; //Does work
import { onMount } from 'svelte';

import { fetchDocuments } from '../api/apiRequests';

export function injectAssetDivs() {
	onMount(() => {
		if (browser) {
			fetchDocuments('Asset').then((assetDocuments) => {
				const typesContainer = document.getElementsByClassName('assetsContainer')[0];
				for (let i of assetDocuments) {
					var child = document.createElement('someuniquetag');
					child.innerHTML =
						'<div class="card assetCard variant-ghost-surface" style="padding: 10px; margin: 10px;"><pre>' +
						i.assetName +
						'<br /><br />Link: ' +
						i.assetLink +
						'<br /><br />Type: ' +
						i.assetType +
						'<br /><br />Metadata: ' +
						JSON.stringify(i.metadataFields, null, '\n') +
						'</pre></div>';

					typesContainer.appendChild(child);

					child.outerHTML = child.outerHTML.replace(/<\/?someuniquetag>/, '');
				}
			});
		}
	});
}
