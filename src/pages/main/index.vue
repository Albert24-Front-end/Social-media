<script setup lang="ts">
import { computed, onMounted, ref, useTemplateRef } from 'vue';
import EditModal from '../../components/EditModal.vue';
import PostItem from '../../components/PostItem.vue';
import axios from 'axios';

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

onMounted(() => {
  getPosts();
})

const getPosts = () => {
  axios.get('http://localhost:3000/posts')
      .then(res => {
        posts.value = res.data;
        console.log(res.data);
      })
}

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

const handleEditImageChange = (event: Event) => {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];

  if (file && editingPost.value) {
    editingPost.value.image = URL.createObjectURL(file);
  }
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
  <div class="container w-3/4 mx-auto p-4">
    <div class="bg-white border border-gray-200 p-4">
      <form class="flex flex-col items-start gap-4" @submit.prevent="storePost">
        <input v-model="post.title" type="text" placeholder="Title" class="p-4 border border-gray-200 w-full">
        <label class="p-4 border border-gray-200 border-dashed rounded w-full flex items-center justify-center bg-gray-50 cursor-pointer hover:bg-gray-100 text-gray-500 transition-colors">
          <div class="text-sm font-medium flex items-center gap-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24"><g fill="currentColor"><path d="M12 9a3.75 3.75 0 1 0 0 7.5A3.75 3.75 0 0 0 12 9"/><path fill-rule="evenodd" d="M9.344 3.071a50 50 0 0 1 5.312 0c.967.052 1.83.585 2.332 1.39l.821 1.317c.24.383.645.643 1.11.71q.579.081 1.152.177c1.432.239 2.429 1.493 2.429 2.909V18a3 3 0 0 1-3 3h-15a3 3 0 0 1-3-3V9.574c0-1.416.997-2.67 2.429-2.909q.573-.096 1.151-.178a1.56 1.56 0 0 0 1.11-.71l.822-1.315a2.94 2.94 0 0 1 2.332-1.39M6.75 12.75a5.25 5.25 0 1 1 10.5 0a5.25 5.25 0 0 1-10.5 0m12-1.5a.75.75 0 1 0 0-1.5a.75.75 0 0 0 0 1.5" clip-rule="evenodd"/></g></svg>
            <span>Click to select an image</span>
          </div>
          <input ref="imageInput" accept="image/*" type="file" class="hidden">
        </label>
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
        <label class="text-xs font-bold text-gray-500 uppercase">Change post title:</label>
        <input v-model="editingPost.title" type="text" placeholder="Title" class="p-4 border border-gray-200 w-full">

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
        <textarea v-model="editingPost.content" placeholder="Content" class="p-4 mb-4 border border-gray-200 w-full"></textarea>
      </div>
    </EditModal>
  </div>
</template>