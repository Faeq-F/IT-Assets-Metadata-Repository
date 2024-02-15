<script lang="ts">
	import { addTypeOptions } from './makeAssetUI';

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	import { insertDocument } from '../api/apiRequests';
	import { injectAssetDivs } from './assetDivInjection';
	import { filterAssets } from './keywordSearch';

	function makeAsset() {
		var name = (document.getElementById('assetName') as HTMLInputElement).value;
		var link = (document.getElementById('assetLink') as HTMLInputElement).value;
		let typeList = document.getElementById('assetType') as HTMLSelectElement;
		var type = typeList.options[typeList.selectedIndex].text;
		if (name == '') {
			toastStore.trigger({
				message: 'Please give the asset a name',
				background: 'variant-ghost-error',
				timeout: 3000
			});
			return;
		} else if (link == '') {
			toastStore.trigger({
				message: 'Please give the asset a link',
				background: 'variant-ghost-error',
				timeout: 3000
			});
			return;
		} else if (type == 'Select type') {
			toastStore.trigger({
				message: 'Please give the asset a type',
				background: 'variant-ghost-error',
				timeout: 3000
			});
			return;
		}
		var metadataForm = document.getElementById('metadataForm') as HTMLFormElement;

		let metadataInputs = metadataForm.getElementsByTagName('input');
		var metadataObject = {};
		for (let i of metadataInputs) {
			let key = i.id;
			let value;
			if (key.endsWith('-ListIDaddon')) {
				key = key.substring(0, key.length - 12);
				value = i.value.split(', ');
				let newArr: number[] = [];
				if (key.endsWith('-Number')) {
					key = key.substring(0, key.length - 7);
					for (let i in value) {
						newArr[i] = parseInt(value[i]);
					}
					value = newArr;
				} else if (key.endsWith('-Text')) {
					key = key.substring(0, key.length - 5);
				}
			} else {
				value = i.value;
			}
			metadataObject = { ...metadataObject, [key]: value };
		}

		var assetObject = {
			assetName: name,
			assetLink: link,
			assetType: type,
			metadataFields: metadataObject
		};
		const data = new FormData();
		data.append('newData', JSON.stringify(assetObject));
		insertDocument('Asset', data).then((response) => {
			console.log(response);
		});

		toastStore.trigger({
			message: 'Asset created',
			background: 'variant-ghost-success',
			timeout: 3000
		});
		injectAssetDivs();
		filterAssets();
	}

	addTypeOptions();
</script>

<div class="makeAssets card w-72 p-4 shadow-xl" data-popup="makeAssetPopup" id="makeAssetPopup">
	<div class="Card">
		<header class="h2">Make an Asset</header>
		<br /><br />
		<form id="rootCreateAssetForm">
			<label for="assetName" class="formlabel">
				<p>Asset Name:</p>
				<input
					type="text"
					id="assetName"
					name="assetName"
					placeholder="Enter Asset Name"
					data-focusindex="0"
					class="input w-96"
				/>
			</label><br />

			<label for="assetLink" class="formlabel">
				<p>Asset Link:</p>
				<input
					type="text"
					id="assetLink"
					name="assetLink"
					placeholder="Enter the link to the Asset"
					data-focusindex="0"
					class="input w-96"
				/>
			</label><br />

			<label for="assetType" class="formlabel">
				<p>Asset Type:</p>

				<select id="assetType" class="select w-96">
					<option>Select type</option>
				</select>
			</label>

			<br />
			<form id="metadataForm"></form>
			<button class="variant-filled-primary btn w-52" id="assetMaker" on:click={makeAsset}>
				Make Asset</button
			>
		</form>
	</div>
</div>

<style>
	@import url('$lib/styles/card.css');
	@import url('$lib/styles/makeModal.css');

	#makeAssetPopup {
		position: absolute;
		top: 50% !important;
		left: 50% !important;
		transform: translate(-50%, -50%);
		width: 50vw;
		height: 60vh;
	}

	#metadataForm {
		position: initial;
		transform: initial;
	}

	#rootCreateAssetForm {
		height: 75%;
		overflow-y: scroll;
	}
</style>
