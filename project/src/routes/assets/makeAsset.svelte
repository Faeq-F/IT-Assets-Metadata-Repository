<script lang="ts">
	import { addTypeOptions } from './makeAssetUI';

	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	function makeAsset() {
		var name = (document.getElementById('assetName') as HTMLInputElement).value;
		var link = (document.getElementById('assetLink') as HTMLInputElement).value;
		let typeList = document.getElementById('assetType') as HTMLSelectElement;
		var type = typeList.options[typeList.selectedIndex].text;
		var metadataForm = document.getElementById('metadataForm') as HTMLFormElement;

		let metadataInputs = metadataForm.getElementsByTagName('input');
		var metadataObject = {};
		for (let i in metadataInputs) {
			let key = metadataInputs[i].id;
			let value = metadataInputs[i].value;
			metadataObject = { ...metadataObject, [key]: value };
		}

		var assetObject = { name: name, link: link, type: type, metadata: metadataObject };
		// fetch request to server-side
		let API_URL = 'http://localhost:5038';
		fetch(API_URL + '/api/teamproject/AddAssets', {
			method: 'POST',
			body: JSON.stringify(assetObject)
		});
		localStorage.setItem('Asset_' + name, JSON.stringify(assetObject));

		toastStore.trigger({
			message: 'Asset created',
			background: 'variant-ghost-success',
			timeout: 3000
		});
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
