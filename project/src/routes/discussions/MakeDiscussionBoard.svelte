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
					id="assetName"
					name="assetName"
					placeholder="Enter Asset Name"
					data-focusindex="0"
					class="input w-96"
				/>
			</label><br />

			<br />
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
