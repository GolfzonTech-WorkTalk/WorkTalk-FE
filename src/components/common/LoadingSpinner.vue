<template>
  <div class="spinner-container">
    <div class="spinner" />
  </div>
</template>

<script>
export default {}
</script>

<style scoped>
.spinner-container {
  top: 30%;
  left: 48%;
  position: fixed;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 240px;
  z-index: 2;
}
.spinner {
  width: 50px;
  height: 50px;
  border-radius: 50%;
  border: 10px solid #e0e0e0;
  border-bottom: 10px solid rgb(103, 139, 218);
  animation: spin 1s linear infinite;
  position: relative;
}
@keyframes spin {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>