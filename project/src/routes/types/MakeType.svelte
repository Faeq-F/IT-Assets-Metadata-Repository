<script lang="ts">
	import { getToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	import { injectTypeDivs } from './typeDivInjection';
	function makeType() {
		var name = (document.getElementById('typeName') as HTMLInputElement).value;
		var fields = (document.getElementById('metadataFields') as HTMLInputElement).value.split(', ');
		var typeObject = { fields: fields };
		localStorage.setItem('Type_' + name, JSON.stringify(typeObject));
		injectTypeDivs();

		toastStore.trigger({
			message: 'Type created',
			background: 'variant-ghost-success',
			timeout: 3000
		});
	}
</script>

<div class="makeAssets card w-72 p-4 shadow-xl" data-popup="makeTypePopup" id="makeTypePopup">
	<div class="Card">
		<header class="h2">Make an Asset Type</header>
		<br /><br />
		<form>
			<label for="typeName" class="formlabel">
				<p>Type Name:</p>
				<input
					type="text"
					id="typeName"
					name="typeName"
					placeholder="Enter Type Name"
					data-focusindex="0"
					class="input w-96"
				/>
			</label>
			<br />
			<label for="metadataFields" class="formlabel">
				<p>Metadata Fields:</p>
				<input
					type="text"
					id="metadataFields"
					name="metadataFields"
					placeholder="Field1, Field2, Field3, etc."
					data-focusindex="0"
					class="input w-96"
				/>
			</label>
			<br />
			<button class="variant-filled-primary btn w-52" id="assetMaker" on:click={makeType}
				>Make Type</button
			>
		</form>
	</div>
</div>

<style>
	@import url('$lib/styles/card.css');
	@import url('$lib/styles/makeModal.css');
	#makeTypePopup {
		position: absolute;
		top: 50% !important;
		left: 50% !important;
		transform: translate(-50%, -50%);
		width: 50vw;
		height: 50vh;
	}
</style>
