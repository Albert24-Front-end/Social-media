<template>
  <header class="app-header">
    <div class="header-container">
      <div class="logo">
        <h1>SocialMedia</h1>
      </div>
      <nav class="nav-menu">
        <a href="#home" class="nav-link">Home</a>
        <a href="#explore" class="nav-link">Explore</a>
        <a href="#messages" class="nav-link">Messages</a>
        <a href="#profile" class="nav-link">Profile</a>
      </nav>
      <div class="header-actions">
        <button class="search-btn">🔍</button>
        <button class="notification-btn">🔔</button>
        <button class="user-btn">👤</button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
defineOptions({
  name: 'AppHeader',
});
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
  background-color: #f3f4f6;
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