<script>
	import { Modal, Content, Trigger } from 'sv-popup';
	import MakeAsset from './makeAsset.svelte';

	function searchKeyword() {
		alert(document.getElementById('keyword').value);
	}
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

<div class="assetsContainer">
	<div class="card assetCard">Example Asset Card 1</div>
	<div class="card assetCard">Example Asset Card 2</div>
	<div class="card assetCard">Example Asset Card 4</div>
	<div class="card assetCard">Example Asset Card 3</div>
	<div class="card assetCard">Example Asset Card 5</div>
	<div class="card assetCard">Example Asset Card 6</div>
	<div class="card assetCard">Example Asset Card 7</div>
	<div class="card assetCard">Example Asset Card 8</div>
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
		height: 4vh;
	}

	#assetHeader::after {
		content: '';
		clear: both;
		display: table;
	}

	.assetsContainer {
		display: grid;
		grid-template-columns: 20% 20% 20%;
		grid-auto-rows: 1.6em;
		row-gap: 40vw;
		column-gap: 7vh;

		margin-bottom: 10px;
		overflow-x: hidden;
		height: inherit;
	}

	#search,
	#keyword {
		display: inline;
		float: right;
		margin-right: 20px;
	}
</style>
