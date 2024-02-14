import { fetchDocuments } from '../api/apiRequests';

export async function injectTypeDivs():Promise<boolean> {
	return fetchDocuments('AssetType').then((assetTypeDocuments) => {
		const typesContainer = document.getElementsByClassName('typesContainer')[0];
		typesContainer.innerHTML = "";
		if (assetTypeDocuments.length > 0) {
			for (let i of assetTypeDocuments) {
				let temp = '<div style="padding:10px;border-radius:5px;background-color: #ffffff; box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,rgba(0, 0, 0, 0.3) 0px 1px 3px -1px; margin: 10px;" style="padding: 20px; margin: 10px;"><div class="h3" style="margin:10px; font-weight: bold;">' +
					i.typeName +
					'</div><div style="margin: 10px; font-weight: 500">Fields required:</div><ul>';

				for (let j of i.metadataFields) {
					temp += "<li style='margin-top:5px;'>" + j.field+`<span class='card assetCard variant-ghost-surface' style='margin-left: 5px;padding: 2px 5px;'>${j.dataType}</span>`;

					if (j.list) {
						temp+="<span class='card assetCard variant-ghost-surface' style='margin-left: 5px;padding: 2px 5px;'>Multi-value (Listable)</span>"
					}

					temp+="</li>"
				}
				temp += "</ul></div>"

				var child = document.createElement('someuniquetag');
				child.innerHTML = temp;
				typesContainer.appendChild(child);
				child.outerHTML = child.outerHTML.replace(/<\/?someuniquetag>/, '');
			}
			return true;
		}
		return false;
	});

}



//card assetCard variant-ghost-surface
//padding:5px;border-radius:5px;background-color: #ffffff; box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;