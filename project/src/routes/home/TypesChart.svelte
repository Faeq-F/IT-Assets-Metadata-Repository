<script lang="ts">
	import { Doughnut } from 'svelte-chartjs';
	import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale } from 'chart.js';
	import { generateTypesGraphData } from './TypesChart';

	ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);
</script>

{#await generateTypesGraphData()}
	Loading graph
{:then data}
	<Doughnut {data} options={{ responsive: true }} />
{/await}
