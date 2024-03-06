<script setup lang="ts">
// Importando funções e tipos necessários
import { defineComponent, ref, computed, onMounted } from "vue";
import { useDadosStore } from "../stores/state";

// Obtendo a instância da store
const store = useDadosStore();

// Executa após o componente ser montado para buscar os dados iniciais
onMounted(() => {

  store.fetchBas();

  // Verifica se há um nome salvo no localStorage
  const savedName = localStorage.getItem('savedName');
  if (savedName) {
    store.name = savedName;
  }
});

// Variável reativa para controlar a exibição de um componente
const viewshow = ref<boolean>(false);

// Função para adicionar uma BA
const addBas = (
  baCentral: string,
  baStatus: string,
  baNumber: number,
  baUF: string,
  name:string,
) => {
  store.addBas(baCentral, baStatus, baNumber, baUF,name);
  // Salva o nome no localStorage
  localStorage.setItem('savedName', name);
  // Limpa os outros campos após adicionar um BA
  store.baUF = '';
  store.baCentral = '';
  store.baNumber = 0;
  store.baStatus = 'Aberto'; // ou qualquer valor padrão desejado
  viewshow.value = false; // Esconde o componente após a adição
  viewshow.value = false; // Esconde o componente após a adição
};

// Função para atualizar uma BA
const updateBa = (
  selectedId: string | null,
  baCentral: string,
  baNumber: number,
  baStatus: string,
  baUF: string,
  name:string,
) => {
  // Atualiza a BA com a data atual
  store.updateBa(
    selectedId,
    baCentral,
    baNumber,
    baStatus,
    `${store.month}, ${store.day} ${store.year}`,
    baUF,
    name
  );
  viewshow.value = false; // Esconde o componente após a atualização
};
</script>

<template>
  <!-- Popup de adição de BA -->
  <transition name="bounce">
    <div class="popup-box" v-show="viewshow">
      <div class="popup">
        <div class="content">
          <header>
            <p>Adicione um novo BA</p>
            <!-- Botão de fechar -->
            <span @click="viewshow = false" class="bx bx-x">
              <Icon name="material-symbols:close" color="black" size="25px"/>
            </span>
          </header>
 
          <form action="#">
            <div class="row baCentral">
              <label>Nome</label>
              <!-- Campo de input para UF -->
              <input
                class="input-add"
                type="text"
                v-model.trim="store.name"
                maxlength="15"
                minlength="2"
                required
                :class="{ active: store.isInvalid }"
              />
            </div>
          
            <div class="row baCentral">
              <label>UF</label>
              <!-- Campo de input para UF -->
              <input
                class="input-add"
                type="text"
                v-model.trim="store.baUF"
                maxlength="2"
                minlength="2"
                required
                :class="{ active: store.isInvalid }"
              />
            </div>
            <div class="row baCentral">
              <label>Central</label>
              <!-- Campo de input para Central -->
              <input
                class="input-add"
                type="text"
                v-model.trim="store.baCentral"
                maxlength="5"
                minlength="3"
                required
                :class="{ active: store.isInvalid }"
              />
            </div>
            <div class="row baCentral">
              <label>BA</label>
              <!-- Campo de input para BA -->
              <input
                class="input-add"
                type="text"
                v-model.trim="store.baNumber"
                maxlength="9"
                minlength="9"
                required
                :class="{ active: store.isInvalid }"
              />
            </div>
            <div class="row baCentral">
              <label>Status</label>
              <!-- Select para status -->
              <select
                v-model="store.baStatus"
                class="select"
                :class="{
                  green: store.baStatus === 'Aberto',
                  red: store.baStatus === 'Encerrado',
                }"
              >
                <option value="Aberto" selected>Aberto</option>
                <option value="Encerrado">Encerrado</option>
              </select>
            </div>
            
            <!-- Botão para adicionar -->
            <button class="button__add"
              @click.prevent="
                addBas(
                  store.baUF,
                  store.baCentral,
                  store.baNumber,
                  store.baStatus,
                  store.name)">Adicionar </button>
                  
          </form>
        </div>
      </div>
    </div>
  </transition>

    <!-- content for the toadd slot -->
      <!-- Botão de adicionar -->
    <li class="add-box" @click="viewshow = !viewshow">
    <button class="button-primary">ADICIONAR  </button>
  </li>




  
