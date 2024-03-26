<script lang="ts">
	//@ts-ignore
	import { browser } from '$app/environment'; //Does work
	import { onMount } from 'svelte';
	import {
		AppBar,
		type ModalComponent,
		type ModalSettings,
		RadioGroup,
		RadioItem,
		getModalStore,
		popup,
		type PopupSettings
	} from '@skeletonlabs/skeleton';
	import { redirectWhenNotLoggedIn } from '$lib/scripts/loginSaved';
	import { fetchDocuments } from '$lib/apiRequests';
	import Cookies from 'js-cookie';
	import Placeholder from '$lib/components/cards/placeholder.svelte';
	import MakeDiscussionBoard from './MakeDiscussionBoard.svelte';
	import DiscussionBoard from './DiscussionBoard.svelte';

	let role = Cookies.get('savedLogin-role');

	onMount(() => {
		if (browser) {
			redirectWhenNotLoggedIn();
		}
	});

	let DiscussionBoards: any[];

	onMount(async () => {
		fetchDocuments('DisscussionBoards').then((Docs) => {
			DiscussionBoards = Docs;
		});
	});

	const about: PopupSettings = {
		event: 'hover',
		target: 'about',
		placement: 'top'
	};

	const modalStore = getModalStore();
	const modalComponent: ModalComponent = { ref: MakeDiscussionBoard };
	const makeModal: ModalSettings = {
		type: 'component',
		component: modalComponent
	};

	let viewType: number = 0;
</script>

<svelte:head>
	<title>Discussions</title>
</svelte:head>

<div class="card z-[9999] p-4" data-popup="about">
	Discussion boards can be about anything. Certain projects that have been undertaken, or general
	questions. You can organize information being talked about in containers.
	<div class="card arrow" />
</div>

<h1 class="h1" use:popup={about}>Discussions</h1>
<br />
<div>
	<div class="card block w-11/12 bg-modern-50 drop-shadow-md" id="assetHeader">
		<AppBar background="transparent">
			<svelte:fragment slot="lead">
				{#if DiscussionBoards != undefined && DiscussionBoards.length > 0}
					<RadioGroup
						background="transparent"
						class="text-token max-h-8  text-sm"
						active="variant-soft"
						hover="hover:variant-soft-primary"
						border="border-2 border-modern-500"
					>
						<RadioItem bind:group={viewType} name="grid" value={0} class="h-4"
							><i
								class="fa-solid fa-grip fa-md -mt-8 text-sm"
								style="vertical-align: middle; line-height: 4.6rem;"
							></i></RadioItem
						>
						<RadioItem bind:group={viewType} name="list" value={1} class="h-4"
							><i
								class="fa-solid fa-list-ul fa-md -mt-8 text-sm"
								style="vertical-align: middle; line-height: 4.6rem;"
							></i></RadioItem
						>
					</RadioGroup>
					<p id="nothingHere" class="ml-2" use:popup={about}>Your discussion boards:</p>
				{:else}
					<p id="nothingHere" class="ml-2">
						It doesn't look like you have any boards yet, click the <i class="fa-solid fa-plus"></i>
						to get started
					</p>
				{/if}
			</svelte:fragment>
			<svelte:fragment slot="trail">
				{#if role != 'viewer'}
					<button
						id="assetMaker"
						class="card card-hover border-2 border-modern-500 bg-modern-50 drop-shadow-md"
						on:click={() => modalStore.trigger(makeModal)}><i class="fa-solid fa-plus"></i></button
					>
				{/if}
			</svelte:fragment>
		</AppBar>
	</div>
</div>

<div class="boardsContainer">
	{#await fetchDocuments('DisscussionBoards')}
		<Placeholder />
		<Placeholder />
		<Placeholder />
		<Placeholder />
		<Placeholder />
		<Placeholder />
		<Placeholder />
	{:then Boards}
		{#each Boards as board}
			<DiscussionBoard {board} {viewType} />
		{/each}
	{/await}
</div>

<style>
	#assetMaker {
		width: 2vw;
		height: 2vw;
		padding: 0;
		float: right;
	}

	#nothingHere {
		display: inline;
		float: left;
	}

	#assetHeader {
		height: auto;
		padding: 0px;
		margin: 0 auto;
	}

	#assetHeader::after {
		content: '';
		clear: both;
		display: table;
	}

	.boardsContainer {
		display: flex;
		flex-wrap: wrap;
		justify-content: space-around;
		align-items: stretch;
		width: 90%;
		margin: 10px auto;
	}
</style>
