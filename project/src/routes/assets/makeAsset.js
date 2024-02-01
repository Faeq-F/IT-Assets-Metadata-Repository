import { browser } from '$app/environment';
import { onMount } from 'svelte';

export function addTypeOptions() {
	onMount(() => {
		if (browser) {
			var typeList = document.getElementById('assetType');
			for (const [key, value] of Object.entries(window.localStorage)) {
				if (key.startsWith('Type_')) {
					var child = document.createElement('someuniquetag');

					child.innerHTML = '<option>' + key.replace('Type_', '') + '</option>';

					if (typeList) typeList.appendChild(child);

					child.outerHTML = child.outerHTML.replace(/<\/?someuniquetag>/, '');

					console.log(key.replace('Type_', ''));
				}
			}
		}
	});
}

// function myFunction() {
// 	var x = document.getElementById('mySelect');
// 	var option = document.createElement('option');
// 	option.text = 'Kiwi';
// 	x.add(option, x[0]);
// }
