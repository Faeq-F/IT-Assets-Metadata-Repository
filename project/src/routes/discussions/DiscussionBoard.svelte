<script lang="ts">
	//@ts-ignore
	import { page } from '$app/stores'; //Does work
	import {
		getModalStore,
		getToastStore,
		type ModalComponent,
		type ModalSettings
	} from '@skeletonlabs/skeleton';
	import ExpandedBoard from './ExpandedBoard.svelte';
	import UpdateBoard from './UpdateBoard.svelte';
	export let board: any;
	export let viewType: number;
	const toastStore = getToastStore();
	const modalStore = getModalStore();
	import Cookies from 'js-cookie';
	let role = Cookies.get('savedLogin-role');

	const expandModalComponent: ModalComponent = {
		ref: ExpandedBoard,
		props: { board: board }
	};
	const expandModal: ModalSettings = {
		type: 'component',
		component: expandModalComponent,
		backdropClasses: '!p-0'
	};

	const updateModalComponent: ModalComponent = {
		ref: UpdateBoard,
		props: { board: board }
	};
	const updateModal: ModalSettings = {
		type: 'component',
		component: updateModalComponent,
		backdropClasses: '!p-0'
	};

	async function deleteBoard() {}

	let showMenu = 'none';
</script>

<div
	id="Board"
	class="card card-hover bg-modern-50 drop-shadow-md"
	style={viewType != 0 ? 'width: 100%;' : ''}
>
	<!--Popup menu-->
	<div
		id="menuPopup"
		class="card card-hover p-3 drop-shadow-md"
		style="display: {showMenu}; position: absolute; right:10px; top: 10px; border-radius: 10px;"
	>
		<div class="">
			<button
				class="variant-filled-surface btn btn-sm card-hover m-1"
				on:click={() => {
					navigator.clipboard.writeText($page.url.origin + '/shared?board=' + board._id);
					toastStore.trigger({
						message: 'Copied link',
						background: 'variant-ghost-success',
						timeout: 3000
					});
				}}
			>
				<span><i class="fa-solid fa-share-nodes"></i></span>
				<span>Share</span>
			</button>
			<button
				class="variant-filled-surface btn btn-sm card-hover m-1"
				on:click={() => modalStore.trigger(expandModal)}
			>
				<span><i class="fa-solid fa-maximize"></i></span>
				<span>Expand</span>
			</button>
			{#if role != 'viewer'}
				<button
					class="variant-filled-surface btn btn-sm card-hover m-1"
					on:click={() => modalStore.trigger(updateModal)}
				>
					<span><i class="fa-solid fa-pen"></i></span>
					<span>Edit</span>
				</button>
				<button class="variant-filled-surface btn btn-sm card-hover m-1" on:click={deleteBoard}>
					<span><i class="fa-solid fa-trash text-sm"></i></span>
					<span>Delete</span>
				</button>
			{/if}
		</div>
	</div>
	<!--menu button-->
	<div id="ButtonActions">
		<button
			type="button"
			class="btn btn-sm"
			on:click={() => (showMenu == 'none' ? (showMenu = 'initial') : (showMenu = 'none'))}
			><i class="fa-solid fa-ellipsis-vertical"></i></button
		>
	</div>
	<!--details-->
	<button
		on:click={() => {
			window.location.href = '/discussion?board=' + board._id;
		}}
		class="w-full"
	>
		<div class="h3 text-left" style="margin:10px; font-weight: bold; margin-bottom: 5px;">
			{board.BoardName}
		</div>
		{#if viewType == 0}
			<hr style="width: 100%;" />
			<div style="margin: 10px; font-weight: 500" class="text-left">Description:</div>
			<div class="mb-2 ml-4 mt-1 text-left font-normal">
				<p>{board.Description}</p>
			</div>
		{/if}
	</button>
</div>

<style>
	#Board {
		margin: 10px;
		padding: 10px;
		flex-grow: 1;
		position: relative;
	}

	#ButtonActions {
		position: absolute;
		top: 10px;
		right: 20px;
		width: 10px;
	}
</style>
