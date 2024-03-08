<template>
  <!-- Tabela principal -->
  <main class="table" id="customers_table">
    <!-- Cabeçalho da tabela -->
    <section class="table__header">
      <AddBa />
      <!-- Barra de busca -->
      <div class="input-group">
        <input type="search" placeholder="Buscar..." v-model="searchText" />
        <img src="../assets/images/search.png" alt="" />
      </div>
      <div class="table__refresh icontable" @click="store.fetchBas()">
        <Icon name="icon-park:refresh-one" color="black" size="30px"/>

      </div>
      <div>
        <NuxtLink to="/closeba">
          <Icon name="icon-park:history" color="black" size="32px"/>
        </NuxtLink>
        
      </div>
      <div class="table__dashboard icontable ">
        <NuxtLink to="/chartpanel">
          <Icon name="fluent-mdl2:b-i-dashboard" color="black" size="32px"/>
        </NuxtLink>
      </div>
      <!-- Opções de exportação -->
      <div class="export__file">
        <label
          for="export-file"
          class="export__file-btn"
          title="Export File"
        ></label>
        <input type="checkbox" id="export-file" />
        <div class="export__file-options">
          <label>Exportar como &nbsp; &#10140;</label>

          <label for="export-file" id="toEXCEL"
            >EXCEL <img  @click="exportToExcel" src="../assets/images/excel.png" alt=""
          /></label>
        </div>
      </div>
    </section>
    <!-- Corpo da tabela -->

    <section class="table__body">
      <table>
        <thead>
          <!-- Cabeçalho da tabela -->
          <tr>
            <th
              :class="{ 'active-th': activeColumn === 'id' }"
              @click="sortTable('id')"
            >
              ID <span class="icon-arrow">&UpArrow;</span>
            </th>
            <th
              :class="{ 'active-th': activeColumn === 'name' }"
              @click="sortTable('name')"
            >
            Nome <span class="icon-arrow">&UpArrow;</span>
            </th>
        
            <th
              :class="{ 'active-th': activeColumn === 'baUF' }"
              @click="sortTable('baUF')"
            >
              UF <span class="icon-arrow">&UpArrow;</span>
            </th>
            <th
              :class="{ 'active-th': activeColumn === 'baCentral' }"
              @click="sortTable('baCentral')"
            >
              Central <span class="icon-arrow">&UpArrow;</span>
            </th>
            <th
              :class="{ 'active-th': activeColumn === 'baNumber' }"
              @click="sortTable('baNumber')"
            >
              Número Ba <span class="icon-arrow">&UpArrow;</span>
            </th>
            <th
              :class="{ 'active-th': activeColumn === 'baStatus' }"
              @click="sortTable('baStatus')"
            >
              Status <span class="icon-arrow">&UpArrow;</span>
            </th>
            <th
              :class="{ 'active-th': activeColumn === 'date' }"
              @click="sortTable('date')"
            >
              Data <span class="icon-arrow">&UpArrow;</span>
            </th>
            <th>Açoes</th>
          </tr>
        </thead>
      
        
        <tbody v-if="!store.timerRunning && filteredBas.length > 0">

          <!-- Linhas da tabela -->
          <tr
            @change="updateBa(ba, ba.baNumber)"
            v-for="(ba, index) in filteredBas"

            :key="ba.id"
            :class="{ hide: !shouldShowRow(ba) }"
            :style="{ display: shouldShowRow(ba) ? 'table-row' : 'none' }"
          >
            <td>
              <strong>{{ index + 1 }}</strong>
            </td>
            <td><span class="name-img">{{ getFirstLetter(ba.name) }}</span>    
              <span  class="span-name" :class="{
               
               'status-open': ba.baStatus === 'Aberto',
               'status-cancelled': ba.baStatus === 'Cancelado',
             }">{{ ba.name }} </span>
              </td>
            <td>
              <!-- Campo de input UF -->
              <input
                :class="{
                  'input-table': true,
                  'status-open': ba.baStatus === 'Aberto',
                  'status-cancelled': ba.baStatus === 'Cancelado',
                }"
                class="input-table"
                type="text"
                v-model="ba.baUF"
              />
            </td>

            <td>
              <!-- Campo de input Central -->
              <input
                :class="{
                  'input-table': true,
                  'status-open': ba.baStatus === 'Aberto',
                  'status-cancelled': ba.baStatus === 'Cancelado',
                }"
                class="input-table"
                type="text"
                v-model="ba.baCentral"
              />
            </td>
            <td>
              <!-- Campo de input Número Ba -->
              <input
                :class="{
                  'input-table': true,
                  'status-open': ba.baStatus === 'Aberto',
                  'status-cancelled': ba.baStatus === 'Cancelado',
                }"
                class="input-table"
                type="number"
                v-model="ba.baNumber"
              />
            </td>

            <td>
              <!-- Campo de seleção de Status -->
              <select
                @change="updateBa(ba, ba.baNumber)"
                :class="
                  ba.baStatus === 'Aberto' ? 'status open' : 'status cancelled'
                "
                v-model="ba.baStatus"
              >
                <option
                  :value="ba.baStatus === 'Aberto' ? 'Aberto' : 'Encerrado'"
                >
                  {{ ba.baStatus }}
                </option>
                <option
                  :value="ba.baStatus === 'Aberto' ? 'Encerrado' : 'Aberto'"
                >
                  {{ ba.baStatus === "Aberto" ? "Encerrado" : "Aberto" }}
                </option>
              </select>
            </td>
            <td>{{ ba.date }}</td>
            <!-- Coluna de ações -->
            <td>
              <!-- Botão de excluir -->
              <li class="button-delete"  @click="deleteBa(ba.id ? ba.id : '')">
                <img
                  src="../assets//images//trash-bin-icon-flat-by-Vexels.png"
                  alt="Excluir"
                />
              </li>
            </td>
          </tr>
        </tbody>
      </table>
     
    </section>
    <span v-if="store.timerRunning" class="table__loader">
        <span class="loader"></span>
      </span>
  </main>
