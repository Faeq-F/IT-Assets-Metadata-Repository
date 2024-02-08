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
		// fetch request to server-side
		var assetObject = { name: name, link: link, type: type, metadata: metadataObject };
		let API_URL = 'http://localhost:5038';
		fetch(API_URL + '/api/teamproject/AddAssets', {
			method: 'POST',
			body: JSON.stringify(assetObject)
		});
		alert('The asset has been created');
	}

	addTypeOptions();
</script>

<div class="makeAssets card">
	<header>Make Assets</header>
	<form>
		<label for="assetName" class="formlabel">Asset Name: </label>
		<input type="text" id="assetName" name="assetName" placeholder="Enter Asset Name" /><br /><br />

		<label for="assetLink" class="formlabel">Asset Link: </label>
		<input
			type="text"
			id="assetLink"
			name="assetLink"
			placeholder="Enter the link to the Asset"
		/><br /><br />

		<label for="assetType" class="formlabel">Asset Type: </label><br />
		<select id="assetType">
			<option>Select type</option>
		</select>

		<br />
		<br />
	</form>
	<form id="metadataForm"></form>
	<br />
	<br />
	<button id="assetMaker" on:click={makeAsset}> Make Asset</button>
</div>
