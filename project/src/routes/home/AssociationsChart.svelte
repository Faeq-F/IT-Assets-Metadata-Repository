<script lang="ts">
	import { PolarArea } from 'svelte-chartjs';
	import {
		Chart as ChartJS,
		Title,
		Tooltip,
		Legend,
		ArcElement,
		RadialLinearScale
	} from 'chart.js';
	import { generateAssociationsGraphData } from './AssociationsChart';

	ChartJS.register(Title, Tooltip, Legend, ArcElement, RadialLinearScale);
</script>

{#await generateAssociationsGraphData()}
	Loading graph
{:then data}
	<PolarArea {data} options={{ responsive: true }} />
{/await}
