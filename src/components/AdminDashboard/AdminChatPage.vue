<!-- src/views/admin/AdminChatPage.vue -->
<template>
  <div class="min-h-screen dark:bg-[#0b1217] flex items-center justify-center p-4">
    <div class="bg-white dark:bg-[#16222b] rounded-2xl shadow-xl w-full h-[calc(100vh-6rem)] flex flex-col md:flex-row overflow-hidden">

      <!-- قائمة كل الشاتس -->
      <div class="flex flex-col h-full w-full md:w-72 md:border-r dark:border-0">
        <div class="bg-[#133B5D] text-white p-4 rounded-t-2xl md:rounded-tr-none">
          <h3 class="font-semibold">All Chats (rooms)</h3>
          <p class="text-xs text-white/70 mt-1">Monitoring conversations aggregated from every messages subcollection</p>
        </div>

        <div class="flex-1 overflow-y-auto">
          <div v-if="loadingRooms" class="p-4 text-center text-gray-500 text-sm">
            Loading chats...
          </div>

          <div v-else-if="rooms.length === 0" class="p-4 text-center text-gray-500 text-sm">
            No chats found yet.
          </div>

          <button
            v-for="room in rooms"
            :key="room.roomPath"
            @click="selectRoom(room)"
            class="w-full text-left px-4 py-3 border-b border-gray-100 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-[#111827] transition flex items-center gap-3"
            :class="selectedRoom?.roomPath === room.roomPath ? 'bg-indigo-50 dark:bg-[#111827]' : ''"
          >
            <!-- Avatar -->
            <div class="w-10 h-10 rounded-full flex items-center justify-center text-white font-semibold"
                 :style="{ backgroundColor: stringToColor(room.displayTitle) }">
              {{ (room.displayTitle || 'R').charAt(0).toUpperCase() }}
            </div>

            <!-- Names -->
            <div class="flex-1 min-w-0">
              <p class="font-medium text-gray-800 dark:text-gray-100 truncate">
                {{ room.displayTitle }}
              </p>
              <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                {{ room.subtitle }}
              </p>
            </div>
          </button>
        </div>
      </div>

      <!-- جزء الرسائل -->
      <div class="flex-1 flex flex-col h-full">
        <div class="bg-[#133B5D] text-white p-4 md:rounded-tr-2xl flex items-center gap-3">
          <h2 class="text-lg font-bold">
            {{ selectedRoom ? selectedRoom.displayTitle : 'Select a chat to view messages' }}
          </h2>
        </div>

        <div ref="messagesContainer" class="flex-1 overflow-y-auto p-6 space-y-4 bg-gray-50 dark:bg-[#0b1217]">
          <div v-if="!selectedRoom" class="text-center text-gray-500 py-20">
            <p class="text-lg font-semibold">No chat selected</p>
            <p class="text-sm mt-2">Choose a chat from the left panel to inspect.</p>
          </div>

          <div v-else-if="loadingMessages" class="text-center text-gray-500 py-10">
            Loading messages...
          </div>

          <div v-else-if="messages.length === 0" class="text-center text-gray-500 py-10">
            No messages in this chat yet.
          </div>

          <div v-else v-for="msg in messages" :key="msg.id" class="flex justify-end">
            <div class="max-w-lg px-4 py-3 rounded-2xl bg-white dark:bg-[#111827] text-gray-800 dark:text-gray-100 shadow-md">
              <p class="text-xs mb-1 font-semibold text-[#133B5D] dark:text-blue-300">
                {{ msg.userName || msg.userEmail || msg.userId || 'Unknown' }}
              </p>
              <p class="text-sm whitespace-pre-wrap break-words">{{ msg.text }}</p>
              <p class="text-[10px] mt-1 opacity-70 text-right">
                {{ formatTime(msg.timestamp) }}
              </p>
            </div>
          </div>
        </div>

        <div class="p-3 text-xs text-gray-500 dark:text-gray-400 bg-white dark:bg-[#16222b] md:rounded-br-2xl text-right">
          Read-only monitor – admin cannot send messages here.
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick } from "vue";
import {
  collectionGroup,
  getDocs,
  getDoc,
  doc,
  collection,
  onSnapshot,
  query,
  orderBy,
} from "firebase/firestore";
import { db } from "@/firebase/firebase";

/*
  Modified behavior:
  - Read all messages via collectionGroup('messages') (no server-side ordering to avoid index requirement).
  - Group messages by parent doc (room document). For each room, pick latest message client-side.
  - Try to resolve friendly displayTitle:
      1) If roomId contains "_" -> assume "clientId_technicianId" and fetch clients/{clientId} and technicians/{techId}
         and display "ClientName ↔ TechnicianName".
      2) Else, try to read the room document (rooms/{id}) and if it has participants array use that to fetch names.
      3) Fallback -> show collectionName - roomId
*/

