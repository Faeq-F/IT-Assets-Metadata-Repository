<script lang="ts">
	import { getToastStore, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { fetchDocuments, insertDocument } from '$lib/apiRequests';
	import InputAssociation from '../../lib/components/customInputs/InputAssociation.svelte';
	import InputList from '../../lib/components/customInputs/InputList.svelte';
	import { onMount } from 'svelte';
	import { makeAsset } from './MakeAsset';
	const toastStore = getToastStore();

	let activeTypes: any[] = [];
	onMount(async () => {
		fetchDocuments('AssetType').then((assetTypeDocuments: any[]) => {
			activeTypes = assetTypeDocuments;
		});
	});

	const requiredField: PopupSettings = {
		event: 'hover',
		target: 'requiredField',
		placement: 'top'
	};

	let currentType: string;
</script>

<div class="bg-initial card p-4" data-popup="requiredField">
	<p>Required Field</p>
	<div class="bg-initial arrow" />
</div>

<div class="makeAssets card p-5 shadow-xl" id="makeAssetPopup">
	<div class="card bg-modern-50 h-full p-5">
		<header class="h2 card-header text-center">Make an Asset</header>
		<br /><br />
		<form id="rootCreateAssetForm" class="text-center">
			<label for="assetName" class="formlabel">
				<p class="p-4 text-center">
					<i class="fa-solid fa-asterisk fa-sm" use:popup={requiredField}></i> Asset Name:
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

			<label for="assetLink" class="formlabel">
				<p class="p-4 text-center">
					<i class="fa-solid fa-asterisk fa-sm" use:popup={requiredField}></i> Asset Link:
				</p>
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
				<p class="p-4 text-center">
					<i class="fa-solid fa-asterisk fa-sm" use:popup={requiredField}></i> Asset Type:
				</p>
				<select id="assetType" class="select w-96" bind:value={currentType}>
					<option>Select type</option>
					{#each activeTypes as type}
						<option>{type.typeName}</option>
					{/each}
				</select>
			</label>

			<br />
			<form id="metadataForm" class="text-center">
				{#each activeTypes as type}
					{#if type.typeName == currentType}
						{#each type.metadataFields as field}
							<div class="p-4 text-center">{field.field}</div>
							{#if field.dataType == 'Text'}
								{#if field.list == true}
									<InputList
										fieldName={field.field}
										dataType="text"
										presavedValues={undefined}
										style="margin: 5px auto;"
									/>
									<br /><br />
								{:else}
									<input
										type="text"
										placeholder="Enter a single line of text"
										class="input w-96"
										id={field.field}
										name={field.field}
									/><br /><br />
								{/if}
							{:else if field.dataType == 'Number'}
								{#if field.list == true}
									<InputList
										fieldName={field.field}
										dataType="number"
										presavedValues={undefined}
										style="margin: 5px auto;"
									/><br /><br />
								{:else}
									<input
										type="number"
										placeholder="Enter a single number"
										class="input w-96"
										id={field.field}
										name={field.field}
									/><br /><br />
								{/if}
							{:else if field.dataType == 'Account'}
								<InputAssociation
									fieldName={field.field}
									list={field.list}
									associationType={'User'}
									presavedAssociation={undefined}
									style="margin: 5px auto;"
								/>
								<br /><br />
							{:else if field.dataType == 'Asset'}
								<InputAssociation
									fieldName={field.field}
									list={field.list}
									associationType={'Asset'}
									presavedAssociation={undefined}
									style="margin: 5px auto;"
								/>
								<br /><br />
							{/if}
						{/each}
					{/if}
				{/each}
			</form>
			<br />
			<hr />
			<br />
			<button
				class="variant-filled-primary btn w-52"
				id="assetMaker"
				on:click|preventDefault={() => makeAsset(currentType, toastStore)}
			>
				Make Asset</button
			>
		</form>

		<br />
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
