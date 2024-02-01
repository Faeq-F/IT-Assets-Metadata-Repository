<script lang="ts">
	function makeType() {
		var name = (document.getElementById('typeName') as HTMLInputElement).value;

		var fields = (document.getElementById('metadataFields') as HTMLInputElement).value;
		alert('Type made with name ' + name + ' and with fields ' + fields);
	}
</script>

<div class="makeAssets card">
	<header>Make an Asset Type</header>
	<form>
		<label for="typeName" class="formlabel">Type Name: </label>
		<input type="text" id="typeName" name="typeName" placeholder="Enter Type Name" /><br /><br />

		<label for="metadataFields" class="formlabel">Metadata Fields: </label><br />
		<input
			type="text"
			id="metadataFields"
			name="metadataFields"
			placeholder="Field1,Field2,Field3,etc."
		/><br /><br />
	</form>
	<button id="assetMaker" on:click={makeType}> Make Type</button>
</div>
