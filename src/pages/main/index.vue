<script setup lang="ts">
import { computed, onMounted, useTemplateRef } from 'vue';
import EditModal from '../../components/EditModal.vue';
import PostItem from '../../components/PostItem.vue';
import type { Post } from '../../types/index.ts';
import { usePosts } from '../../composables/usePosts.ts';
import useVuelidate from "@vuelidate/core";
import { helpers, required } from "@vuelidate/validators";

const { editingPost, newPost, regularPosts, favouredPosts, toggleFavoured, openEditModal, isEditModalOpen, handleEditImageChange, fetchPosts, storePost, saveEditedPost, deletePost } = usePosts();
const editState = computed(() => editingPost.value || { title: '', content: '' });

const imageInput = useTemplateRef<HTMLInputElement>('imageInput');

const rules = computed(() => ({
  title: { required: helpers.withMessage("Type some title, please", required) },
  content: { required: helpers.withMessage("Don't you have something to write?", required) },
}));

const v$ = useVuelidate(rules, newPost);
const v$$ = useVuelidate(rules, editState);

onMounted(() => {
  fetchPosts();
})

const onFormSubmit = async () => {
  const isFormValid = await v$.value.$validate();
  if (!isFormValid) return;

  const file = imageInput.value?.files?.[0];
  storePost(file);

  v$.value.$reset();

  if (imageInput.value) {
    imageInput.value.value = '';
  }
};

const onEditSubmit = async () => {
  const isFormValid = await v$$.value.$validate();

  if (!isFormValid) return;
  await saveEditedPost();
  v$$.value.$reset();
};
</script>

<template>
  <div class="container w-3/4 mx-auto p-4">
    <div class="bg-white border border-gray-200 p-4">
      <form class="flex flex-col items-start gap-4" @submit.prevent="onFormSubmit">
        <div class="w-full">
          <input v-model="newPost.title" type="text" placeholder="Title" class="p-4 border border-gray-200 w-full" :class="v$.title.$error ? 'border-red-500 bg-red-50' : 'border-gray-200'" @blur="v$.title.$touch()">
          <span v-if="v$.title.$error" class="text-red-500 text-xs font-semibold mt-1 block">
            {{ v$.title.$errors[0].$message }}
          </span>
        </div>

        <label class="p-4 border border-gray-200 border-dashed rounded w-full flex items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 text-gray-500 transition-colors">
          <div class="text-sm font-medium flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><g fill="currentColor"><path d="M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9"/><path fill-rule="evenodd" d="M9.344 3.071a50 50 0 0 1 5.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71q.579.081 1.152.177c1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3V9.574c0-1.416.997-2.67 2.429-2.909q.573-.096 1.151-.178a1.56 1.56 0 0 0 1.11-.71l.822-1.315a2.94 2.94 0 0 1 2.332-1.39M6.75 12.75a5.25 5.25 0 1 1 10.5 0a5.25 5.25 0 0 1-10.5 0m12-1.5a.75.75 0 1 0 0-1.5a.75.75 0 0 0 0 1.5" clip-rule="evenodd"/></g></svg>
            <span>Click to select an image</span>
          </div>
          <input ref="imageInput" accept="image/*" type="file" class="hidden">
        </label>

        <div class="w-full">
          <textarea v-model="newPost.content" placeholder="Content" class="p-4 border border-gray-200 w-full" :class="v$.content.$error ? 'border-red-500 bg-red-50' : 'border-gray-200'" @blur="v$.content.$touch()"></textarea>
          <span v-if="v$.content.$error" class="text-red-500 text-xs font-semibold mt-1 block">
            {{ v$.content.$errors[0].$message }}
          </span>
        </div>
        <button class="inline-block px-3 py-2 bg-sky-600 border border-sky-700 text-white cursor-pointer">Store your post</button>
      </form>
    </div>
    <div class="mt-6 border-t pt-4">
      <h3 class="font-bold text-lg mb-2">Posts feed:</h3>

      <div v-if="regularPosts.length === 0" class="text-gray-400">No posts here yet...</div>

      <div v-else class="flex gap-4">
        <div class="w-1/2 flex flex-col gap-3">
          <h3>Posts</h3>
          <PostItem v-for="post in regularPosts" :key="post.id" :post="post" @delete="deletePost(post.id)" @open-modal="openEditModal" @toggle-favoured="toggleFavoured"/>
        </div>
        <div class="w-1/2 flex flex-col gap-3">
          <h3>Favoured posts</h3>
          <PostItem v-for="post in favouredPosts" :key="post.id" :post="post" @delete="deletePost(post.id)" @open-modal="openEditModal" @toggle-favoured="toggleFavoured"/>
        </div>
      </div>
    </div>
    <EditModal :show="isEditModalOpen" @close="isEditModalOpen = false" :data="editingPost" @edit="onEditSubmit">
      <div v-if="editingPost" class="modal flex flex-col items-start gap-4" >
        <label class="text-xs font-bold text-gray-500 uppercase">Change post title:</label>
        <input v-model="editingPost.title" type="text" placeholder="Title" class="p-4 border border-gray-200 w-full" :class="v$$.title.$error ? 'border-red-500 bg-red-50' : 'border-gray-200'" @blur="v$$.title.$touch()">
        <span v-if="v$$.title.$error" class="text-red-500 text-xs font-semibold mt-1 block">
          {{ v$$.title.$errors[0].$message }}
        </span>

        <div class="w-full flex flex-col gap-1">
          <label class="text-xs font-bold text-gray-500 uppercase mb-1">Change the image:</label>

          <label class="p-3 border border-gray-200 rounded w-full flex items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 text-gray-600 transition-colors">
            <div class="text-sm font-medium flex items-center gap-2">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><g fill="currentColor"><path d="M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9"/><path fill-rule="evenodd" d="M9.344 3.071a50 50 0 0 1 5.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71q.579.081 1.152.177c1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3V9.574c0-1.416.997-2.67 2.429-2.909q.573-.096 1.151-.178a1.56 1.56 0 0 0 1.11-.71l.822-1.315a2.94 2.94 0 0 1 2.332-1.39M6.75 12.75a5.25 5.25 0 1 1 10.5 0a5.25 5.25 0 0 1-10.5 0m12-1.5a.75.75 0 1 0 0-1.5a.75.75 0 0 0 0 1.5" clip-rule="evenodd"/></g></svg>
              <span>Select a new image</span>
            </div>
            <input @change="handleEditImageChange" accept="image/*" type="file" class="hidden">
          </label>
        </div>

        <div v-if="editingPost.image" class="my-3 overflow-hidden rounded border border-gray-200 max-h-72 flex items-center justify-center bg-gray-100">
            <img :src="editingPost.image" alt="Post preview" class="max-h-72 object-contain">
        </div>

        <label class="text-xs font-bold text-gray-500 uppercase">Change post content:</label>
        <textarea v-model="editingPost.content" placeholder="Content" class="p-4 mb-4 border border-gray-200 w-full" :class="v$$.content.$error ? 'border-red-500 bg-red-50' : 'border-gray-200'" @blur="v$$.content.$touch()"></textarea>
          <span v-if="v$$.content.$error" class="text-red-500 text-xs font-semibold mt-1 block">
            {{ v$$.content.$errors[0].$message }}
          </span>
      </div>
    </EditModal>
  </div>
</template>