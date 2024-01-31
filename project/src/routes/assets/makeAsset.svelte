<script lang="ts">
	function makeAsset() {
		var name = (document.getElementById('assetName') as HTMLInputElement).value;

		var typeList = document.getElementsByName('assetType');
		var type = 'noType';
		for (var index = 0; index < typeList.length; index++) {
			//Cast makes the code type safe - no need for ts ignore
			let typeRadio = typeList[index] as HTMLInputElement;
			if (typeRadio.checked) {
				type = typeRadio.value;
			}
		}
		alert('Asset made with name ' + name + ' and with type ' + type);
	}
</script>

<div class="makeAssets card">
	<header>Make Assets</header>
	<form>
		<label for="assetName" class="formlabel">Name: </label>
		<input type="text" id="assetName" name="assetName" placeholder="Enter Asset Name" /><br /><br />

		<label for="assetType" class="formlabel">Asset Type: </label><br />

		<input type="radio" name="assetType" value="Type 1" />
		<label for="type1" class="formlabel"> Type 1</label><br />

		<input type="radio" name="assetType" value="Type 2" />
		<label for="type2" class="formlabel"> Type 2</label><br />

		<input type="radio" name="assetType" value="Type 3" />
		<label for="type3" class="formlabel"> Type 3</label><br />
	</form>
	<button id="assetMaker" on:click={makeAsset}> Make Asset</button>
</div>
