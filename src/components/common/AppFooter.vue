<template>
  <footer>
    <div class="Project">
      프로젝트명
    </div>
    <div class="Teams">
      팀원 : 이재석, 이주희, 최수현
    </div>
    <div class="devSpace">
      개발공간 : 
      <span @click="Address(notionAddress)">노션</span>
      <span @click="Address(githubAddress)">GIT</span>
    </div>
  </footer>
</template>

<script>
export default {
  data(){
    return {
      notionAddress: "https://www.notion.so/GOLFZON-TECH-ACADEMY-d63410815e924d6eb6c4697e17d0e3cf",
      githubAddress: "",
    }
  },
  methods: {
    Address(value){
      window.open(value)
    },
  },
}
</script>

<style scoped>
footer {
  background: rgb(200, 218, 243);
  display: flex;
  flex-direction: column;
  height: 20vh;
  font-weight: bold;
  letter-spacing: 0.1rem;
  justify-content: center;
  line-height: 5vh;
  padding: 0 1vw;
}
span {
  cursor: pointer;
  padding: 0px 5px
}
span:hover {
  color: white;
}
</style>