</template>
<script setup lang="ts">
// Importando tipos e funções necessárias
import type { BasDados } from "../interfaces/basdados";
import { useDadosStore } from "../stores/state";
import { defineComponent, ref, computed, onMounted } from "vue";
import { parse, format } from 'date-fns';
import ExcelJS from 'exceljs';

const colorMode = useColorMode()

// Função para obter a primeira letra do nome
function getFirstLetter(name) {
return name.charAt(0).toUpperCase();
}

// Variável reativa para o texto de busca
const searchText = ref("");

// Variável reativa para controlar a ordenação da tabela
const active = ref(false);

// Variável reativa para armazenar a coluna ativa na ordenação
const activeColumn = ref<string | null>(null);

// Função para definir a coluna ativa na ordenação
function setActiveColumn(column: string) {
activeColumn.value = activeColumn.value === column ? null : column;
}

// Função para determinar se uma linha deve ser exibida com base no texto de busca
const shouldShowRow = (ba: BasDados) => {
const searchTerm = searchText.value.toLowerCase();

return (
  ba.baUF.toLowerCase().includes(searchTerm) ||
  ba.baNumber.toString().includes(searchTerm) ||
  ba.baCentral.toLowerCase().includes(searchTerm) ||
  ba.name.toLowerCase().includes(searchTerm) ||
  ba.baStatus.toLowerCase().includes(searchTerm)
);
};

// Variável reativa para controlar a direção da ordenação
const sortDirection = ref<"asc" | "desc">("asc");

