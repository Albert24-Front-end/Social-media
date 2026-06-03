<script setup lang="ts">
defineProps<{
    show: boolean,
    data: unknown,
}>()

const emit = defineEmits(["edit", "close"])

function closeModal() {
    emit("close")
}

function submitEdit() {
    emit("edit")
}
</script>

<template>
    <Teleport to="body">
        <transition name="fade">
            <div v-if="show" class="modal-shadow" @click.self="closeModal">
                <div class="modal-content">
                    <button class="close-button" @click="closeModal">×</button>
                    <slot>{{ data }}</slot>
                    <button class="inline-block px-3 py-2 bg-sky-600 border border-sky-700 text-white cursor-pointer" @click="submitEdit">Edit this post</button>
                </div>
            </div>
        </transition>
    </Teleport>
</template>

<style scoped>
.fade-enter-active, .fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

.modal-shadow {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 50px;
  border-radius: 8px;
  position: relative;
  min-width: 300px;
}

.close-button {
  position: absolute;
  top: 2px;
  right: 10px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1.8rem;
  color: red;
}
</style>