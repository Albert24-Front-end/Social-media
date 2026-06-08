import axios from "axios";
import type { Post } from "../types/index.ts";

const apiClient = axios.create({ baseURL: "http://localhost:3000" });

export const PostApi = {
    getAllPosts() {
        return apiClient.get<Post[]>('/posts').then(res => res.data)
    },
    createPost(post: Omit<Post, 'id'>) {
        return apiClient.post<Post>("/posts", post).then(res => res.data);
    },
    updatePost(id: number, post: Post) {
        return apiClient.put<Post>(`/posts/${id}`, post).then(res => res.data);
    },
    patchFavouredPost(id: number, data: Partial<Post>) {
        return apiClient.patch<Post>(`/posts/${id}`, data).then(res => res.data);
    },
    deletePost(id: number) {
        return apiClient.delete(`/posts/${id}`);
    }
}
