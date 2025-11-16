<script setup>
import { getAuth, signOut, onAuthStateChanged } from "firebase/auth";
import { useRouter } from "vue-router";
import { ref, onMounted, computed } from "vue";
import { db } from "@/firebase/firebase";
import { doc, getDoc, collection, query, where, onSnapshot } from "firebase/firestore";
import { useTechnicianNotifications } from "@/composables/useTechnicianNotifications"; // ✅ shared notifications composable

const props = defineProps({
  active: String,
  mobileOpen: Boolean, // NEW: control drawer visibility on mobile
});
const emit = defineEmits(["changeTab", "closeSidebar"]);

const router = useRouter();

const technician = ref({ name: "", earnings: 0, image: "" });
const technicianId = ref(null);
const orders = ref([]);

// ✅ Use shared notifications composable
const { notifications, unreadCount, showNotifications, toggleNotifications } =
  useTechnicianNotifications();

// 🔹 Calculate total and monthly earnings dynamically
const totalEarnings = computed(() => {
  return orders.value
    .filter((o) => o.status === "completed")
    .reduce((sum, o) => sum + (parseFloat(o.price) || 0), 0);
});

const isDark = ref(false);

const applyTheme = (mode) => {
  isDark.value = mode === "dark";
  document.documentElement.classList.toggle("dark", isDark.value);
};

const toggleDarkMode = () => {
  const next = isDark.value ? "light" : "dark";
  applyTheme(next);
  try {
    localStorage.setItem("theme", next);
  } catch (e) {
    // ignore
  }
};

onMounted(() => {
  const auth = getAuth();

  onAuthStateChanged(auth, async (user) => {
    if (!user) return;

    technicianId.value = user.uid;

    const docRef = doc(db, "technicians", user.uid);
    const docSnap = await getDoc(docRef);

    if (docSnap.exists()) {
      technician.value = docSnap.data();
    }

    const ordersRef = collection(db, "orders");
    const q = query(ordersRef, where("technicianId", "==", user.uid));
    onSnapshot(q, (snapshot) => {
      orders.value = snapshot.docs.map((d) => d.data());
    });
  });
});


const handleLogout = async () => {
  try {
    const auth = getAuth();
    await signOut(auth);
    router.push("/");
  } catch (error) {
    console.error("Logout failed:", error);
  }
};

// NEW: helper to handle mobile behaviour when selecting a tab
const handleNav = (tab) => {
  emit("changeTab", tab);
  // if mobile drawer is open, request it to close
  if (props.mobileOpen) {
    emit("closeSidebar");
  }
};

// NEW: close button inside the drawer
const closeDrawer = () => {
  emit("closeSidebar");
};
</script>