// Função para ordenar a tabela
function sortTable(column: keyof BasDados) {
const sortOrder = sortDirection.value === "asc" ? 1 : -1;

if (activeColumn.value === column) {
  sortDirection.value = sortDirection.value === "asc" ? "desc" : "asc";
  // Adicione esta linha para remover a classe quando a coluna clicada já está ativa
  activeColumn.value = null;
} else {
  activeColumn.value = column;
  sortDirection.value = "asc";
}

store.bas.sort((a: BasDados, b: BasDados) => {
  const valueA = a[column] ?? "";
  const valueB = b[column] ?? "";

  return valueA > valueB ? sortOrder : -sortOrder;
});
}

// Interface para definir o objeto com os dados
interface MyObject {
searchText: string;
$refs: {
  tableRow: HTMLElement[];
};
}


// Função para verificar a data e status de cada item da tabela
function convertDateString(dateString) {
  const months = [
    'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
    'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'
  ];

  const parts = dateString.split(' ');
  const month = months.indexOf(parts[0]);
  const day = parseInt(parts[1], 10);
  const year = parseInt(parts[2], 10);

  return new Date(year, month, day);
}

function filterTableData(bas) {
  const today = new Date();
  const sevenDaysAgo = new Date(today.setDate(today.getDate() - 7)).getTime();

  return bas.map(ba => {
    const baDate = convertDateString(ba.date).getTime();
    const isStatusEncerrado = ba.baStatus.toLowerCase() === 'encerrado';
    const isMoreThanSevenDays = baDate < sevenDaysAgo;

    if (isStatusEncerrado && isMoreThanSevenDays) {
      return null;
    }

    return ba;
  }).filter(Boolean);
}




// Variável reativa para armazenar as BAs filtradas
const filteredBas = computed(() => {
 
const searchTerm = searchText.value.toLowerCase();

return filterTableData(store.bas).filter(
 
  (ba: BasDados) =>
    ba.baUF.toLowerCase().includes(searchTerm) ||
    ba.baNumber.toString().includes(searchTerm) ||
    ba.baCentral.toLowerCase().includes(searchTerm) ||
    ba.name.toLowerCase().includes(searchTerm) ||
    ba.baStatus.toLowerCase().includes(searchTerm)
);
});

// Store para gerenciar os dados
const store = useDadosStore();
const ba1 = store.bas
// Função para atualizar uma BA
function updateBa(ba: BasDados, baNumber: number) {
// Exibe um alerta para confirmar a edição
const confirmed = window.confirm("Tem certeza que deseja editar este item?");
if (confirmed) {
  const { id, baCentral, baStatus, date, baUF,name } = ba;
onUpdateBa(id ?? "default-id", baCentral, baNumber, baStatus, date, baUF,name);
store.fetchBas();
}

}

// Função assíncrona para atualizar uma BA na API
async function onUpdateBa(
id: string,
baCentral: string,
baNumber: number,
baStatus: string,
date: string,
baUF: string,
name:string,
) {
await store.updateBa(id, baCentral, baNumber, baStatus, date, baUF,name);
}

// Função para deletar uma BA

const exportToExcel = async () => {
const workbook = new ExcelJS.Workbook();
const worksheet = workbook.addWorksheet('BA Data');

worksheet.columns = [
  { header: 'ID', key: 'id', width: 10 },
  { header: 'Nome', key: 'name', width: 20 },
  { header: 'UF', key: 'baUF', width: 10 },
  { header: 'Central', key: 'baCentral', width: 15 },
  { header: 'Número BA', key: 'baNumber', width: 15 },
  { header: 'Status', key: 'baStatus', width: 15 },
  { header: 'Data', key: 'date', width: 15 },
];

store.bas.forEach((ba, index) => {
  worksheet.addRow({
    id: index + 1,
    name: ba.name,
    baUF: ba.baUF,
    baCentral: ba.baCentral,
    baNumber: ba.baNumber,
    baStatus: ba.baStatus,
    date: ba.date,
  });
});

const buffer = await workbook.xlsx.writeBuffer();
const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
const url = URL.createObjectURL(blob);
const a = document.createElement('a');
a.href = url;
a.download = 'ba_data.xlsx';
a.click();
URL.revokeObjectURL(url);
};

