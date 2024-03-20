<script lang="ts">
	import { popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import InputAssociation from '../../lib/components/customInputs/InputAssociation.svelte';
	import InputList from '../../lib/components/customInputs/InputList.svelte';

	const requiredField: PopupSettings = {
		event: 'hover',
		target: 'requiredField',
		placement: 'top'
	};
</script>

<div class="bg-initial card p-4" data-popup="requiredField">
	<p>Required Field</p>
	<div class="bg-initial arrow" />
</div>

<div class="makeAssets card p-5 shadow-xl" id="makeAssetPopup">
	<div class="card bg-modern-50 h-full p-5">
		<header class="h2 card-header text-center">Make a Discussion Board</header>
		<br /><br />
		<form id="rootCreateAssetForm" class="text-center">
			<label for="assetName" class="formlabel">
				<p class="p-4 text-center">
					<i class="fa-solid fa-asterisk fa-sm" use:popup={requiredField}></i> Board Name:
				</p>
				<input
					type="text"
					id="boardName"
					name="boardName"
					placeholder="Enter Board Name"
					data-focusindex="0"
					class="input w-96"
				/>
			</label>
			<br />
			<label for="Description" class="formlabel">
				<p class="p-4 text-center">
					<i class="fa-solid fa-asterisk fa-sm" use:popup={requiredField}></i> Description:
				</p>
				<textarea
					type="text"
					id="Description"
					name="Description"
					placeholder="Enter Description"
					data-focusindex="0"
					class="input w-96 rounded-2xl"
					rows="5"
				/>
			</label>
			<br />

			<br />
			<button
					class="variant-filled-primary btn w-52"
					style="margin: 0 auto; display:block;"
					id="assetMaker"
					on:click|preventDefault={makeType}>Make discussion board</button
			>
		</form>
	</div>
</div>

<style>
	.makeAssets {
		height: 70vh;
		width: 70vw;
	}

	#rootCreateAssetForm {
		height: 75%;
		overflow-y: scroll;
	}
</style>
