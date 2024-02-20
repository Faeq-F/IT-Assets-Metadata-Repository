import { fetchDocuments } from '../api/apiRequests';
import { deleteAssetType } from './deleteType';

export async function injectTypeDivs(): Promise<boolean> {
	return fetchDocuments('AssetType').then((assetTypeDocuments) => {
		const typesContainer = document.getElementsByClassName('typesContainer')[0];
		typesContainer.innerHTML = '';
		if (assetTypeDocuments.length > 0) {
			for (let i of assetTypeDocuments) {
				let temp =
					'<div data-assettypeid="' +
					i._id +
					'" style="z-index:1;position: relative;padding:10px;border-radius:5px;background-color: #ffffff; box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,rgba(0, 0, 0, 0.3) 0px 1px 3px -1px; margin: 10px;" style="padding: 20px; margin: 10px;"><div class="h3" style="margin:10px; font-weight: bold;">' +
					i.typeName +
					'</div><button style="padding: 7px;border-radius:5px;position: absolute; top:10%; right: 5%; box-shadow:rgba(50, 50, 93, 0.25) 0px 2px 5px -1px, rgba(0, 0, 0, 0.3) 0px 1px 3px -1px;"><i class="fa-solid fa-trash text-sm"></i></button><div style="margin: 10px; font-weight: 500">Fields required:</div><ul>';

				for (let j of i.metadataFields) {
					temp +=
						"<li style='margin-top:5px;margin-left:20px;'>⦿ " +
						j.field +
						`<span class='badge card assetCard variant-ghost-surface' style='margin-left: 5px;padding: 2px 5px;'>${j.dataType}</span>`;

					if (j.list) {
						temp +=
							"<span class='badge card assetCard variant-ghost-surface' style='margin-left: 5px;padding: 2px 5px;'>Multi-value</span>";
					}

					temp += '</li>';
				}
				temp += '</ul></div>';

				var child = document.createElement('someuniquetag');
				child.innerHTML = temp;
				typesContainer.appendChild(child);
				child.outerHTML = child.outerHTML.replace(/<\/?someuniquetag>/, '');
			}

			addDeleteHandlers();
			return true;
		}
		return false;
	});
}

function addDeleteHandlers() {
	const typesContainer = document.getElementsByClassName('typesContainer')[0];
	let types = typesContainer.getElementsByTagName('DIV');
	for (let i of types) {
		let buttons = i.getElementsByTagName('BUTTON');
		if (buttons.length > 0) {
			let deleteButton = buttons[0];
			let typeID = (deleteButton.parentElement as HTMLDivElement).dataset.assettypeid;
			deleteButton.addEventListener('click', function () {
				deleteAssetType(typeID);
			});
		}
	}
}
