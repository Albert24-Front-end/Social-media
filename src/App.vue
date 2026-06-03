<script setup lang="ts">
import { computed, ref, useTemplateRef } from 'vue';
import EditModal from './components/EditModal.vue';
import PostItem from './components/PostItem.vue';

export type Post = {
  id: number,
  title: string;
  content: string;
  isFavoured: boolean,
  image?: string
};

const isEditModalOpen = ref(false);
const imageInput = useTemplateRef<HTMLInputElement>('imageInput')

const posts = ref<Post[]>([]);
const post = ref<Post>({
  id: 0,
  title: '',
  content: '',
  isFavoured: false,
  image: ''
});

const storePost = () => {
  if (!post.value.title.trim() || !post.value.content.trim()) return;

  const file = imageInput.value?.files?.[0];
  const imageUrl = file ? URL.createObjectURL(file) : undefined;

  posts.value.unshift({
    id: Date.now(),
    title: post.value.title,
    content: post.value.content,
    isFavoured: post.value.isFavoured,
    image: imageUrl
  });

  Object.assign(post.value, {
    id: null,
    title: '',
    content: '',
    isFavoured: false,
    image: ''
  })
  if (imageInput.value) {
    imageInput.value.value = '';
  }
}

const editingPost = ref<Post | null>(null);

const favouredPosts = computed(() => posts.value.filter(item => item.isFavoured))

const regularPosts = computed(() => posts.value.filter(item => !item.isFavoured))

const openEditModal = (post: Post) => {
  isEditModalOpen.value = true;
  editingPost.value = {...post}
}

const saveEditedPost = () => {
  if (!editingPost.value) return;

  const index = posts.value.findIndex(post => post.id === editingPost.value!.id);

  if (index !== -1) {
    posts.value[index] = editingPost.value;
  }

  isEditModalOpen.value = false;
  editingPost.value = null;
}

const deletePost = (post: Post) => {
  posts.value = posts.value.filter(item => item.id !== post.id);
}

const toggleFavoured = (post: Post) => {
  const toggledPost = posts.value.find(item => item.id === post.id);

  if (toggledPost) {
    toggledPost.isFavoured = !toggledPost.isFavoured;
  }
}
</script>

<template>
  <div class="container w-1/2 mx-auto p-4">
    <div class="bg-white border border-gray-200 p-4">
      <form class="flex flex-col items-start gap-4" @submit.prevent="storePost">
        <input v-model="post.title" type="text" placeholder="Title" class="p-4 border border-gray-200 w-full">
        <input ref="imageInput" accept="image/*" type="file" class="p-4 border border-gray-200 w-full">
        <textarea v-model="post.content" placeholder="Content" class="p-4 border border-gray-200 w-full"></textarea>
        <button class="inline-block px-3 py-2 bg-sky-600 border border-sky-700 text-white cursor-pointer">Store your post</button>
      </form>

    </div>
    <div class="mt-6 border-t pt-4">
        <h3 class="font-bold text-lg mb-2">Posts feed:</h3>

        <div v-if="posts.length === 0" class="text-gray-400">No posts here yet...</div>

        <div v-else class="flex gap-4">
          <div class="w-1/2 flex flex-col gap-3">
            <h3>Posts</h3>
            <PostItem v-for="post in regularPosts" :key="post.id" :post="post" @delete="deletePost" @open-modal="openEditModal" @toggle-favoured="toggleFavoured"/>
          </div>
          <div class="w-1/2 flex flex-col gap-3">
            <h3>Favoured posts</h3>
            <PostItem v-for="post in favouredPosts" :key="post.id" :post="post" @delete="deletePost" @open-modal="openEditModal" @toggle-favoured="toggleFavoured"/>
          </div>
        </div>
      </div>
      <EditModal :show="isEditModalOpen" @close="isEditModalOpen = false" :data="editingPost" @edit="saveEditedPost">
        <div v-if="editingPost" class="modal flex flex-col items-start gap-4" >
          <input v-model="editingPost.title" type="text" placeholder="Title" class="p-4 border border-gray-200 w-full">
          <textarea v-model="editingPost.content" placeholder="Content" class="p-4 mb-4 border border-gray-200 w-full"></textarea>
        </div>
      </EditModal>
  </div>
</template>