const rooms = ref([]); // [{ roomPath, collectionName, roomId, displayTitle, subtitle, lastTimestamp }]
const selectedRoom = ref(null);
const messages = ref([]);
const loadingRooms = ref(true);
const loadingMessages = ref(false);
const messagesContainer = ref(null);

let unsubscribeMessages = null;

// helper utils
const stringToColor = (str) => {
  if (!str) return "#6b7280";
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash);
  }
  return "#" + (hash & 0x00ffffff).toString(16).padStart(6, "0");
};

const formatTime = (ts) => {
  if (!ts) return "";
  const d = ts.toDate ? ts.toDate() : new Date(ts);
  return d.toLocaleString([], { hour: "2-digit", minute: "2-digit", hour12: true });
};

// fetch display name for a user doc
const fetchName = async (collectionName, uid) => {
  try {
    if (!uid) return "";
    const ref = doc(db, collectionName, uid);
    const snap = await getDoc(ref);
    if (snap.exists()) {
      const data = snap.data();
      return data.name || data.fullName || data.displayName || data.username || uid;
    }
  } catch (e) {
    console.warn("fetchName error", collectionName, uid, e);
  }
  return uid || "";
};

// try to resolve a better displayTitle for a given room doc (collectionName + roomId)
const resolveDisplayTitle = async (collectionName, roomId) => {
  // 1) if roomId looks like clientId_technicianId -> split and fetch both names
  if (roomId.includes("_")) {
    const parts = roomId.split("_");
    // some IDs may contain multiple underscores; assume last part is tech id, first part(s) client id
    // We'll treat first part as client and last part as tech for simplicity
    const clientId = parts.slice(0, parts.length - 1).join("_");
    const techId = parts[parts.length - 1];

    const [clientName, techName] = await Promise.all([
      fetchName("clients", clientId),
      fetchName("technicians", techId),
    ]);

    // if both fetched -> show "Client ↔ Technician"
    if (clientName || techName) {
      const left = clientName || clientId;
      const right = techName || techId;
      return { title: `${left} ↔ ${right}`, clientId, techId };
    }
  }

  // 2) fallback: try to read the room doc and check for participants array
  try {
    const roomDocRef = doc(db, collectionName, roomId);
    const roomSnap = await getDoc(roomDocRef);
    if (roomSnap.exists()) {
      const data = roomSnap.data() || {};
      // if participants array of uids exists, try to resolve first two participants
      if (Array.isArray(data.participants) && data.participants.length) {
        // fetch up to two participants' names (try both clients and technicians collections)
        const p0 = data.participants[0];
        const p1 = data.participants[1];
        // Try multiple collections for each participant (clients, technicians, users, companies)
        const resolveParticipantName = async (uid) => {
          if (!uid) return "";
          const tries = ["clients", "technicians", "users", "companies"];
          for (const c of tries) {
            const nm = await fetchName(c, uid);
            if (nm && nm !== uid) return nm;
          }
          return uid;
        };
        const [n0, n1] = await Promise.all([resolveParticipantName(p0), resolveParticipantName(p1)]);
        if (n0 && n1) {
          return { title: `${n0} ↔ ${n1}`, participants: [p0, p1] };
        } else if (n0) {
          return { title: n0, participants: [p0] };
        }
      }

      // if room doc has a 'name' or 'title' field
      if (data.name || data.title) {
        return { title: data.name || data.title };
      }
    }
  } catch (e) {
    console.warn("resolveDisplayTitle fallback error", collectionName, roomId, e);
  }

  // 3) last fallback -> show collectionName - roomId
  return { title: `${collectionName} - ${roomId}` };
};

