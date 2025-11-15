<template>
  <link
    rel="stylesheet"
    href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
  />

  <div class="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
    <div v-if="initializing" class="text-center">
      <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-indigo-600 mx-auto mb-4"></div>
      <p class="text-indigo-900">Initializing Chat...</p>
    </div>

<div v-else-if="user" class="bg-white rounded-2xl shadow-xl w-full h-[calc(100vh-10rem)] flex">
      <div class="w-64 border-r border-gray-200 flex flex-col">
        <div class="bg-indigo-600 text-white p-4 rounded-tl-2xl">
          <h3 class="font-semibold">Chats</h3>
        </div>

        <div class="flex-1 overflow-y-auto">
          <div v-if="allUsers.length === 0" class="p-4 text-center text-gray-500 text-sm">
            No active chats yet.
          </div>

          <div
            v-for="chatUser in allUsers"
            :key="chatUser.id"
            class="relative group"
          >
            <button
              @click="selectChatUser(chatUser.id)"
              :class="[ 'w-full p-4 text-left hover:bg-gray-100 transition-colors border-b border-gray-100', selectedUser?.id === chatUser.id ? 'bg-indigo-50' : '' ]"
            >
              <div class="flex items-center gap-3">
                <div 
                  class="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                  :style="{ backgroundColor: stringToColor(chatUser.email) }"
                >
                  {{ (chatUser.name || chatUser.email).charAt(0).toUpperCase() }}
                </div>

                <div class="flex-1 min-w-0">
                  <p class="font-medium text-gray-800 truncate">
                    {{ chatUser.name || chatUser.email.split('@')[0] }}
                  </p>
                  <p class="text-xs text-gray-500 truncate">{{ chatUser.email }}</p>
                </div>
              </div>
            </button>
            
            <button
              @click.stop="deleteChat(chatUser.id)"
              title="Delete Chat"
              class="absolute top-1/2 right-3 transform -translate-y-1/2 p-2 rounded-full text-gray-400 hover:bg-red-100 hover:text-red-600 opacity-0 group-hover:opacity-100 transition-opacity"
            >
              <i class="fas fa-trash-alt fa-sm"></i>
            </button>
          </div>
          
        </div>
      </div>

      <div class="flex-1 flex flex-col">
        <div class="bg-indigo-600 text-white p-4 rounded-tr-2xl">
          <h2 class="text-lg font-bold">
            {{ selectedUser ? (selectedUser.name || selectedUser.email.split('@')[0]) : 'Select a chat' }}
          </h2>
        </div>

        <div ref="messagesContainer" class="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50">
          <div v-if="!selectedUser" class="text-center text-gray-500 py-20">
            <p class="text-lg font-semibold">No chat selected</p>
          </div>

          <div v-else v-for="msg in messages" :key="msg.id" class="flex" :class="msg.userId === user.uid ? 'justify-end' : 'justify-start'">
            <div :class="['max-w-xs px-4 py-3 rounded-2xl', msg.userId === user.uid ? 'bg-indigo-600 text-white rounded-br-none' : 'bg-white text-gray-800 rounded-bl-none shadow-md']">
              <p class="text-sm mb-1 font-semibold">{{ msg.userName }}</p>
              <p>{{ msg.text }}</p>
              <p class="text-xs mt-1 opacity-75">{{ formatTime(msg.timestamp) }}</p>
            </div>
          </div>
        </div>

        <div class="p-4 border-t border-gray-200 flex gap-2 bg-white rounded-br-2xl">
          <input
            v-model="newMessage"
            @keyup.enter="sendMessage"
            type="text"
            placeholder="Type a message..."
            :disabled="sending || !selectedUser"
            class="flex-1 px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500"
          />
          <button
            @click="sendMessage"
            :disabled="!newMessage.trim() || sending || !selectedUser"
            class="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, nextTick, onUnmounted } from "vue"
import { useRoute, useRouter } from "vue-router"
import {
  onAuthStateChanged,
} from "firebase/auth"
import {
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy,
  serverTimestamp,
  setDoc,
  doc,
  getDoc,
  deleteDoc, // <-- 3. IMPORTED deleteDoc
} from "firebase/firestore"
import { auth, db } from "@/firebase/firebase"

const route = useRoute()
const router = useRouter()
const technicianId = route.query.uid || null

// State
const user = ref(null)
const initializing = ref(true)
const allUsers = ref([])
const selectedUser = ref(null)
const currentRoomId = ref(null)
const messages = ref([])
const newMessage = ref("")
const sending = ref(false)
const messagesContainer = ref(null)
const currentUserDoc = ref(null)
let unsubscribeMessages = null
let unsubscribeAuth = null
let unsubscribeUsers = null

const defaultAvatar = "https://via.placeholder.com/150/808080/FFFFFF?text=G"

// Utility
const getRoomId = (uid1, uid2) => [uid1, uid2].sort().join("_")

const findUserDocument = async (uid) => {
  const collectionsToSearch = ["clients", "technicians", "companies", "admin"];
  for (const collectionName of collectionsToSearch) {
    const docRef = doc(db, collectionName, uid);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      return docSnap.data();
    }
  }
  return null;
}

