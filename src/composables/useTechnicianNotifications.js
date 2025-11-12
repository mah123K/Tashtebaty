import { ref, onMounted } from "vue";
import { auth, db } from "@/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { collection, query, orderBy, onSnapshot, updateDoc, doc } from "firebase/firestore";

const notifications = ref([]);
const unreadCount = ref(0);
const showNotifications = ref(false);
const technicianId = ref(null);

export function useTechnicianNotifications() {
  const toggleNotifications = () => {
    showNotifications.value = !showNotifications.value;
    if (showNotifications.value) markAsRead();
  };

  const markAsRead = async () => {
    if (!technicianId.value) return;
    for (const n of notifications.value) {
      if (!n.isRead) {
        await updateDoc(doc(db, "technicians", technicianId.value, "notifications", n.id), {
          isRead: true,
        });
      }
    }
  };

  onMounted(() => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        technicianId.value = user.uid;
        const notifRef = collection(db, "technicians", user.uid, "notifications");
        const q = query(notifRef, orderBy("timestamp", "desc"));
        onSnapshot(q, (snap) => {
          notifications.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
          unreadCount.value = notifications.value.filter((n) => !n.isRead).length;
        });
      }
    });
  });

  return {
    notifications,
    unreadCount,
    showNotifications,
    toggleNotifications,
  };
}
