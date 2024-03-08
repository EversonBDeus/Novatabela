<template>

    <header class="header__nav">
      <NuxtLink to="/">
        <a  class="header__title" href="#">Home</a>
        </NuxtLink>
     
      <nav class="nav__bar">
        <span class="header__option">
          <h1 class="header__title">Tema de cor</h1>
    <select v-model="colorMode.preference">
      <option value="sys">System</option>
      <option value="light">DarkGreen</option>
      <option value="dark">DarkBlue</option>
      <option value="serpia">Serpia</option>
    </select>
        </span>
       
      </nav>
    </header>

  

    <div>
  
  </div>

</template>

<script setup lang="ts">
const colorMode = useColorMode()






  
</script>

<style lang="css" >



.header__nav{
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 60px;
  padding: 20px 100px;
 
  display: flex;
  justify-content: space-between;
  align-items: center;
 
  z-index: 10000; /* Adicione esta linha */
}
.header__title{
  color: #ebf4f1;
  font-size: 25px;
  text-decoration: none;
  font-weight: 600;
  cursor: pointer;
}
.sys-mode body{
  background-image: linear-gradient(to right top, #30303000, #3d3d3d17, #21212148),url('../assets/images/blue.jpg');
}

.sys-mode  .header__nav{
background-color: #252525 ;
}
.sys-mode .graph__container{
background-color: #395886b9;
backdrop-filter: blur(7px);
box-shadow: 0 0.4rem 0.8rem #0005;

}
.sys-mode main.table {
background-color: var(--header-input-bg-color);
backdrop-filter: blur(7px);
box-shadow: 0 0.4rem 0.8rem #0005;
}
.sys-mode  .table__header {
background-color: var(--header-bg-color);
}
.sys-mode  .table__header .input-group {
background-color: var(--header-input-bg-color);
}
.sys-mode .table__header .input-group:hover {
background-color: var(--header-input-hover-bg-color);
box-shadow: 0 0.1rem 0.4rem #0002;
}
.sys-mode .table__body {
 
    background-color: var(--body-bg-color);
   
}










.light-mode body{
  background-image: linear-gradient(to right top, #303030d5, #3d3d3ddc, #212121d3),url('../assets/images/vector/6.jpg');
}


.light-mode .header__nav{
background-color: #000000 ;
}
.light-mode .graph__container{

background-color: #424242d8;

box-shadow: 0 0.4rem 0.8rem #90EE90;

}
.light-mode  main.table {
background-color: #424242d7;
box-shadow: 0 0.4rem 0.8rem #222222e0;

}
.light-mode .table__body {
background-color: #F5FFFA;
}
.light-mode .table__header{

background-color: #7deb7d;
}
.light-mode thead th{
background-color: #C2FFE1;
}
.light-mode .title {
color: white;
}
.light-mode thead th:hover {
color: rgb(9, 138, 20);
}
.light-mode thead th:hover span.icon-arrow {
    border: 1.4px solid rgb(9, 138, 20);
}
.light-mode .input-table {
font-size: 16px;
color: grey;

}
.light-mode .button-primary, .button__add {
  background: #07860d ;
}
  


.light-mode thead th.active-th span.icon-arrow {
background-color:#7deb7d;
color: grey;
}
.light-mode thead th.active-th span.icon-arrow {
  background-color:#7deb7d;
  color: grey;
}


.light-mode thead th.active,
tbody td.active {
  color: #f1c583;
}



.dark-mode body {
  /* Combina a imagem de fundo e o gradiente azul por cima */
  background-image:  linear-gradient(to left, #022b42bd, #02334ed0, #013c5ad7, #014367ce, #004d74), url('../assets/images/vector/2.jpg');
 

  color: #032030;

  background-size: cover; /* Garante que a imagem de fundo cubra todo o elemento */
  background-position: center; /* Centraliza a imagem de fundo */

  /* Adiciona um pouco de transparência ao gradiente para que a imagem seja mais visível */
 
}




.dark-mode .header__nav{
  background-color: #022B42;
}
.dark-mode .graph__container{

  background-color: #022b4265;


}
.dark-mode  main.table {
 
  background-color: #003554e3;
  box-shadow: 0 0.4rem 0.8rem #004d74;

}
.dark-mode .table__body {
  background-color: #006594de;
}
.dark-mode .table__header{

  background-color: #022b42;
}
.dark-mode .input-table{
  font-size: 16px;
color: rgb(228, 224, 224);
 
}



.serpia-mode body {


  background-image: linear-gradient(to right top, #303030d5, #3d3d3ddc, #212121d3), url('../assets/images/vector/11.jpg') ;
  color: #433422;
  background-size: cover; /* Garante que a imagem de fundo cubra todo o elemento  5 6 7 8 11 */
  background-position: center; /* Centraliza a imagem de fundo */
 /* Rotaciona a imagem em 90 graus */
}


.serpia-mode .header__nav{
  background-color: #f1c583 ;
}
.serpia-mode .graph__container{

  background-color: #F1D9B5;


}
.serpia-mode  main.table {
 
  background-color: #f1d9b5cc;
  box-shadow: 0 0.4rem 0.8rem #5a5959f5;

}
.serpia-mode .table__body {
  background-color: #ffe5bef6;
}
.serpia-mode .table__header{

  background-color: #f1c583;
}
.serpia-mode thead th{
  background-color: #f1c583;
}
.serpia-mode .title {
  color: white;
}
.serpia-mode thead th:hover {
  color: white;
}
.serpia-mode .input-table {
  font-size: 16px;
color: grey;
 
}

.serpia-mode thead th.active-th span.icon-arrow {
  background-color:#f1c583;
  color: #f1c583;
}


.serpia-mode thead th.active,
tbody td.active {
  color: #f1c583;
}

</style>