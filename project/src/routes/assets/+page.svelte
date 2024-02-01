<script lang="ts">
	//Run 'npm install' to make sure you have all the dependencies
	import { Modal, Content, Trigger } from 'sv-popup';
	import MakeAsset from './makeAsset.svelte';

	function searchKeyword() {
		alert((document.getElementById('keyword') as HTMLInputElement).value);
	}

	import { injectAssetDivs } from './assetDivInjection';

	injectAssetDivs();
</script>

<svelte:head>
	<title>Assets</title>
</svelte:head>

<h1>Assets</h1>
<div class="card" id="assetHeader">
	<Modal>
		<Content>
			<MakeAsset />
		</Content>
		<Trigger>
			<button id="assetMaker" class="card cardButton">➕</button>
		</Trigger>
	</Modal>
	<p id="nothingHere">It doesn't look like you have any assets yet, click the ➕ to get started</p>
	<button id="search" type="button" on:click={searchKeyword}>Search</button>
	<input type="text" id="keyword" name="keyword" placeholder="Enter keyword" />
</div>

<div class="assetsContainer"></div>

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
		height: 4vh;
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

	#search,
	#keyword {
		display: inline;
		float: right;
		margin-right: 20px;
	}
</style>
