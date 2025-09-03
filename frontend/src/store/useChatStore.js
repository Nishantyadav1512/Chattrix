import { create } from "zustand";
import toast from "react-hot-toast";
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore";

export const useChatStore = create((set, get) => ({
    messages: [],
    users: [], // corrected from user:[] to users:[]
    selectedUser: null,
    isUsersLoading: false, // corrected from isUserLoading:false to isUsersLoading:false
    isMessagesLoading: false,

    getUsers: async () => {
        set({ isUsersLoading: true }); // corrected
        try {
            const res = await axiosInstance.get("/messages/user");
            console.log("Users response:", res.data); 
            set({ users: res.data }); // corrected
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isUsersLoading: false }); // corrected
        }
    },
    getMessages: async (userId) => {
        set({ isMessagesLoading: true }); // add loading state for messages
        try {
            const res = await axiosInstance.get(`/messages/${userId}`);
            set({ messages: res.data });
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({ isMessagesLoading: false });
        }
    },
    sendMessage: async (messageData) => {
        const { selectedUser, messages } = get();
        try {
            const res = await axiosInstance.post(`/messages/send/${selectedUser._id}`, messageData);
            set({ messages: [...messages, res.data] });
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },
    subscribeToMessages: () => {
        const { selectedUser } = get();
        if (!selectedUser) return;

        const socket = useAuthStore.getState().socket;
        if (!socket) return;

        socket.on("newMessage", (newMessage) => {
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id;
            if (!isMessageSentFromSelectedUser) return;

            set({
                messages: [...get().messages, newMessage],
            });
        });
    },
    unsubscribeFromMessages: () => {
        // TODO: Implement unsubscribe logic if needed
        const socket  = userAuthStore.getState().socket; 
        socket.off("newMessage"); 
    },
    setSelectedUser: (selectedUser) => set({ selectedUser }),
}));