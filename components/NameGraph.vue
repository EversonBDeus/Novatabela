<template>
  <div>
    <section>
      <Doughnut :key="chartKey" :data="chartData" :options="chartOptions" />
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect,watch } from "vue";
import { useDadosStore } from "../stores/state";

import { Doughnut } from 'vue-chartjs'
const colorMode = useColorMode()
function getTickColor(theme: string): string {
  return theme === 'dark' ? 'white' : 'black';
}
console.log("teste" + colorMode)
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  ArcElement
} from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);

const store = useDadosStore();

function generateRandomString(): string {
  return Math.random().toString(36).substring(7);
}

const chartKey = ref(generateRandomString());

const chartData = ref({
  labels: [] as string[],
  datasets: [
    {
      backgroundColor: ['#41B883', '#E46651', '#00D8FF', '#DD1B16'],
      data: [] as number[],
    }
  ]

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
      text: 'Quantidade de BA por Usuario',
      font: {
        size: 20, // Tamanho do texto do título
       
      },
      color:'',

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

  responsive: true,
  maintainAspectRatio: false,
});

// Função para calcular a quantidade de itens por usuario
function calculateItemsPerName() {
  const { total, perName } = store.calculateItemsPerName(store.selectedPeriod);


  // Atualiza os labels e dados do gráfico com base nas Centrais e quantidades
  chartData.value.labels = Object.keys(perName);
  chartData.value.datasets[0].data = Object.values(perName);
}



// Adiciona um observador para mudanças no modo de cor e atualiza as opções do gráfico

watch(colorMode, () => {
  let textColor: "white" | "grey" | "grey"; // Declarando a variável sem atribuir um valor inicial

let legendColor: "white" | "grey" | "grey"; // Declarando a variável sem atribuir um valor inicial
  textColor = colorMode.value.toString() === 'serpia' ? 'grey' : 'grey';
  textColor = colorMode.value.toString() === 'dark' ? 'white' : 'grey';
  chartOptions.value.plugins.title.color = textColor;

  legendColor = colorMode.value.toString() === 'dark' ? 'white' : 'grey';
  chartOptions.value.plugins.legend.labels.color = legendColor;








});
watchEffect(() => {
  
  calculateItemsPerName()
  chartKey.value = generateRandomString();

});
</script>

<style>
hr {
  margin-bottom: 3rem;
  color: black;
}
</style>