// Função para deletar uma BA
function deleteBa(id) {
 
  store.deleteBa(id);
 
}
// Função executada após o componente ser montado
onMounted(() => {
store.fetchBas();

});
</script>


<style>
.span-name{


height:100% ;
width:10px ;
}
.table__loader{
  margin-top: 10rem;
display: flex;
justify-content: center;
align-items: center;
z-index: 999;
}
.loader {
  width: 300px; /* Ajuste o tamanho conforme necessário */
  height: 200px; /* Ajuste o tamanho conforme necessário */
  display: block;
  margin: auto;
  background-image: radial-gradient(circle 50px at 50px 50px, #FFF 100%, transparent 0), radial-gradient(circle 100px at 100px 100px, #FFF 100%, transparent 0), radial-gradient(circle 50px at 50px 50px, #FFF 100%, transparent 0), linear-gradient(#FFF 100px, transparent 0);
  background-size: 100px 100px, 200px 152px, 100px 100px, 240px 80px;
  background-position: 0px 60px, 50px 0px, 200px 60px, 30px 80px;
  background-repeat: no-repeat;
  position: relative;
  box-sizing: border-box;
}

.loader::after {
  content: '';
  left: 50%;
  bottom: 0;
  transform: translate(-50%, 0);
  position: absolute;
  border: 30px solid transparent;
  border-top-color: #FF3D00;
  box-sizing: border-box;
  animation: fadePush 1s linear infinite;
}

.loader::before {
  content: '';
  left: 50%;
  bottom: 60px;
  transform: translate(-50%, 0);
  position: absolute;
  width: 30px;
  height: 30px;
  background: #FF3D00;
  box-sizing: border-box;
  animation: fadePush 1s linear infinite;
}

@keyframes fadePush {
  0% {
    transform: translate(-50%, -15px);
    opacity: 0;
  }
  50% {
    transform: translate(-50%, 0px);
    opacity: 1;
  }
  100% {
    transform: translate(-50%, 15px);
    opacity: 0;
  }
}
 .icontable{
  height: 50px;
  width: 50px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.199);
  display: flex;
  justify-content: center;
  align-items: center;
  border: 1px solid rgba(0, 0, 255, 0.199);
  cursor: pointer;
  transition: transform 0.3s ease;
}

.icon:hover {
  transform: scale(1.1);
}

.name-img {
padding: 1rem 1rem 1rem 1rem;
height: 100%;
width: 100%;
border-radius: 50%;
background-size: cover;
background-color: rgba(0, 25, 247, 0.342);
font-size: 25px;
font-weight: 800;
text-align: center;
margin-right: 0.5rem;
color: whitesmoke;
}
.title {
color: rgb(172, 172, 250);
}
.button-delete {
cursor: pointer;
}
li {
list-style: none;
}
@keyframes pulseclosed {
0% {
  transform: scale(1);
  border-color: #f00; /* Cor forte de vermelho */
}
50% {
  transform: scale(1.05);
  border-color: #f88; /* Cor intermediária */
}
100% {
  transform: scale(1);
  border-color: #f00; /* Cor forte de vermelho */
}
}
@keyframes pulseopen {
0% {
  transform: scale(1);
  border-color: rgb(0, 255, 0); /* Cor forte de vermelho */
}
50% {
  transform: scale(1.05);
  border-color: rgb(136, 255, 146); /* Cor intermediária */
}
100% {
  transform: scale(1);
  border-color: rgb(0, 255, 34); /* Cor forte de vermelho */
}
}
.input-table {
text-transform: uppercase;
text-align: center;
line-height: 1.5; /* Ajuste conforme necessário para centralizar verticalmente */
font-size: 16px;

border-radius: 0.5rem;
background-color: transparent;
border: 1px solid transparent;
padding: 0.4rem 0.4rem 0.4rem 0.4rem;
transition: all 0.3s ease;
}
.input:hover {
border: 2px solid red;
transform: scale(1); /* Faz o input crescer em 5% */
font-size: 1.2em;
}
.input-table:focus {
border-color: #f00; /* Cor da borda quando o input está selecionado */
outline: none; /* Remove a borda de foco padrão */
transform: scale(1); /* Faz o input crescer em 5% */
font-size: 1.2em;
animation: pulseclosed 1s infinite; /* Aplica a animação de pulsação */
}
.input-table:hover {
border-color: #f00; /* Cor da borda quando o input está selecionado */
outline: none; /* Remove a borda de foco padrão */
transform: scale(1); /* Faz o input crescer em 5% */
font-size: 1.2em;
animation: pulseclosed 1s infinite; /* Aplica a animação de pulsação */
}

