<script lang="ts">
	import { updateDocument } from '$lib/apiRequests';
	import { getModalStore, getToastStore, popup, type PopupSettings } from '@skeletonlabs/skeleton';

	export let board: any;
	const toastStore = getToastStore();
	const modalStore = getModalStore();

	let boardName = board.BoardName;
	let description = board.Description;

	async function updateBoard() {
		if (boardName && description) {
			const data = new FormData();
			data.append(
				'newData',
				JSON.stringify({
					BoardName: boardName,
					BoardCreator: board.BoardCreator,
					Description: description,
					Messages: board.Messages,
					Containers: board.Containers
				})
			);
			await updateDocument('DisscussionBoards', board._id, data).then(async (response: any) => {
				console.log(response);
				location.reload();
				modalStore.close();
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
	<div class="card h-full bg-modern-50 p-5">
		<header class="h2 card-header text-center">Edit Discussion Board</header>
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
					class="input w-9/12 rounded-2xl"
					style="resize: both; overflow:auto;"
					rows="9"
					bind:value={description}
				/>
			</label>
			<br />

			<br />
			<button
				class="variant-filled-primary btn w-52"
				style="margin: 0 auto; display:block;"
				id="assetMaker"
				on:click|preventDefault={updateBoard}>Update board details</button
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
