<template>
  <div class="container">
    <video id="bgvid" playsinline autoplay muted loop poster="seabg.jpg">
      <source src="seabg.mp4" type="video/mp4" />
    </video>
    <header class="viewport-header">
      <h1>
        DeepWorks
      </h1>
      <p>Building tools for you to go deeper on fitness and focus.</p>
    </header>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'

export default Vue.extend({})
</script>

<style>
html, body {
  width: 100vw;
  height: 100vh;
  margin: 0;
  overflow: hidden;
}
video {
  object-fit: cover;
  width: 100vw;
  height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
}
.viewport-header {
  position: relative;
  height: 100vh;
  text-align: center;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0,0.25);
  padding: 0 25px;
}
.viewport-header > h1 {
  margin: 0;
  font-size: 125px;
  color: white;
  font-family: 'Raleway', serif;
}
.viewport-header > h1 + p {
  font-size: 25px;
  color: white;
  font-family: 'Open Sans', sans-serif;
}
@media screen and (max-width: 414px) {
  .viewport-header > h1 {
    font-size: 50px;
  }
  .viewport-header > h1 + p {
    font-size: 15px;
  }
}
</style>
