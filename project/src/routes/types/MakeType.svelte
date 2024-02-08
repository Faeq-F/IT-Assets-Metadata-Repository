<script lang="ts">
	import { Toast, getToastStore } from '@skeletonlabs/skeleton';
	import type { ToastSettings, ToastStore } from '@skeletonlabs/skeleton';
	const toastStore = getToastStore();

	import { injectTypeDivs } from './typeDivInjection';
	export let closeModal;
	function makeType() {
		var name = (document.getElementById('typeName') as HTMLInputElement).value;
		var fields = (document.getElementById('metadataFields') as HTMLInputElement).value.split(', ');
		var typeObject = { fields: fields };
		localStorage.setItem('Type_' + name, JSON.stringify(typeObject));
		closeModal = true;
		injectTypeDivs();
		const t: ToastSettings = {
			message: 'Type created',
			background: 'variant-ghost-success',
			timeout: 3000
		};
		toastStore.trigger(t);
	}
</script>

<div class="makeAssets card">
	<div class="Card">
		<header class="h2">Make an Asset Type</header>

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
</style>
