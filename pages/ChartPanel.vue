<template>
    <div>
        <section class="graph__container">
          <span class="graph__option">
          <h1>Data:</h1>
    <select  v-model="selectedPeriod" @change="updateSelectedPeriod">
      <option value="day">Dia</option>
      <option value="week">Semana</option>
      <option value="month">Mes</option>
      <option value="total">Total</option>
    </select>
        </span>
            <NameGraph/>
            <UfGraph/>
            <CentralGraph/>
           
        </section>
    </div>
</template>

<script setup lang="ts">
import { useDadosStore } from "../stores/state";
const store = useDadosStore();
let selectedPeriod = store.selectedPeriod;

function updateSelectedPeriod(event: Event) {
  store.setSelectedPeriod(selectedPeriod);
}
</script>

<style >
.graph__container{
   
padding: 3rem 3rem;
  width: 72vw;
  height: 90vh;
  background-color: var(--header-input-bg-color);
margin-top: 10rem;
  backdrop-filter: blur(7px);
  box-shadow: 0 0.4rem 0.8rem #0005;
  border-radius: 0.8rem;
  overflow-y: auto;
  height: calc(100% - 60px);
}
</style>

