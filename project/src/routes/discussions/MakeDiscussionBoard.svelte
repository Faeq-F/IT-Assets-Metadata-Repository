<script lang="ts">
	import { insertDocument } from '$lib/apiRequests';
	import { getToastStore, popup, type PopupSettings } from '@skeletonlabs/skeleton';
	import Cookies from 'js-cookie';

	let boardName: string;
	let description: string;
	const toastStore = getToastStore();

	async function makeBoard() {
		if (boardName || description) {
			const data = new FormData();
			data.append(
				'newData',
				JSON.stringify({
					BoardName: boardName,
					BoardCreator: Cookies.get('savedLogin-username'),
					Description: description,
					Messages: [],
					Containers: []
				})
			);
			await insertDocument('DisscussionBoards', data).then(async (response: any) => {
				toastStore.trigger({
					message: 'Discussion Board made',
					background: 'variant-ghost-success',
					timeout: 3000
				});
			});
		} else {
			toastStore.trigger({
				message: 'Please fill in all fields',
				background: 'variant-ghost-error',
				timeout: 3000
			});
		}
	}

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
					bind:value={boardName}
				/>
			</label>
			<br />
			<label for="Description" class="formlabel">
				<p class="p-4 text-center">
					<i class="fa-solid fa-asterisk fa-sm" use:popup={requiredField}></i> Description:
				</p>
				<textarea
					id="Description"
					name="Description"
					placeholder="Enter Description"
					data-focusindex="0"
					class="input w-96 rounded-2xl"
					rows="5"
					bind:value={description}
				/>
			</label>
			<br />

			<br />
			<button
				class="variant-filled-primary btn w-52"
				style="margin: 0 auto; display:block;"
				id="assetMaker"
				on:click|preventDefault={makeBoard}>Make discussion board</button
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