.status-open:hover {
animation: pulseopen 1s infinite; /* Aplica a animação de pulsação */
}

.status-open:focus {
animation: pulseopen 1s infinite; /* Aplica a animação de pulsação */
}

.status-cancelled {
border: 1px solid #ff0000; /* Cor da borda para status 'Cancelado' */
}

td:nth-child(3) input {
width: 3rem;
height: 2rem;
}

td:nth-child(4) input {
width: 4rem;
height: 2rem;
}

td:nth-child(5) input {
width: 8rem;
height: 2rem;
}

.menu li {
padding: 12px 16px;
text-decoration: none;
display: block;
}

.menu li:hover {
background-color: #f1f1f1;
}

main.table {
margin-top: 5rem;
width: 85vw;
height: 80vh;
background-color: var(--header-input-bg-color);

backdrop-filter: blur(7px);
box-shadow: 0 0.4rem 0.8rem #0005;
border-radius: 0.8rem;

overflow: hidden;
}

.table__header {
width: 100%;
height: 10%;
background-color: var(--header-bg-color);
padding: 0.8rem 1rem;

display: flex;
justify-content: space-between;
align-items: center;
}

.table__header .input-group {
width: 35%;
height: 100%;
background-color: var(--header-input-bg-color);
padding: 0 0.8rem;
border-radius: 2rem;

display: flex;
justify-content: center;
align-items: center;

transition: 0.2s;
}

.table__header .input-group:hover {
width: 45%;
background-color: var(--header-input-hover-bg-color);
box-shadow: 0 0.1rem 0.4rem #0002;
}

.table__header .input-group img {
width: 1.2rem;
height: 1.2rem;
}

.table__header .input-group input {
width: 100%;
padding: 0 0.5rem 0 0.3rem;
background-color: transparent;
border: none;
outline: none;
}

.table__body {
width: 95%;

max-height: calc(89% - 1.6rem);
background-color: var(--body-bg-color);

margin: 0.8rem auto;
border-radius: 0.6rem;

overflow: auto;
overflow: overlay;
}

.table__body::-webkit-scrollbar {
width: 0.5rem;
height: 0.5rem;
}

.table__body::-webkit-scrollbar-thumb {
border-radius: 0.5rem;
background-color: var(--scrollbar-thumb-color);
visibility: hidden;
}

.table__body:hover::-webkit-scrollbar-thumb {
visibility: visible;
}

table {
width: 100%;
}

td img {
width: 36px;
height: 36px;
margin-right: 0.5rem;
border-radius: 50%;

vertical-align: middle;
}

table,
th,
td {
border-collapse: collapse;
padding: 1rem;
text-align: left;
}

thead th {
position: sticky;
top: 0;
left: 0;
background-color: var(--header-sticky-bg-color);
cursor: pointer;
text-transform: capitalize;
}

tbody tr:nth-child(even) {
background-color: var(--scrollbar-thumb-color);
}

tbody tr {
--delay: 0.1s;
transition: 0.5s ease-in-out var(--delay), background-color 0s; /* Remova a transição da altura máxima */
overflow: hidden; /* Esconda o conteúdo excedente */

}

