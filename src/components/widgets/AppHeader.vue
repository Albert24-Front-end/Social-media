<template>
  <header class="app-header">
    <div class="header-container">
      <div class="logo">
        <h1>SocialMedia</h1>
      </div>
      <div class="desktop-menu hidden md:flex text-sm lg:text-base">
        <ul class="w-full pl-10 md:pl-25 lg:pl-40 xl:pl-50 flex justify-between items-center gap-2.5 md:gap-5 lg:gap-5.5">
          <li v-for="l in links" :key="l.name" class="py-1 px-2 hover:cursor-pointer hover:duration-500 hover:bg-[#FFCC00] rounded-lg text-wrap text-center">
            <router-link class="header-link" :to="l.path">
              {{ l.text }}
            </router-link>
          </li>
          <!-- <li class="py-1 px-2 hover:cursor-pointer rounded-lg"><LanguageSwitcher/></li> -->
        </ul>
      </div>
      <div class="header-actions">
        <button class="search-btn">🔍</button>
        <button class="notification-btn">🔔</button>
        <button class="user-btn">👤</button>
      </div>

      <div class="burger-menu-button md:hidden mt-2 text-sm lg:text-base">
       <button @click="toggleMenu" aria-label="Open menu" class="transition-transform duration-300" :class="isMenuOpen ? 'rotate-90' : 'rotate-0'">
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path fill="#FFCC00" d="M3 6h18v2H3zm0 5h18v2H3zm0 5h18v2H3z" />
            </svg>
          </span>
        </button>
      </div>

      <div v-if="isMenuOpen" class="mobile-menu absolute top-3 right-3 px-3 py-3 flex-column md-hidden bg-slate-50 z-10 transition-all duration-300 animate-[fadeIn_0.3s_ease] rounded-[18px] text-sm lg:text-base">
        <button class="flex justify-self-end transition-transform duration-300 hover:rotate-90" @click="closeMenu" aria-label="Close menu">
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <path
                fill="#FFCC00"
                d="M19 6.41L17.59 5L12 10.59L6.41 5L5 6.41L10.59 12L5 17.59L6.41 19L12 13.41L17.59 19L19 17.59L13.41 12z"
              />
            </svg>
          </span>
        </button>

        <ul class="w-full flex-column justify-between items-center gap-3 md:gap-5 lg:gap-7 pt-6">
          <li v-for="l in links" :key="l.name" class="py-4 px-2 hover:cursor-pointer hover:duration-500 hover:bg-[#FFCC00] rounded-lg text-wrap">
            <router-link class="header-link" :to="l.path"
              >{{ l.text }}</router-link
            >
          </li>
          <!-- <li class="hover:cursor-pointer rounded-lg py-4 px-2"><LanguageSwitcher/></li> -->
        </ul>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
defineOptions({
  name: 'AppHeader',
});

import { onMounted, onBeforeMount, ref } from 'vue'
import { RouterLink } from 'vue-router'

const links = ref([
  { name: 'Explore', path: '/', text: 'Explore' },
  { name: 'Messages', path: '/', text: 'Messages' },
  { name: 'Profile', path: '/', text: 'Profile' },
])

const isMenuOpen = ref(false)
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value
}

const closeMenu = () => {
  isMenuOpen.value = false
}

const handleWidth = () => {
  if (window.innerWidth >= 768) {
    closeMenu()
  }
}

onMounted(() => {
  window.addEventListener('resize', handleWidth)
})
onBeforeMount(() => {
  window.removeEventListener('resize', handleWidth)
})
</script>

<style scoped>
.app-header {
  background-color: #fff;
  border-bottom: 1px solid #e0e0e0;
  position: sticky;
  top: 0;
  z-index: 100;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
}

.header-container {
  display: flex;
  align-items: center;
  justify-content: space-between;
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  height: 60px;
}

.logo h1 {
  font-size: 24px;
  font-weight: 700;
  margin: 0;
  color: #1f2937;
}

.nav-menu {
  display: flex;
  gap: 30px;
  flex: 1;
  margin-left: 40px;
}

.nav-link {
  text-decoration: none;
  color: #6b7280;
  font-weight: 500;
  transition: color 0.3s ease;
}

.nav-link:hover {
  color: #1f2937;
}

.header-actions {
  display: flex;
  gap: 15px;
  align-items: center;
}

.search-btn,
.notification-btn,
.user-btn {
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  padding: 8px;
  border-radius: 50%;
  transition: background-color 0.3s ease;
}

.search-btn:hover,
.notification-btn:hover,
.user-btn:hover {
  background-color: #FFCC00;
}

@media (max-width: 768px) {
  .nav-menu {
    display: none;
  }

  .header-container {
    padding: 0 15px;
  }

  .logo h1 {
    font-size: 20px;
  }
}
</style>