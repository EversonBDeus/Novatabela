<template>
    <div>
        <section class="central__graph">
            <Bar :key="chartKey" :data="chartData" :options="chartOptions" />
        </section>
        <hr>
    </div>
</template>

<script setup lang="ts">

import { Bar } from 'vue-chartjs';
  // Importando tipos e funções necessárias
import type { BasDados } from "../interfaces/basdados";
import { useDadosStore } from "../stores/state";
import {watchEffect,watch,  ref, computed, onMounted } from "vue";
const colorMode = useColorMode()
const store = useDadosStore()

function generateRandomString(): string {
  return Math.random().toString(36).substring(7);
}


const chartKey = ref(generateRandomString()); // Inicializa com uma chave única

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
} from 'chart.js';


const chartData = ref({
    labels: [] as string[],
  datasets: [
    {
    label: 'Quantidade',
    
      backgroundColor: ['#f87979', '#7987f8', '#79f8d4', '#f8d479'],
      data: [] as number[], // Definindo explicitamente o tipo como number[],
      barThickness: 100, // Definindo a espessura da barra
      barPercentage: 0.50,
      stack: 'combined'
    },
  ],
});
let delayed;
const chartOptions = ref({
    delay: (context) => {
        let delay = 0;
        if (context.type === 'data' && context.mode === 'default' && !delayed) {
          delay = context.dataIndex * 300 + context.datasetIndex * 100;
        }
        return delay;
      },
    
    plugins: {
      title: {
        display: true,
        text: 'Quantidade de BA por Central',
        font: {
        size: 20, // Tamanho do texto do títul
       
      
        },
        color:''
      },
      legend: {
        
      labels: {
        font:{
      
         color: 'grey', // Cor da legenda
        },
        color: 'grey', // Cor da legenda
      
      },

    },
    
    },
      
    scales: {
    x: {
      stacked: true,
      ticks: {
        color:'black'
      },
      grid: {
        color:'black'
      },
    },
    y: {
      stacked: true,
      ticks: {
        color:'grey'
      },
      grid: {
        color:'grey'
      },
    },
  },
  
  

  responsive: true,
  maintainAspectRatio: false,

});



// Função para calcular a quantidade de itens por central
function calculateItemsPerCentral() {
  const itemsPerCentral = store.calculateItemsPerCentral(store.selectedPeriod);
  

  // Atualiza os labels e dados do gráfico com base nas Centrais e quantidades
  chartData.value.labels = Object.keys(itemsPerCentral);
  chartData.value.datasets[0].data = Object.values(itemsPerCentral);
}

watch(colorMode, () => {
  let textColor: "white" | "grey" | "grey"; // Declarando a variável sem atribuir um valor inicial
let gridColor: "white" | "grey" | "grey"; // Declarando a variável sem atribuir um valor inicial
let legendColor: "white" | "grey" | "grey"; // Declarando a variável sem atribuir um valor inicial
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

    calculateItemsPerCentral()
  chartKey.value = generateRandomString(); // Gera uma nova chave ao atualizar os dados
 
});
</script>

<style  >

</style>