// Auth setup
onMounted(() => {
  unsubscribeAuth = onAuthStateChanged(auth, async (currentUser) => {
    if (currentUser) {
      user.value = currentUser
      const userProfile = await findUserDocument(currentUser.uid)

      if (userProfile) {
        currentUserDoc.value = userProfile 
        listenToUsers()
        initializing.value = false
      } else {
        console.error("User is authenticated but has no profile in Firestore.")
        router.push("/login")
      }
      
    } else {
      initializing.value = false
      router.push("/login")
    }
  })
})

onUnmounted(() => {
  if (unsubscribeMessages) unsubscribeMessages()
  if (unsubscribeUsers) unsubscribeUsers()
  if (unsubscribeAuth) unsubscribeAuth()
})

// Load chat list
const listenToUsers = async () => {
  if (unsubscribeUsers) unsubscribeUsers()
  if (!user.value) return; 

  const chatsRef = collection(db, "users", user.value.uid, "active_chats")
  unsubscribeUsers = onSnapshot(chatsRef, async (snap) => {
    const active = snap.docs.map((d) => ({ id: d.id, ...d.data() }))

    if (technicianId && !active.some((u) => u.id === technicianId)) {
      let techProfile = null;
      const techSnap = await getDoc(doc(db, "technicians", technicianId));
      if (techSnap.exists()) {
        techProfile = techSnap.data();
      } else {
        const compSnap = await getDoc(doc(db, "companies", technicianId));
        if (compSnap.exists()) {
          techProfile = compSnap.data();
        }
      }

      if (techProfile) {
        active.unshift({ id: technicianId, ...techProfile })
      }
    }

    allUsers.value = active

    if (technicianId && allUsers.value.some((u) => u.id === technicianId)) {
      selectChatUser(technicianId)
    }
  })
}

// Select chat
const selectChatUser = (id) => {
  selectedUser.value = allUsers.value.find((u) => u.id === id)
  if (!selectedUser.value) return
  currentRoomId.value = getRoomId(user.value.uid, id)
  listenToMessages(currentRoomId.value)
}

// Listen to messages
const listenToMessages = (roomId) => {
  if (unsubscribeMessages) unsubscribeMessages()
  const msgsRef = collection(db, "rooms", roomId, "messages")
  const q = query(msgsRef, orderBy("timestamp", "asc"))
  unsubscribeMessages = onSnapshot(q, (snap) => {
    messages.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }))
    nextTick(scrollToBottom)
  })
}

// Send message
const sendMessage = async () => {
  if (!newMessage.value.trim() || !selectedUser.value) return
  sending.value = true
  const msgText = newMessage.value
  newMessage.value = ""

  try {
    // Save to room
    await addDoc(collection(db, "rooms", currentRoomId.value, "messages"), {
      text: msgText,
      userId: user.value.uid,
      userEmail: currentUserDoc.value.email,
      userName: currentUserDoc.value.name,
      timestamp: serverTimestamp(),
    })

    // Update both users’ active chat list
    const other = selectedUser.value

    await setDoc(doc(db, "users", user.value.uid, "active_chats", other.id), {
      uid: other.id,
      name: other.name || other.email.split("@")[0],
      email: other.email,
      lastMessage: msgText,
      updatedAt: serverTimestamp(),
    })

    await setDoc(doc(db, "users", other.id, "active_chats", user.value.uid), {
      uid: user.value.uid,
      name: currentUserDoc.value.name,
      email: currentUserDoc.value.email,
      lastMessage: msgText,
      updatedAt: serverTimestamp(),
    })
  } catch (err)
 {
    console.error("Error sending message:", err)
  } finally {
    sending.value = false
  }
}

// --- 3. NEW FUNCTION TO DELETE CHAT ---
const deleteChat = async (chatUserId) => {
  if (!chatUserId || !user.value) return;

  // 1. Confirm deletion
  if (!confirm("Are you sure you want to remove this chat from your list?")) {
    return;
  }

  try {
    // 2. Get the reference to the document in *your* active_chats
    const chatDocRef = doc(db, "users", user.value.uid, "active_chats", chatUserId);

    // 3. Delete the document
    await deleteDoc(chatDocRef);

    // 4. Clear selection if the active chat was deleted
    if (selectedUser.value?.id === chatUserId) {
      selectedUser.value = null;
      messages.value = [];
      currentRoomId.value = null;
    }
    // The onSnapshot listener will automatically update the allUsers list
    
  } catch (err) {
    console.error("Error deleting chat:", err);
    alert("Failed to delete chat. Please try again.");
  }
};


// Helpers
const scrollToBottom = () => {
  if (messagesContainer.value)
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
}

const formatTime = (ts) => {
  if (!ts) return ""
  const d = ts.toDate ? ts.toDate() : new Date(ts)
  return d.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
}

const stringToColor = (str) => {
  if (!str) return "#999"
  let hash = 0
  for (let i = 0; i < str.length; i++) hash = str.charCodeAt(i) + ((hash << 5) - hash)
  hash = (hash & 0x00FFFFFF) | (Math.floor(Math.random() * 128 + 64) << 24);
  return "#" + (hash & 0x00FFFFFF).toString(16).padStart(6, "0");
}
</script>