</template>

<style>

  
.select {
  height: 2.9em;
  width: 8rem;
  padding: 0.5rem;
  text-align: center;
  font-weight: 800;
  cursor: pointer;
}
/* Estilo para a primeira opção */
.select option:nth-child(1) {
  background: #6af882;
}

/* Estilo para a segunda opção */
.select option:nth-child(2) {
  background: #f86a6a;
}
.green {
  background-color: #6af882;
}

.red {
  background-color: #f86a6a;
}
.input-add {
  height: 2em;
  width: 2rem;
  padding: 0.5rem;
  
}
.plus-circle {
  background-color: white;
  height: 35px;
  width: 35px;
  justify-content: center;
  border-radius: 50%;
  font-size: 30px;
}
.active {
  border: 2px solid red !important;
}
.wrapper {
  margin: 50px;
  display: grid;
  gap: 15px;
  grid-template-columns: repeat(
    auto-fill,
    minmax(265px, 1fr)
  ); /* Adjust the column width as needed */
  width: 100%; /* Set the width to fill the parent container */
}
.wrapper li {
  list-style: none;
  background: #fff;
  height: 0px;
  border-radius: 5px;
  padding: 15px 20px 20px;
}
.add-box,
.icon,
.bottom-content,
.settings .menu li,
header,
.popup {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.add-box {
  flex-direction: column;
  justify-content: center;
  cursor: pointer;
}

.add-box p {
  color: #88abff;
  font-weight: 500;
  margin-top: 20px;
}

.wrapper .note {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
}

.note p {
  font-size: 22px;
  font-weight: 500;
  max-height: 30px;
  white-space: nowrap; /* Impede que o texto quebre */
  overflow: hidden; /* Esconde o texto que ultrapassa a largura */
  text-overflow: ellipsis; /* Adiciona "..." ao texto que ultrapassa a largura */
  margin-bottom: 1rem;
  border-bottom: 1px solid #ccc;
}
.note span {
  display: block;
  margin-top: 5px;
  color: #575757;
  height: 100%;
  width: 100%;
  font-size: 16px;
  max-height: 130px;
  word-wrap: break-word; /* Permite que palavras longas quebrem e continuem na próxima linha */
  overflow: auto; /* ou scroll, ou auto */
  text-overflow: ellipsis; /* Adiciona "..." ao texto que ultrapassa a largura */
}
.note .bottom-content {
  padding-top: 10px;
  border-top: 1px solid #ccc;
}

.menu li:hover {
  background: #f5f5f5;
}
.menu li i {
  padding-right: 8px;
}

.bounce-enter-active {
  animation: bounce-in 0.3s;
}
.bounce-leave-active {
  animation: bounce-in 0.3s reverse;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.popup-box {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 2;
  background: rgba(0, 0, 0, 0.4);
}
.popup-box .popup {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  justify-content: center;
  width: 100%;
  max-width: 400px;
  z-index: 3;
}

.popup .content {
  width: calc(100% - 15px);
  background: #fff;
  border-radius: 5px;
}
.popup .content header {
  padding: 15px 25px;
  border-bottom: 1px solid #ccc;
}
.content header p {
  color: #8b8989;
  font-weight: 500;
  font-size: 20px;
}
.content header i {
  color: #8b8989;
  font-size: 23px;
  cursor: pointer;
}
.content form {
  margin: 15px 25px 35px;
}
.content form .row {
  margin-bottom: 20px;
}
form .row label {
  display: block;
  font-size: 18px;
  margin-bottom: 6px;
}
.content form :where(input, textarea) {
  width: 100%;

  font-size: 17px;
  padding: 0 15px;
  border-radius: 4px;
  border: 1px solid #999;
  outline: none;
}

form textarea {
  height: 150px;
  resize: none;
  padding: 8px 15px;
}

.button-primary {
  width: 8rem !important;
  margin-top: 1rem;
}
.content form button,
.button-primary {
  width: 100%;
  height: 50px;
  border: none;
  outline: none;
  color: #fff;
  font-size: 17px;
  border-radius: 4px;
  background: #6a93f8;
  cursor: pointer;
}
</style>
