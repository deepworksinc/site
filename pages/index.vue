<template>
  <div class="container">
    <video id="bgvid" playsinline autoplay muted loop poster="seabg.jpg">
      <source src="seabg.mp4" type="video/mp4" />
    </video>
    <header class="viewport-header">
      <img src="deepworks-logo.png" />
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
}
.viewport-header > img {
  margin: 0;
  filter: invert(1);
  max-width: 650px;
  width: 90vw;
}
.viewport-header > img + p {
  font-size: 22.5px;
  color: white;
  font-family: 'Open Sans', sans-serif;
  max-width: 650px;
  width: 90vw;
}
@media screen and (max-width: 414px) {
  .viewport-header > img {
    font-size: 50px;
  }
  .viewport-header > img + p {
    font-size: 15px;
  }
}
</style>