tbody tr.hide {
/* Remova a definição de max-height para não ter uma altura mínima */
overflow: hidden; /* Esconda o conteúdo excedente */
opacity: 0; /* Torna a linha completamente transparente */
padding: 0; /* Remove o preenchimento para não ocupar espaço */
transition: opacity 0.5s, padding 0s; /* Adicione a transição para a opacidade e preenchimento */
}

tbody tr:hover {
background-color: var(--hovered-row-bg-color) !important;
}

tbody tr td,
tbody tr td p,
tbody tr td img {
transition: 0.2s ease-in-out;
}

tbody tr.hide td,
tbody tr.hide td p {
padding: 0;
font: 0 / 0 sans-serif;
transition: 0.2s ease-in-out 0.5s;
}

tbody tr.hide td img {
width: 0;
height: 0;
transition: 0.2s ease-in-out 0.5s;
}

.status {
padding: 0.4rem 0.5rem;
border-radius: 2rem;
text-align: center;
}

.status.open,
.option.open {
background-color: var(--open-status-bg-color);
color: var(--open-status-text-color);
}
.status.open:hover,
.option.open:hover {
animation: pulseopen 1s infinite; /* Aplica a animação de pulsação */
}

.status.cancelled,
.option.cancelled {
background-color: var(--cancelled-status-bg-color);
color: var(--cancelled-status-text-color);
}
.status.cancelled:hover,
.option.cancelled:hover {
animation: pulseclosed 1s infinite; /* Aplica a animação de pulsação */
}

.option.open {
background-color: var(--open-status-bg-color);
color: var(--open-status-text-color);
}

.option.cancelled {
background-color: var(--cancelled-status-bg-color);
color: var(--cancelled-status-text-color);
}

@media (max-width: 1000px) {
td:not(:first-of-type) {
  min-width: 12.1rem;
}
}

thead th span.icon-arrow {
display: inline-block;
width: 1.3rem;
height: 1.3rem;
border-radius: 50%;
border: 1.4px solid transparent;

text-align: center;
font-size: 1rem;

margin-left: 0.5rem;
transition: 0.2s ease-in-out;
}

thead th:hover span.icon-arrow {
border: 1.4px solid var(--arrow-color);
}

thead th:hover {
color: var(--arrow-color);
}

thead th.active-th span.icon-arrow {
background-color: var(--arrow-color);
color: var(--export-btn-hover-bg-color);
}
thead th.active-th span.icon-arrow {
transform: rotate(180deg);
}

thead th.active,
tbody td.active {
color: var(--arrow-color);
}

.export__file {
position: relative;
}

.export__file .export__file-btn {
display: inline-block;
width: 3rem;
height: 3rem;
background: var(--export-btn-bg-color) url(../assets//images/export.png)
  center / 80% no-repeat;
border-radius: 50%;
transition: 0.2s ease-in-out;
}

.export__file .export__file-btn:hover {
background-color: var(--file-options-hover-bg-color);
transform: scale(1.15);
cursor: pointer;
}

.export__file input {
display: none;
}

.export__file .export__file-options {
position: absolute;
right: 0;

width: 12rem;
border-radius: 0.5rem;
overflow: hidden;
text-align: center;

opacity: 0;
transform: scale(0.8);
transform-origin: top right;

box-shadow: 0 0.2rem 0.5rem var(--scrollbar-thumb-color);

transition: 0.2s;
}

.export__file input:checked + .export__file-options {
opacity: 1;
transform: scale(1);
z-index: 100;
}

.export__file .export__file-options label {
display: block;
width: 100%;
padding: 0.6rem 0;
background-color: var(--file-options-bg-color);

display: flex;
justify-content: space-around;
align-items: center;

transition: 0.2s ease-in-out;
}

.export__file .export__file-options label:first-of-type {
padding: 1rem 0;
background-color: var(--open-status-bg-color) !important;
}

.export__file .export__file-options label:hover {
transform: scale(1.05);
background-color: var(--file-options-hover-bg-color);
cursor: pointer;
}

.export__file .export__file-options img {
width: 2rem;
height: auto;
}
</style>
