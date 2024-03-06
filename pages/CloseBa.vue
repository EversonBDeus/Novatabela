<template>
  <section class="table__body">
    <form class="form" @submit.prevent="addBaWithCustomDate(newBa.baCentral, newBa.baStatus, newBa.baNumber, newBa.baUF, newBa.name, customDate)">
      <div class="form-row">
    <label for="name">Nome:</label>
    <input type="text" id="name" v-model="newBa.name" required>
  </div>
  <div class="form-row">
    <label for="baUF">UF:</label>
    <input type="text" id="baUF" v-model="newBa.baUF" required>
  </div>
  <div class="form-row">
    <label for="baCentral">Central:</label>
    <input type="text" id="baCentral" v-model="newBa.baCentral" required>
  </div>
  <div class="form-row">
    <label for="baNumber">Número BA:</label>
    <input type="number" id="baNumber" v-model="newBa.baNumber" required>
  </div>
  <div class="form-row">
    <label for="baStatus">Status:</label>
    <input type="text" id="baStatus" v-model="newBa.baStatus" required>
  </div>
  <div class="form-row">
    <label for="customDate">Data (MM/DD/YYYY):</label>
    <input type="text" id="customDate" v-model="customDate" required>
  </div>
  <button type="submit">Adicionar BA</button>
    </form>
    <h1>Lista de Bas Antigos Encerrados</h1>
    <table class="table">
      <thead>
          <tr>
            <th>ID</th>
            <th>Nome</th>
            <th>UF</th>
            <th>Central</th>
            <th>Número BA</th>
            <th>Status</th>
            <th>Data</th>
           
          </tr>
        </thead>
      <tbody>
        <tr v-for="(ba, index) in filtroBAs" :key="index" class="table__row">
          <!-- Linhas da tabela -->
          <td class="table__cell">{{ index + 1 }}</td>
          <td class="table__cell">{{ ba.name }}</td>
          <td class="table__cell">{{ ba.baUF }}</td>
          <td class="table__cell">{{ ba.baCentral }}</td>
          <td class="table__cell">{{ ba.baNumber }}</td>
          <td class="table__cell">{{ ba.baStatus }}</td>
          <td class="table__cell">{{ ba.date }}</td>
          <td class="table__cell">
          
          </td>
        </tr>
      </tbody>
    </table>
  </section>
</template>


<script setup lang="ts">
import { defineComponent, ref, computed, onMounted } from "vue";
import { useDadosStore } from "../stores/state";
const store = useDadosStore();
const bas = ref<BasDados[]>([]); // Usando um ref para garantir a reatividade

// Método computado para filtrar os BAs com status "Encerrado" há mais de 7 dias
// Método computado para filtrar os BAs com status "Encerrado" há mais de 7 dias
const filtroBAs = computed(() => {
  console.log('Todos os dados:', bas.value);
  const today = new Date();
  const sevenDaysAgo = new Date(today.setDate(today.getDate() - 7)).getTime();

  return bas.value.filter(ba => {
    const baDate = new Date(ba.date).getTime();
    const isStatusEncerrado = ba.baStatus.toLowerCase() === 'encerrado';
    const isMoreThanSevenDays = baDate < sevenDaysAgo;

    return isStatusEncerrado && isMoreThanSevenDays;
  });
});
// Campos do novo BA
const newBa = ref({
  baCentral: "",
  baStatus: "",
  baNumber: null,
  baUF: "",
  name: "",
});
const customDate = ref(""); // Campo para a data personalizada

interface BasDados {
  baCentral: string;
  baStatus: string;
  baNumber: number;
  baUF: string;
  name: string;
  date: string; // Adicione o campo 'date' se for necessário
}

// Restante do seu código...


async function addBaWithCustomDate(
  baCentral: string,
  baStatus: string,
  baNumber: number,
  baUF: string,
  name: string,
  customDate: string // Data no formato "MM/DD/YYYY"
) {
  // Adiciona o novo BA na lista local
  bas.value.push({
    baCentral,
    baStatus,
    date: customDate,
    baNumber,
    baUF,
    name,
  });

  try {
    // Faz a requisição para adicionar o BA na API
    const response = await fetch("https://2qs083zp7j.execute-api.sa-east-1.amazonaws.com/prod/bas", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        baUF,
        baDate: customDate, // Usa a data especificada
        baNumber,
        baStatus,
        baCentral,
        name,
      }),
    });

    if (!response.ok) {
      throw new Error("Network response was not ok");
    }

    // Atualiza a lista de BA's após a adição
    await store.fetchBas();
 
  } catch (error) {
    console.error("There has been a problem with your fetch operation:", error);
  }
}

onMounted(async () => {
  await store.fetchBas();
  bas.value = store.bas;
});
</script>

<style scoped >
#baForm {
  display: flex;
  flex-direction: column;
  max-width: 400px;
  margin: 0 auto;
}

.form-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  margin-bottom: 10px;
}

label {
  margin-right: 10px;
}

input {
  flex: 1;
  padding: 5px;
  border: 1px solid #ccc;
}

button {
  padding: 5px 10px;
  background-color: #007bff;
  color: white;
  border: none;
  cursor: pointer;
}

button:hover {
  background-color: #0056b3;
}

 .form {
    margin-bottom: 20px;
  }

  .form input,
  .form button {
    margin-right: 10px;
    margin-bottom: 10px;
    padding: 5px;
    border-radius: 3px;
    border: 1px solid #ccc;
  }

  .table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    border-spacing: 0;
  }

  th,
  td {
    padding: 12px;
    border-bottom: 1px solid #ddd;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
    font-weight: bold;
  }

  td button {
    padding: 8px 12px;
    background-color: #f44336;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 3px;
  }

  td button:hover {
    background-color: #d32f2f;
  }
  .table__body {
    margin-top: 20px;
    height: 100%;
    width: 100%;
  }

  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 20px;
    border-spacing: 0; /* Remove espaçamento entre as células */
  }

  th,
  td {
    padding: 12px; /* Aumenta o espaçamento interno das células */
    border-bottom: 1px solid #ddd;
    text-align: left;
  }

  th {
    background-color: #f2f2f2;
    font-weight: bold; /* Deixa o texto do cabeçalho em negrito */
  }

  td button {
    padding: 8px 12px; /* Aumenta o espaçamento interno dos botões */
    background-color: #f44336;
    color: white;
    border: none;
    cursor: pointer;
    border-radius: 3px;
  }

  td button:hover {
    background-color: #d32f2f;
  }
</style>


