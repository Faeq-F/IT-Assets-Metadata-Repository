<script lang="ts">
	import { getToastStore, type AutocompleteOption } from '@skeletonlabs/skeleton';
	import { fetchDocuments, insertDocument } from '$lib/apiRequests';
	import InputAssociation from './InputAssociation.svelte';
	import Asset from './Asset.svelte';
	const toastStore = getToastStore();

	let activeTypes: any[] = [];
	fetchDocuments('AssetType').then((assetTypeDocuments) => {
		activeTypes = assetTypeDocuments;
	});

	function makeAsset() {
		//start by checking if the required fields are filled in
		var name = (document.getElementById('assetName') as HTMLInputElement).value;
		var link = (document.getElementById('assetLink') as HTMLInputElement).value;
		var type = currentType;
		if (name == '') {
			toastStore.trigger({
				message: 'Please give the asset a name',
				background: 'variant-ghost-error',
				timeout: 3000
			});
			return;
		} else if (link == '') {
			toastStore.trigger({
				message: 'Please give the asset a link',
				background: 'variant-ghost-error',
				timeout: 3000
			});
			return;
		} else if (type === undefined) {
			toastStore.trigger({
				message: 'Please give the asset a type',
				background: 'variant-ghost-error',
				timeout: 3000
			});
			return;
		}

		//then get the inputs for all metadata fields
		var metadataForm = document.getElementById('metadataForm') as HTMLFormElement;
		let metadataInputs = metadataForm.getElementsByTagName('input');
		console.log(metadataInputs);
		var metadataObject = {};
		for (let i of metadataInputs) {
			let key = i.id.replace('-association', '');
			let value;
			//check if the field is a list
			if (i.placeholder.includes('multiple')) {
				//if so, seperate the values
				value = i.value.split(', ');
				let newArr: any[] = [];
				// check if cast required for numbers
				if (i.placeholder.includes('number')) {
					for (let i in value) {
						if (Number.isNaN(parseFloat(value[i]))) {
							toastStore.trigger({
								message: 'You tried submitting text as a number!',
								background: 'variant-ghost-error',
								timeout: 3000
							});
							return;
						}
						newArr[i] = parseFloat(value[i]);
					}
				} else if (i.placeholder.includes('text')) {
					for (let i in value) {
						newArr[i] = value[i];
					}
				} else {
					console.log(i);
					console.log(i.id.replace('-association', ''));
					value = "sad;'#'";
				}
				value = newArr;
			} else {
				if (i.placeholder.includes('number')) {
					if (Number.isNaN(parseFloat(i.value))) {
						toastStore.trigger({
							message: 'You tried submitting text as a number!',
							background: 'variant-ghost-error',
							timeout: 3000
						});
						return;
					}
					value = parseFloat(i.value);
				} else if (i.placeholder.includes('text')) {
					value = i.value;
				} else if (i.placeholder.includes('Search for a')) {
					value = "sadfghjkl;'#'";
					console.log(document.getElementById(key + '-associationCollector'));
				}
			}
			metadataObject = { ...metadataObject, [key]: value };
		}
		//construct the final asset object and send it to the db
		var assetObject = {
			assetName: name,
			assetLink: link,
			assetType: type,
			metadataFields: metadataObject
		};
		console.log(assetObject);
		// const data = new FormData();
		// data.append('newData', JSON.stringify(assetObject));
		// insertDocument('Asset', data).then((response) => {
		// 	console.log(response);
		// });

		toastStore.trigger({
			message: 'Asset created',
			background: 'variant-ghost-success',
			timeout: 3000
		});
		// Refresh the page
		//location.reload();
	}

	function onDocumentSelection(event: any): void {
		console.log(
			event.detail.detail.label,
			event.detail.detail.value,
			event.detail.detail.field,
			event.detail.detail.listable
		);
	}

	let currentType: string;
</script>

<div class="makeAssets card p-5 shadow-xl" id="makeAssetPopup">
	<div class="card bg-modern-50 h-full p-5">
		<header class="h2 card-header text-center">Make an Asset</header>
		<br /><br />
		<form id="rootCreateAssetForm" class="text-center">
			<label for="assetName" class="formlabel">
				<p class="p-4 text-center">Asset Name:</p>
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
				<p class="p-4 text-center">Asset Link:</p>
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
				<p class="p-4 text-center">Asset Type:</p>

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
									<input
										type="text"
										placeholder="Enter multiple bits of text, separate them with commas (', ')"
										class="input w-96"
										id={field.field}
										name={field.field}
									/><br /><br />
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
									<input
										type="text"
										placeholder="Enter multiple numbers, separate them with commas (', ')"
										class="input w-96"
										id={field.field}
										name={field.field}
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
									on:message={onDocumentSelection}
								/>
								<br /><br />
							{:else if field.dataType == 'Asset'}
								<InputAssociation
									fieldName={field.field}
									list={field.list}
									associationType={'Asset'}
									on:message={onDocumentSelection}
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
				on:click|preventDefault={makeAsset}
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
