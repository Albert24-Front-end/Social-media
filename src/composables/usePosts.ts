import { ref, computed } from "vue";
import { PostApi } from "../api/post.service";
import type { Post } from "../types";

export function usePosts() {
    const posts = ref<Post[]>([]);
    const isEditModalOpen = ref(false);
    const editingPost = ref<Post | null>(null);
    const isLoading = ref(false);

    const newPost = ref<Omit<Post, "id">>({
      title: "",
      content: "",
      isFavoured: false,
      image: "",
    });

    const openEditModal = (post: Post) => {
      isEditModalOpen.value = true;
      editingPost.value = { ...post };
    };

    const handleEditImageChange = (event: Event) => {
      const input = event.target as HTMLInputElement;
      const file = input.files?.[0];

      if (file && editingPost.value) {
        editingPost.value.image = URL.createObjectURL(file);
      }
    };

    const fetchPosts = async () => {
        isLoading.value = true;
        try {
            posts.value = await PostApi.getAllPosts();
        } catch(err) {
            console.error("Fetch error:", err)
        } finally {
            isLoading.value = false;
        }
    };

    const storePost = async (file?: File) => {
      if (!newPost.value.title.trim() || !newPost.value.content.trim()) return;

      let imageUrl = '';

      if (file) {
        imageUrl = URL.createObjectURL(file);
      } else if (newPost.value.image && newPost.value.image.trim()) {
        imageUrl = newPost.value.image.trim();
      }

      const newPostPayload = {
        title: newPost.value.title,
        content: newPost.value.content,
        isFavoured: newPost.value.isFavoured,
        image: imageUrl,
      };

      try {
        const createdPost = await PostApi.createPost(newPostPayload);
        posts.value.unshift(createdPost);

        // Очищаем форму
        newPost.value = {
          title: "",
          content: "",
          isFavoured: false,
          image: "",
        };
      } catch (err) {
        console.error("Store error:", err);
      }
    };

    const saveEditedPost = async () => {
      if (!editingPost.value) return;
      try {
        const updated = await PostApi.updatePost(
          editingPost.value.id,
          editingPost.value,
        );
        const index = posts.value.findIndex((p) => p.id === updated.id);
        if (index !== -1) {
          posts.value[index] = updated;
        }
        isEditModalOpen.value = false;
        editingPost.value = null;
      } catch (err) {
        console.error("Update error:", err);
      }
    };

    const deletePost = async (id: number) => {
      try {
        await PostApi.deletePost(id);
        posts.value = posts.value.filter((p) => p.id !== id);
      } catch (err) {
        console.error("Deletion error:", err);
      }
    };

    const toggleFavoured = async (post: Post) => {
      try {
        const updated = await PostApi.patchFavouredPost(post.id, {
          isFavoured: !post.isFavoured,
        });
        const found = posts.value.find((p) => p.id === updated.id);
        if (found) {
          found.isFavoured = updated.isFavoured;
        }
      } catch (err) {
        console.error("Ошибка переключения избранного:", err);
      }
    };

    const regularPosts = computed(() =>posts.value.filter(p => !p.isFavoured));
    const favouredPosts = computed(() => posts.value.filter(p => p.isFavoured));

    return {
      posts,
      newPost,
      editingPost,
      isLoading,
      isEditModalOpen,
      favouredPosts,
      regularPosts,
      openEditModal,
      handleEditImageChange,
      fetchPosts,
      storePost,
      saveEditedPost,
      deletePost,
      toggleFavoured,
    };
}