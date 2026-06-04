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
            <div v-if="show" class="modal-shadow">
                <div class="modal-content">
                    <button class="close-button" @click="closeModal">×</button>
                    <div class="modal-body">
                        <slot>{{ data }}</slot>
                    </div>
                    <div class="modal-footer">
                        <button class="save-button" @click="submitEdit">Edit this post</button>
                    </div>
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
  padding: 20px;
}

.modal-content {
  background: white;
  position: relative;
  border-radius: 8px;
  position: relative;
  min-width: 600px;
  max-height: 95vh;
  display: flex;
  flex-direction: column;
  box-shadow: 0 20px 25px -5px rgb(0 0 0 / 0.1);
}

.modal-body {
  padding: 40px 40px 20px 40px;
  overflow-y: auto; /* Включает вертикальный скролл при переполнении */
  flex-grow: 1;
}

.modal-footer {
  padding: 20px 40px 30px 40px;
  border-top: 1px solid #f3f4f6;
  background-color: #f9fafb;
  border-bottom-left-radius: 12px;
  border-bottom-right-radius: 12px;
}

.save-button {
  display: inline-block;
  width: 100%;
  padding: 12px;
  background-color: #0284c7;
  color: white;
  font-weight: 500;
  text-align: center;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
}
.save-button:hover {
  background-color: #0369a1;
}

.close-button {
  position: absolute;
  top: 5px;
  right: 20px;
  border: none;
  background: none;
  cursor: pointer;
  font-size: 1.8rem;
  color: #ef4444;
  z-index: 10;
  transition: color 0.2s;
}
.close-button:hover {
  color: red;
}
</style>