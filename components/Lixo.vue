<template>
  <div>
    <section class="archived-table__body">
      <h2>Registros Encerrados Há Mais de 7 Dias</h2>
      <table>
        <thead>
          <tr>
            <!-- Cabeçalho da tabela -->
            <th>ID</th>
            <th>Nome</th>
            <th>UF</th>
            <th>Central</th>
            <th>Número Ba</th>
            <th>Status</th>
            <th>Data</th>
          </tr>
        </thead>
        <tbody>
          <!-- Linhas da tabela -->
          <tr v-for="(ba, index) in archivedBas" :key="index">
            <td>{{ index + 1 }}</td>
            <td>{{ ba.name }}</td>
            <td>{{ ba.baUF }}</td>
            <td>{{ ba.baCentral }}</td>
            <td>{{ ba.baNumber }}</td>
            <td>{{ ba.baStatus }}</td>
            <td>{{ ba.date }}</td>
          </tr>
        </tbody>
      </table>
    </section>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import type { BasDados } from "../interfaces/basdados";
import { useDadosStore } from "../stores/state";

// Variável reativa para armazenar as BAs encerradas há mais de 7 dias
const archivedBas = ref<BasDados[]>([]);

// Função para filtrar e mover os dados
function filterAndMoveData(bas: BasDados[]) {
  const today = new Date();
  const sevenDaysAgo = new Date(today.setDate(today.getDate() - 7));

  const filteredBas = bas.filter(ba => {
    const baDate = new Date(ba.date);
    const isStatusEncerrado = ba.baStatus.toLowerCase() === 'encerrado';
    const isMoreThanSevenDays = baDate < sevenDaysAgo;

    return isStatusEncerrado && isMoreThanSevenDays;
  });

  archivedBas.value = filteredBas;
}

// Função executada após o componente ser montado
onMounted(() => {

});
</script>

<style lang="scss" scoped>
/* Seu estilo aqui */
</style>
