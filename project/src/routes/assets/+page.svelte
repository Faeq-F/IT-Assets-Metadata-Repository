<script lang="ts">
	//Run 'npm install' to make sure you have all the dependencies
	import { Modal, Content, Trigger } from 'sv-popup';
	import MakeAsset from './makeAsset.svelte';
	import { AppBar, Autocomplete } from '@skeletonlabs/skeleton';

	function searchKeyword() {
		alert((document.getElementById('keyword') as HTMLInputElement).value);
	}
</script>

<svelte:head>
	<title>Assets</title>
</svelte:head>

<h1 class="h1">Assets</h1>
<br />
<div>
	<div class="card" id="assetHeader">
		<AppBar background="transparent">
			<svelte:fragment slot="lead">
				<p id="nothingHere">
					It doesn't look like you have any assets yet, click the ➕ to get started
				</p>
			</svelte:fragment>

			<svelte:fragment slot="trail">
				<div class="input-group input-group-divider grid-cols-[auto_1fr_auto]">
					<div class="input-group-shim"><i class="fa-solid fa-search"></i></div>
					<input
						type="search"
						id="keyword"
						name="keyword"
						placeholder="Enter search term"
						class=""
					/>
					<button class="variant-ghost" on:click={searchKeyword}>Submit</button>
				</div>
				<Modal>
					<Content>
						<MakeAsset />
					</Content>
					<Trigger>
						<button id="assetMaker" class="cardButton card">➕</button>
					</Trigger>
				</Modal>
			</svelte:fragment>
		</AppBar>
	</div>
</div>
<br />
<div class="assetsContainer">
	<div class="assetCard card">Example Asset Card 1</div>
	<div class="assetCard card">Example Asset Card 2</div>
	<div class="assetCard card">Example Asset Card 3</div>
	<div class="assetCard card">Example Asset Card 4</div>
	<div class="assetCard card">Example Asset Card 5</div>
	<div class="assetCard card">Example Asset Card 6</div>
	<!--There is an odd number of assets that are currently loaded in this div, so the last card should fill the remaining area-->
	<div class="assetCard card">Example Asset Card 7</div>
</div>

<style>
	@import url('$lib/styles/root.css');
	@import url('$lib/styles/card.css');

	h1 {
		text-align: center;
		margin-top: 15%;
	}

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
	}

	#assetHeader::after {
		content: '';
		clear: both;
		display: table;
	}

	.assetsContainer {
		display: flex;
		justify-content: center;
		flex-wrap: wrap;
		width: 90%;
		margin: 10px auto;
	}

	#keyword {
		display: inline;
		float: right;
		margin-right: 20px;
	}
</style>
