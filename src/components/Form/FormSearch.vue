<template>
  <form class="searchBox">
    <input v-model="searchWord" type="text" class="searchWord" @keydown.enter.prevent="searchSubmit">
    <i class="fa-solid fa-magnifying-glass" @click.prevent="searchSubmit" />
  </form>
</template>

<script>
export default {
  data(){
    return {
      searchWord: '',
    }
  },
  methods: {
    searchSubmit(){
      console.log(this.searchWord)
    },
  },
}
</script>

<style scoped>
.searchBox {
  display: flex;
  border: 1px solid gray;
  border-radius: 5px;
  padding: 5px;
  background: white;
  margin-left: 20px;
  width: 20vw;
  height: 2vh;
}
.searchWord {
  width: 18vw;
  border: 0;
}
.searchWord:focus {
  outline: none;
}
</style>