<template>
  <div>
    <AppHeader />
    <main>
      <router-view></router-view>
    </main>
  </div>
</template>

<script setup lang="ts">
import AppHeader from '../components/widgets/AppHeader.vue'
import { RouterView } from 'vue-router'
</script>