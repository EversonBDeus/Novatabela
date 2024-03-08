<template>
  <div>
      <section class="central__graph">
        <h1 class="container__title">Quantidade de Ba por Central </h1>
          <div class="container">
            
              <div class="skill-box" v-for="(item, index) in sortedItems" :key="index">
                  <span class="title">{{ item.central }}</span>
                  <div class="skill-bar">
                      <span class="skill-per" :style="{ width: item.count * 20 + '%' }">
                          <span class="tooltip"> {{ item.count }}</span>
                      </span>
                  </div>
              </div>
          </div>
      </section>
      <hr>
  </div>
</template>

<script setup lang="ts">
import { useDadosStore } from "../stores/state";
import { watchEffect, ref } from "vue";

const store = useDadosStore();

let itemsPerCentral = ref([] as { central: string, count: number }[]);

watchEffect(() => {
  const data = store.calculateItemsPerCentral(store.selectedPeriod);
  const items = Object.keys(data).map(central => ({ central, count: data[central] }));
  itemsPerCentral.value = items.sort((a, b) => b.count - a.count);
});

const sortedItems = ref(itemsPerCentral.value);
watchEffect(() => {
  sortedItems.value = itemsPerCentral.value.sort((a, b) => b.count - a.count);
});
</script>


<style  >
.container{
    position: relative;
    max-width: 97%;
    width: 100%;
    background: #ffffff1f;
    margin: 0 15px;
    padding: 10px 20px;
    border-radius: 7px;
    display: grid;
    grid-template-columns: repeat(3, 250px); 
    gap: 20px;
}
@media screen and (max-width: 1370px) {
    .container {
        grid-template-columns: repeat(3, 1fr); /* 3 colunas quando a tela for menor que 1200px */
    }
}

@media screen and (max-width: 900px) {
    .container {
        grid-template-columns: repeat(2, 1fr); /* 2 colunas quando a tela for menor que 900px */
    }
}

@media screen and (max-width: 600px) {
    .container {
        grid-template-columns: repeat(1, 1fr); /* 1 coluna quando a tela for menor que 600px */
    }
}
.container__title{
  color: white;
  margin-bottom: 2rem;
  margin-top: 2rem;
}
.skill-box {
    position: relative;
    margin: 1rem;
}

.title {
    position: absolute;
    top: 60%;
    left: 10px; /* Ajuste conforme necessário */
    transform: translateY(-50%);
    z-index: 2;
   
  
}

.container .skill-box{
    width: 100%;
    margin: 15px 0;
}
.skill-box .title{
    display: block;
    font-size: 14px;
    font-weight: 600;
    color: #ffffff;
}
.skill-box .skill-bar{
    height: 20px;
    width: 100%;
    border-radius: 6px;
    margin-top: 6px;
    background: rgba(0,0,0,0.1);
}
.skill-bar .skill-per{
    position: relative;
    display: block;
    height: 100%;
    width: 90%;
    border-radius: 6px;
    background: #4070f4;
    animation: progress 0.4s ease-in-out forwards;
    opacity: 0;
}
.skill-per{
  width: 2rem;
    animation-delay: 0.1s;
}


@keyframes progress {
    0%{
        width: 0;
        opacity: 1;
    }
    100%{
        opacity: 1;
    }
}
.skill-per .tooltip{
    position: absolute;
    right: -14px;
    top: -28px;
    font-size: 12px;
    font-weight: 500;
    color: #fff;
    padding: 2px 6px;
    border-radius: 3px;
    background: #4070f4;
    z-index: 1;
}
.tooltip::before{
    content: '';
    position: absolute;
    left: 50%;
    bottom: -2px;
    height: 10px;
    width: 10px;
    z-index: -1;
    background-color: #4070f4;
    transform: translateX(-50%) rotate(45deg);
}
</style>