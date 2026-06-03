<script setup lang="ts">
import type { Post } from '../App.vue';

const props = defineProps<{
    post: Post
}>()

const emit = defineEmits(["delete", "openModal", "toggleFavoured"]);

function deletePost() {
    emit("delete", props.post);
}

function openModal() {
    emit("openModal", props.post);
}

function toggleFavoured() {
    emit("toggleFavoured", props.post);
}


</script>

<template>
    <div class="flex justify-between items-end p-4 bg-gray-50 border border-gray-100">
        <div>
            <h4 class="mb-2 font-bold text-lg text-gray-700">{{ post.title }}</h4>
            <div v-if="post.image" class="my-3 overflow-hidden rounded border border-gray-200 max-h-48 flex items-center justify-center bg-white">
                <img :src="post.image" alt="Post preview" class="w-full h-full object-cover">
            </div>
            <p class="text-sm text-gray-500">{{ post.content }}</p>
        </div>
        <div class="flex items-center gap-4">
            <button @click="deletePost" class="cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path fill="none" stroke="red" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21q.512.078 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48 48 0 0 0-3.478-.397m-12 .562q.51-.088 1.022-.165m0 0a48 48 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a52 52 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a49 49 0 0 0-7.5 0" /></svg></button>
            <button @click="openModal" class="cursor-pointer"><svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path fill="none" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="m16.862 4.487l1.687-1.688a1.875 1.875 0 1 1 2.652 2.652L6.832 19.82a4.5 4.5 0 0 1-1.897 1.13l-2.685.8l.8-2.685a4.5 4.5 0 0 1 1.13-1.897zm0 0L19.5 7.125" /></svg></button>
            <button @click="toggleFavoured" class="cursor-pointer" :class="post.isFavoured ? 'text-sky-300' : 'none'"><svg xmlns="http://www.w3.org/2000/svg" width="1.2em" height="1.2em" viewBox="0 0 24 24"><path :fill="post.isFavoured ? 'currentColor' : 'none'" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.56.56 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.56.56 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.56.56 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.56.56 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.56.56 0 0 0 .475-.345z" /></svg></button>
        </div>
    </div>
</template>

<style scoped></style>