<script lang="ts">
	import { injectTypeDivs } from './typeDivInjection';

	function makeType() {
		var name = (document.getElementById('typeName') as HTMLInputElement).value;
		var fields = (document.getElementById('metadataFields') as HTMLInputElement).value.split(', ');
		var typeObject = { fields: fields };
		localStorage.setItem('Type_' + name, JSON.stringify(typeObject));
		injectTypeDivs();
		alert('Type made');
		//localStorage.getItem('Type_' + name)
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
