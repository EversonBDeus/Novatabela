<template>
  <div>
    <Bar :key="chartKey" :data="chartData" :options="chartOptions" />
  </div>
  <hr>
</template>

<script setup lang="ts">
import { ref, watchEffect,watch} from 'vue';
import { Bar } from 'vue-chartjs';

import type { BasDados } from "../interfaces/basdados";
import { useDadosStore } from "../stores/state";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const colorMode = useColorMode();
const store = useDadosStore();
const chartKey = ref(generateRandomString());

const chartData = ref({
  labels: [] as string[],
  datasets: [
    {
      label: 'Quantidade',
      backgroundColor: ['#f87979', '#7987f8', '#79f8d4', '#f8d479'],
      data: [] as number[],
      barThickness: 100,
      barPercentage: 0.50,
    },
  ],
});

const chartOptions = ref({
  plugins: {
    title: {
      display: true,
      text: 'Quantidade de BA por UF',
      font: {
        size: 20,
      },
      color: '',
    },
    legend: {
      labels: {
        font: {
          color: 'grey',
        },
        color: 'grey',
      },
    },
  },
  
  scales: {
    x: {
      stacked: true,
      ticks: {
        color: 'black',
      },
      grid: {
        color: 'black',
      },
    },
    y: {
      stacked: true,
      ticks: {
        color: 'grey',
      },
      grid: {
        color: 'grey',
      },
    },
  },
  responsive: true,
  maintainAspectRatio: false,
});

function generateRandomString(): string {
  return Math.random().toString(36).substring(7);
}

function calculateItemsPerUF() {
  const itemsPerUF = store.calculateItemsPerUF(store.selectedPeriod);
 
  chartData.value.labels = Object.keys(itemsPerUF);
  chartData.value.datasets[0].data = Object.values(itemsPerUF);
}

let textColor: "white" | "grey" | "grey";
let gridColor: "white" | "grey" | "grey";
let legendColor: "white" | "grey" | "grey";
watch(colorMode, () => {
  textColor = colorMode.value.toString() === 'serpia' ? 'grey' : 'grey';
  textColor = colorMode.value.toString() === 'dark' ? 'white' : 'grey';
  chartOptions.value.plugins.title.color = textColor;

  gridColor = colorMode.value.toString() === 'dark' ? 'white' : 'grey';
  chartOptions.value.scales.x.grid.color = gridColor;
  chartOptions.value.scales.y.grid.color = gridColor;

  legendColor = colorMode.value.toString() === 'dark' ? 'white' : 'grey';
  chartOptions.value.plugins.legend.labels.color = legendColor;
});

watchEffect(() => {

  calculateItemsPerUF();
  chartKey.value = generateRandomString();
});
</script>
