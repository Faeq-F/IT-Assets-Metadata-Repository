<script lang="ts">
	import { getToastStore, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import { fetchDocuments, insertDocument } from '$lib/apiRequests';
	import InputAssociation from '../../lib/components/customInputs/InputAssociation.svelte';
	import InputList from '../../lib/components/customInputs/InputList.svelte';
	import { onMount } from 'svelte';
	const toastStore = getToastStore();

	let activeTypes: any[] = [];
	onMount(async () => {
		fetchDocuments('AssetType').then((assetTypeDocuments: any[]) => {
			activeTypes = assetTypeDocuments;
		});
	});

	async function makeAsset() {
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
		var metadataObject = {};
		for (let i of metadataInputs) {
			let key = i.id.replace('-association', '').replace('-InputList', '');
			let value;
			//check if the field is a list of numbers or text
			if (i.id.includes('InputList')) {
				//if so, get the elements with the values
				let collection = document
					.getElementById(key + '-ListInputCollector')
					?.getElementsByTagName('li');
				if (collection) {
					let newArr: any[] = [];
					for (let j of collection) {
						let iVal: any = (j as HTMLLIElement).innerHTML;
						if (!i.placeholder.includes('strings of text')) iVal = parseFloat(iVal);
						newArr.push(iVal);
					}
					value = newArr;
				}
			} else if (i.placeholder.includes('Search for multiple')) {
				//the input is for a list of associations
				let item = document
					.getElementById(key + '-associationCollector')
					?.getElementsByTagName('LI');
				if (item) {
					let newArr = [];
					for (let j of item) {
						let object = (j as HTMLElement).dataset.associatedobject;
						if (object) newArr.push('DOCUMENT-ID: ' + JSON.parse(object).value);
					}
					value = newArr;
				}
			} else {
				if (i.placeholder.includes('number')) {
					if (!(i.value == '')) {
						if (Number.isNaN(parseFloat(i.value))) {
							toastStore.trigger({
								message: 'You tried submitting text as a number!',
								background: 'variant-ghost-error',
								timeout: 3000
							});
							return;
						}
						value = parseFloat(i.value);
					}
				} else if (i.placeholder.includes('text')) {
					value = i.value;
				} else if (i.placeholder.includes('Search for a')) {
					let item = document
						.getElementById(key + '-associationCollector')
						?.getElementsByTagName('LI');
					if (!(item == undefined || item.length == 0)) {
						let liItem = (item[0] as HTMLElement).dataset.associatedobject;
						if (liItem) value = 'DOCUMENT-ID: ' + JSON.parse(liItem).value;
					}
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

		const data = new FormData();
		data.append('newData', JSON.stringify(assetObject));
		await insertDocument('Asset', data).then(async (response: any) => {
			// response is the new id of the inserted doc now
			let diffs: any[] = [];
			// constructing audit object
			var auditObject = {
				reference: response,
				original: {
					assetName: name,
					assetLink: link,
					assetType: type,
					metadataFields: metadataObject
				},
				diffs: diffs
			};
			// sending new asset into diff
			const audit = new FormData();
			audit.append('newData', JSON.stringify(auditObject));

			await insertDocument('diff', audit);

			toastStore.trigger({
				message: 'Asset created',
				background: 'variant-ghost-success',
				timeout: 3000
			});
			//Refresh the page
			location.reload();
		});
	}

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