<template>
  <!--
    NOTE:
      - md: visible as before
      - On small screens we use transform to slide the drawer
      - Mobile width set to 50% (w-1/2) as requested (M3)
      - sm:w-[40%] and md:w-[20%] preserved for larger sizes
  -->
  <div
    :class="[
      'fixed left-0 top-0 h-full md:w-[20%] w-1/2 sm:w-[40%] bg-[#133B5D] text-white flex flex-col items-center py-4 overflow-hidden z-50 transform transition-transform duration-300 ease-in-out',
      // mobile hidden by translating full width to left, visible when mobileOpen is true
      props.mobileOpen ? 'translate-x-0' : '-translate-x-full',
      // ensure on md and up it is always visible & positioned correctly
      'md:translate-x-0 md:translate-x-0'
    ]"
  >
    <div class="flex flex-col justify-between  w-full overflow-hidden">
      <!-- Top row: show close button only on mobile -->
      <div class="w-full flex items-center justify-between px-4 md:hidden">
        <div></div>
        <button
          @click="closeDrawer"
          aria-label="Close sidebar"
          class="text-white p-2 rounded-md focus:outline-none"
        >
          <i class="fa-solid fa-xmark text-2xl"></i>
        </button>
      </div>

      <!-- Scrollable content -->
      <div class="flex flex-col items-center w-full pb-4">
        <div class="flex flex-col items-center shrink-0">
          <img src="../images/white logo.png" alt="logo" class="w-[140px]" />

          <div class="flex flex-col items-center">
            <img
              :src="technician.profileImage || '/images/default-tech.png'"
              alt=""
              class="w-20 h-20 rounded-full border-4 border-white shadow-md mb-2 object-cover"
            />
            <p class="text-base font-semibold">
              {{ technician.name || "Technician" }}
            </p>

            <!-- Earnings -->
            <div class="flex items-center gap-2 text-sm opacity-90 mb-3">
              <p class="font-medium">My Earnings:</p>
              <p class="font-bold text-xl text-green-600">
                {{ totalEarnings?.toLocaleString?.() || 0 }}
                <span class="text-sm font-semibold">EGP</span>
              </p>
            </div>
          </div>
        </div>

        <!-- Navigation -->
        <nav class="flex flex-col w-full space-y-1 px-2">
          <button
            @click="handleNav('orders')"
            :class="[props.active === 'orders' ? 'bg-[#1b5383]' : 'hover:bg-[#1b5383]/60']"
            class="flex items-center gap-2 py-2.5 rounded-xl w-[88%] mx-auto transition p-3 font-semibold text-[16px]"
          >
            <i class="fa-solid fa-clipboard-list text-white text-lg"></i>
            Orders
          </button>

          <button
            @click="handleNav('appointments')"
            :class="[props.active === 'appointments' ? 'bg-[#1b5383]' : 'hover:bg-[#1b5383]/60']"
            class="flex items-center gap-2 py-2.5 rounded-xl w-[88%] mx-auto transition p-3 font-semibold text-[16px]"
          >
            <i class="fa-solid fa-calendar-days text-white text-lg"></i>
            Appointments
          </button>

          <button
            @click="handleNav('services')"
            :class="[props.active === 'services' ? 'bg-[#1b5383]' : 'hover:bg-[#1b5383]/60']"
            class="flex items-center gap-2 py-2.5 rounded-xl w-[88%] mx-auto transition p-3 font-semibold text-[16px]"
          >
            <i class="fa-solid fa-screwdriver-wrench text-white text-lg"></i>
            My Services
          </button>

          <button
            @click="handleNav('workGallery')"
            :class="[props.active === 'workGallery' ? 'bg-[#1b5383]' : 'hover:bg-[#1b5383]/60']"
            class="flex items-center gap-2 py-2.5 rounded-xl w-[88%] mx-auto transition p-3 font-semibold text-[16px]"
          >
            <i class="fa-solid fa-image text-white text-lg"></i>
            Work Gallery
          </button>

          <button
            @click="handleNav('earnings')"
            :class="[props.active === 'earnings' ? 'bg-[#1b5383]' : 'hover:bg-[#1b5383]/60']"
            class="flex items-center gap-2 py-2.5 rounded-xl w-[88%] mx-auto transition p-3 font-semibold text-[16px]"
          >
            <i class="fa-solid fa-coins text-white text-lg"></i>
            My Earnings
          </button>

          <button
            @click="handleNav('chat')"
            :class="[props.active === 'chat' ? 'bg-[#1b5383]' : 'hover:bg-[#1b5383]/60']"
            class="flex items-center gap-2 py-2.5 rounded-xl w-[88%] mx-auto transition p-3 font-semibold text-[16px]"
          >
            <i class="fa-solid fa-comments text-white text-lg"></i>
            Chat
          </button>
          <button
            @click="handleNav('reviews')"
            :class="[props.active === 'reviews' ? 'bg-[#1b5383]' : 'hover:bg-[#1b5383]/60']"
            class="flex items-center gap-2 py-2.5 rounded-xl w-[88%] mx-auto transition p-3 font-semibold text-[16px]"
          >
            <i class="fa-solid fa-star text-white text-lg"></i>
            Reviews
          </button>

          <button
            @click="handleNav('Techsettings')"
            :class="[props.active === 'Techsettings' ? 'bg-[#1b5383]' : 'hover:bg-[#1b5383]/60']"
            class="flex items-center gap-2 py-2.5 rounded-xl w-[88%] mx-auto transition p-3 font-semibold text-[16px]"
          >
            <i class="fa-solid fa-gear text-white text-lg"></i>
            Settings
          </button>
        </nav>
      </div>

      <!-- Logout always visible -->
      <div class="w-full flex flex-col items-center mt-auto mb-2 shrink-0">
        <button
          @click="handleLogout"
          class="cursor-pointer border hover:bg-red-700 text-white font-semibold px-6 py-2 rounded-xl w-[88%] transition shadow-md text-[16px] flex items-center justify-center gap-2"
        >
          <i class="fa-solid fa-right-from-bracket text-white text-lg"></i>
          Log Out
        </button>
      </div>
    </div>
  </div>
</template>

<style scoped>
button {
  transition: all 0.3s ease;
}
</style>