// Build rooms list by scanning all messages (collectionGroup)
const buildRoomsFromMessages = async () => {
  loadingRooms.value = true;
  try {
    console.log("[rooms] fetching collectionGroup('messages') ... (no order)");
    const snap = await getDocs(collectionGroup(db, "messages"));

    console.log("[rooms] total messages fetched:", snap.size);
    // map: key = roomDocPath (e.g. "rooms/{roomId}" or "someParent/xxx/rooms/{roomId}")
    const roomMap = new Map();

    // iterate documents (use for..of to allow awaits)
    for (const ms of snap.docs) {
      const msgData = ms.data() || {};
      // parent doc reference: ms.ref.parent.parent
      const parentDocRef = ms.ref.parent.parent;
      if (!parentDocRef) continue; // orphaned? skip
      const roomPath = parentDocRef.path; // e.g. "rooms/abc123"
      const roomId = parentDocRef.id;
      const collectionName = parentDocRef.parent.id; // the collection name containing the room doc

      // timestamp safe-get
      const ts = msgData.timestamp;
      let tsMillis = 0;
      if (ts && typeof ts.toDate === "function") tsMillis = ts.toDate().getTime();
      else if (ts && ts.seconds) tsMillis = ts.seconds * 1000;
      else tsMillis = Date.now();

      // keep the latest message per room (by timestamp)
      const existing = roomMap.get(roomPath);
      if (!existing || tsMillis > (existing._ts || 0)) {
        roomMap.set(roomPath, {
          roomPath,
          collectionName,
          roomId,
          displayTitle: `${collectionName} - ${roomId}`, // temporary, will resolve below
          subtitle: msgData.text ? (String(msgData.text).length > 45 ? String(msgData.text).slice(0,45) + "..." : msgData.text) : "No text",
          lastTimestamp: tsMillis,
          lastMessageRaw: msgData,
          _ts: tsMillis,
        });
      }
    }

    // Now resolve display titles (fetch names) for each room (parallel but limited)
    const entries = Array.from(roomMap.values());
    // Use Promise.all to resolve titles in parallel (careful on very large datasets)
    const resolved = await Promise.all(entries.map(async (r) => {
      try {
        const resolvedTitle = await resolveDisplayTitle(r.collectionName, r.roomId);
        return {
          ...r,
          displayTitle: resolvedTitle.title || r.displayTitle,
          // attach optional meta like clientId/techId if available
          clientId: resolvedTitle.clientId || null,
          techId: resolvedTitle.techId || null,
        };
      } catch (e) {
        console.warn("resolve title err", r.roomId, e);
        return r;
      }
    }));

    // sort by lastTimestamp desc
    resolved.sort((a,b) => (b.lastTimestamp || 0) - (a.lastTimestamp || 0));
    rooms.value = resolved;
    console.log("[rooms] built rooms list from messages:", rooms.value.length);
  } catch (err) {
    console.error("[rooms] build error:", err);
    rooms.value = [];
  } finally {
    loadingRooms.value = false;
  }
};

// If there are no messages at all, fall back to listing top-level 'rooms' collection (documents only)
const fallbackListRoomsDocs = async () => {
  try {
    console.log("[rooms] fallback: scanning top-level 'rooms' collection documents...");
    const colRef = collection(db, "rooms");
    const snap = await getDocs(colRef);
    console.log("[rooms] fallback rooms doc count:", snap.size);
    const arr = [];
    for (const d of snap.docs) {
      // try to resolve title using same resolver
      const resolved = await resolveDisplayTitle("rooms", d.id);
      arr.push({
        roomPath: `rooms/${d.id}`,
        collectionName: "rooms",
        roomId: d.id,
        displayTitle: resolved.title || `rooms - ${d.id}`,
        subtitle: "No messages yet",
        lastTimestamp: 0
      });
    }
    rooms.value = arr;
  } catch (err) {
    console.error("[rooms] fallback error:", err);
  }
};

// subscribe to live messages of a chosen roomPath (we got roomPath like "rooms/{id}" or "some/parent/rooms/{id}")
const subscribeToRoomMessages = async (room) => {
  if (!room || !room.roomPath) return;
  // unsubscribe previous
  if (unsubscribeMessages) {
    try { unsubscribeMessages(); } catch(e) {}
    unsubscribeMessages = null;
  }

  loadingMessages.value = true;
  messages.value = [];

  try {
    // build path pieces: room.roomPath is like 'rooms/abc' or 'someParent/xxx/rooms/abc'
    // the messages collection is under that doc -> `${room.roomPath}/messages`
    const msgsCollectionRef = collection(db, ...room.roomPath.split("/"), "messages");
    // realtime listener (ordered ascending)
    unsubscribeMessages = onSnapshot(query(msgsCollectionRef, orderBy("timestamp", "asc")), (snap) => {
      messages.value = snap.docs.map(d => ({ id: d.id, ...d.data() }));
      loadingMessages.value = false;
      nextTick(scrollToBottom);
      console.log(`[messages] live for ${room.roomPath}, count:`, messages.value.length);
    }, (err) => {
      console.error("messages onSnapshot error for", room.roomPath, err);
      loadingMessages.value = false;
    });
  } catch (err) {
    console.error("subscribeToRoomMessages error:", err);
    loadingMessages.value = false;
  }
};

const selectRoom = (room) => {
  selectedRoom.value = room;
  messages.value = [];
  subscribeToRoomMessages(room);
};

const scrollToBottom = () => {
  if (messagesContainer.value) {
    messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight;
  }
};

onMounted(async () => {
  // 1) build by scanning all messages
  await buildRoomsFromMessages();

  // 2) if zero rooms found, try fallback to top-level docs
  if (!rooms.value.length) {
    console.log("[rooms] no rooms found from messages — trying fallback to top-level docs");
    await fallbackListRoomsDocs();
  }

  // auto-select first if exists
  if (rooms.value.length) selectRoom(rooms.value[0]);
});

onUnmounted(() => {
  if (unsubscribeMessages) {
    try { unsubscribeMessages(); } catch(e) {}
    unsubscribeMessages = null;
  }
});
</script>

<style scoped>
/* minimal styles kept */
</style>
