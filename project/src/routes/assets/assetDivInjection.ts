import { fetchDocuments } from '../api/apiRequests';

export function injectAssetDivs(): Promise<boolean> {
	return fetchDocuments('Asset').then((assetDocuments) => {
		const assetsContainer = document.getElementsByClassName('assetsContainer')[0];
		assetsContainer.innerHTML = '';
		if (assetDocuments.length > 0) {
			for (let i of assetDocuments) {
				var child = document.createElement('someuniquetag');
				let temp =
					'<div id="'+i._id+'" style="z-index:1;position: relative;padding:10px;border-radius:5px;background-color: #ffffff; box-shadow: rgba(50, 50, 93, 0.25) 0px 2px 5px -1px,rgba(0, 0, 0, 0.3) 0px 1px 3px -1px; margin: 10px;" style="padding: 20px; margin: 10px;" data-stringifiedjson=\''+ JSON.stringify(i) +'\' class="card assetCard variant-ghost-surface" style="padding: 10px; margin: 10px;">' +
					'<div class="h3" style="margin:10px; font-weight: bold;margin-bottom:0;">' + i.assetName + '</div>' +
					'<a style="margin: 10px; font-weight: 500 margin-bottom:0;"  class="chip variant-soft hover:variant-filled" href="http://'+i.assetLink+'"><span><i class="fa-solid fa-paperclip"></i></span><span>' + i.assetLink + '</span></a><br>' +
					'<div style="margin: 10px; font-weight: 500; margin-top:0;">Type: ' +i.assetType +'</div><hr><br>'+
					'<div style="margin: 10px; font-weight: 500; margin-top:0;">Metadata:</div>'


				Object.keys(i.metadataFields).forEach(function (key) {
					temp += `<span class="chip variant-filled-tertiary" style="color: white; margin-bottom:10px; margin-left: 10px;">${key}</span>`
					if (Array.isArray(i.metadataFields[key])) {
						temp += `<ul style="margin-bottom: 10px;">`
						for (let j of i.metadataFields[key]) {
							temp += `<li style='margin:5px;margin-left:20px;'>⦿ ${j}</li>`
						}
						temp += "</ul>"
					} else {
						temp += `<span class="" style="margin-left: 10px;">${i.metadataFields[key]}</span><br>`
					}
				})

				temp += '</div>';

				child.innerHTML = temp;
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
		console.log(i.getAttribute("data-stringifiedjson"));
	}
}