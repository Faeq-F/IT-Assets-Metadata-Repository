<script lang="ts">
	import { addTypeOptions } from './makeAsset';

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
		localStorage.setItem('Asset_' + name, JSON.stringify(assetObject));
		alert('The asset has been created');
	}

	addTypeOptions();
</script>

<div class="makeAssets card">
	<div class="Card">
		<header class="h2">Make an Asset</header>
		<form>
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

				<select id="assetType" class="select">
					<option>Select type</option>
				</select>
			</label>

			<br />
			<form id="metadataForm"></form>
			<br />
			<button class="variant-filled-primary btn w-52" id="assetMaker" on:click={makeAsset}>
				Make Asset</button
			>
		</form>
	</div>
</div>

<style>
	@import url('$lib/styles/card.css');
	@import url('$lib/styles/makeModal.css');

	#metadataForm {
		position: initial;
	}
</style>
