
<template>
  <div class="flex bg-gray-100 dark:bg-[#0f172a] text-gray-900 dark:text-gray-100 h-screen">

    <!-- Sidebar -->
    <aside
      class="flex-shrink-0 w-64 bg-[#344767] text-white flex flex-col p-5 justify-between fixed lg:static lg:translate-x-0 z-40 transition-transform duration-300 ease-in-out h-screen"
      :class="{
        'translate-x-0': isSidebarOpen,
        '-translate-x-full': !isSidebarOpen && lang !== 'ar',
        'translate-x-full': !isSidebarOpen && lang === 'ar'
      }"
    >
      <div>
        <div class="flex flex-col items-center mb-6">
          <img
            src="https://res.cloudinary.com/dlrgf0myy/image/upload/v1760784552/image__11_-removebg-preview_ev3uvd.png"
            alt="Logo"
            class="h-16 mb-3"
          />
          <h2 class="text-lg font-semibold tracking-wide">
            {{ texts[lang]?.adminDashboard?.sidebar?.title || 'Admin Dashboard' }}
          </h2>
          <div class="w-full h-px bg-gray-400 mt-5"></div>
        </div>

        <nav class="flex flex-col space-y-3">
          <router-link
            to="/dashboard"
            class="flex items-center space-x-2 p-2 rounded-md transition-colors duration-200"
            :class="{ 'bg-[#5984C6]': $route.path === '/dashboard', 'space-x-reverse': lang === 'ar' }"
          >
            <i class="bi bi-house"></i>
            <span>{{ texts[lang]?.adminDashboard?.sidebar?.dashboard || 'Dashboard' }}</span>
          </router-link>

          <router-link
            to="/dashboard/users"
            class="flex items-center space-x-2 p-2 rounded-md transition-colors duration-200"
            :class="{ 'bg-[#5984C6]': $route.path === '/dashboard/users', 'space-x-reverse': lang === 'ar' }"
          >
            <i class="bi bi-people"></i>
            <span>{{ texts[lang]?.adminDashboard?.sidebar?.users || 'Users' }}</span>
          </router-link>

          <router-link
            to="/dashboard/services"
            class="flex items-center space-x-2 p-2 rounded-md transition-colors duration-200"
            :class="{ 'bg-[#5984C6]': $route.path === '/dashboard/services', 'space-x-reverse': lang === 'ar' }"
          >
            <i class="bi bi-briefcase"></i>
            <span>{{ texts[lang]?.adminDashboard?.sidebar?.services || 'Services' }}</span>
          </router-link>

          <router-link
            to="/dashboard/providers"
            class="flex items-center space-x-2 p-2 rounded-md transition-colors duration-200"
            :class="{ 'bg-[#5984C6]': $route.path === '/dashboard/providers', 'space-x-reverse': lang === 'ar' }"
          >
            <i class="bi bi-building"></i>
            <span>{{ texts[lang]?.adminDashboard?.sidebar?.providers || 'Providers' }}</span>
          </router-link>

          <router-link
            to="/dashboard/orders"
            class="flex items-center space-x-2 p-2 rounded-md transition-colors duration-200"
            :class="{ 'bg-[#5984C6]': $route.path === '/dashboard/orders', 'space-x-reverse': lang === 'ar' }"
          >
            <i class="bi bi-receipt"></i>
            <span>{{ texts[lang]?.adminDashboard?.sidebar?.orders || 'Orders' }}</span>
          </router-link>

          <router-link
            to="/dashboard/payments"
            class="flex items-center space-x-2 p-2 rounded-md transition-colors duration-200"
            :class="{ 'bg-[#5984C6]': $route.path === '/dashboard/payments' }"
          >
            <i class="bi bi-credit-card"></i>
            <span>{{ texts[lang]?.adminDashboard?.sidebar?.payments || 'Payments' }}</span>
          </router-link>

          <router-link
            to="/dashboard/support"
            class="flex items-center space-x-2 p-2 rounded-md transition-colors duration-200"
            :class="{ 'bg-[#5984C6]': $route.path === '/dashboard/support' }"
          >
            <i class="bi bi-question-circle"></i>
            <span>{{ texts[lang]?.adminDashboard?.sidebar?.support || 'Support' }}</span>
          </router-link>

          <router-link
            to="/dashboard/addoffer"
            class="flex items-center space-x-2 p-2 rounded-md transition-colors duration-200"
            :class="{ 'bg-[#5984C6]': $route.path === '/dashboard/addoffer' }"
          >
            <i class="bi bi-tags"></i>
            <span>{{ texts[lang]?.adminDashboard?.sidebar?.offers || 'Offers' }}</span>
          </router-link>
        </nav>
      </div>

      <!-- Logout Button -->
      <div class="flex justify-center mt-auto mb-6">
        <button
          @click="handleLogout"
          class="flex items-center justify-center space-x-1 text-white font-medium text-sm py-1 px-3 rounded-xl transition-all duration-500 border border-white hover:bg-white hover:text-[#133B5D]"
        >
          <i class="bi bi-box-arrow-right text-lg"></i>
          <span>{{ texts[lang]?.adminDashboard?.sidebar?.logout || 'Logout' }}</span>
        </button>
      </div>
    </aside>

    <!-- Main layout -->
    <div class="flex-1 flex flex-col lg:ml-0">
      <header class="flex justify-between lg:justify-end items-center bg-white dark:bg-[#111827] shadow-sm p-4 relative">

        <!-- Hamburger Menu Button for Mobile/Tablet -->
        <button
          @click="toggleSidebar"
          class="lg:hidden flex items-center justify-center w-10 h-10 rounded-md bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-200"
          :title="texts[lang]?.adminDashboard?.sidebar?.menu || 'Menu'"
        >
          <i class="bi bi-list text-xl text-gray-700 dark:text-gray-200"></i>
        </button>

        <!-- Controls Group -->
        <div class="flex items-center space-x-4">


          <!-- Language Switch -->
          <button
            ref="langButton"
            @click="toggleLanguage"
            class="group relative h-9 w-9 rounded-full border  border-[#5984C6] dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-[#5984C6] dark:hover:border-[#5984C6] transition-colors duration-200 language-switch-button"
            :title="texts[lang]?.adminDashboard?.sidebar?.switchToEnglish || 'Switch language'"
          >
            <i
              ref="langIcon"
              class="fa-solid fa-globe absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[#5984C6] transition-all duration-500 dark:text-gray-100 group-hover:text-[#5984C6] dark:group-hover:text-white"
            ></i>
               <i class="fa-solid fa-globe "></i>
            <span class="sr-only">Toggle language</span>
          </button>




          
          <!-- Dark Mode Switch -->
          <button
            @click="toggleDarkMode"
            class="group relative h-9 w-9 rounded-full border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-[#5984C6] dark:hover:border-[#5984C6] transition-colors duration-200"
            :title="isDark ? (texts[lang]?.adminDashboard?.sidebar?.lightMode || 'Light mode') : (texts[lang]?.adminDashboard?.sidebar?.darkMode || 'Dark mode')"
          >
            <!-- Sun -->
            <svg
              id="sunIcon"
              xmlns="http://www.w3.org/2000/svg"
              class="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-6 w-6 transition-all duration-500"
              :class="{
                'rotate-0 scale-100 text-yellow-500 group-hover:text-yellow-600': !isDark,
                'rotate-90 scale-0 text-gray-600 group-hover:text-yellow-400': isDark
              }"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 3v1m0 16v1m8.66-12.34l-.7.7M5.05 18.95l-.7.7M21 12h1M2 12H1m16.95 6.95l.7.7M5.05 5.05l.7.7" />
            </svg>

            <!-- Moon -->
            <i
              class="fa-solid fa-moon absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-100 transition-all duration-500 -rotate-90 scale-0 dark:rotate-0 dark:scale-100 group-hover:text-[#5984C6] dark:group-hover:text-white"
            ></i>
            <span class="sr-only">Toggle theme</span>
          </button>

          <!-- Notification button -->
          <div class="relative">
            <button
              @click.stop="toggleNotifMenu"
              class="group relative h-9 w-9 rounded-full border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-[#5984C6] dark:hover:border-[#5984C6] transition-colors duration-200 flex items-center justify-center"
              :title="texts[lang]?.adminDashboard?.sidebar?.notifications || 'Notifications'"
            >
              <i class="fa-regular fa-bell text-gray-600 dark:text-gray-200"></i>
              <span v-if="notificationCount > 0"
                class="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] rounded-full px-1.5 py-0.5">
                {{ notificationCount }}
              </span>
            </button>
          </div>

          <!-- Profile button -->
          <div
            @click.stop="toggleUserMenu"
            class="w-12 h-12 ml-4 flex items-center justify-center bg-gray-200 rounded-full hover:bg-[#5984C6] transition-all duration-300 cursor-pointer overflow-hidden"
          >
            <img
              v-if="userPhoto && userPhoto !== 'null' && !userPhoto.startsWith('undefined')"
              :src="userPhoto"
              alt="profile"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
            <i v-else class="bi bi-person text-2xl text-gray-500"></i>
          </div>
        </div>

        <!-- Dropdown -->
        <transition name="fade-slide">
          <div
            v-if="isUserMenuOpen"
            ref="dropdown"
            :class="[
              'absolute top-16 bg-white dark:bg-[#1f2937] w-60 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50',
              lang === 'ar' ? 'left-4' : 'right-4'
            ]"
          >
            <div class="flex flex-col items-center py-4 border-b border-gray-200">
              <div
                class="w-12 h-12 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center border border-gray-300 dark:border-gray-600 overflow-hidden"
              >
                <img
                  v-if="userPhoto && userPhoto !== 'null' && !userPhoto.startsWith('undefined')"
                  :src="userPhoto"
                  alt="profile"
                  class="w-full h-full object-cover"
                  @error="handleImageError"
                />
                <i v-else class="bi bi-person text-xl text-gray-500"></i>
              </div>
              <h3 class="text-gray-800 dark:text-gray-100 font-medium mt-2">{{ userName || 'Admin' }}</h3>
              <p class="text-gray-500 dark:text-gray-300 text-sm">{{ userEmail }}</p>
            </div>

            <div class="flex flex-col py-2">
              <div @click="goToProfile" class="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer">
                <i class="fa-solid fa-user-gear text-[#5984C6]"></i>
                <span>{{ texts[lang]?.adminDashboard?.sidebar?.profileSettings || 'Profile Settings' }}</span>
              </div>

              <div
                @click="switchAccount"
                class="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
              >
                <i class="fa-solid fa-repeat text-[#5984C6]"></i>
                <span>{{ texts[lang]?.adminDashboard?.sidebar?.switchAccount || 'Switch Account' }}</span>
              </div>

              <div
                @click="handleLogout"
                class="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
              >
                <i class="fa-solid fa-arrow-right-from-bracket text-[#5984C6]"></i>
                <span>{{ texts[lang]?.adminDashboard?.sidebar?.logout || 'Logout' }}</span>
              </div>
            </div>
          </div>
        </transition>

        <!-- Notifications Dropdown -->
        <transition name="fade-slide">
          <div
            v-if="isNotifOpen"
            ref="notifDropdown"
            :class="[
              'absolute top-16 bg-white dark:bg-[#1f2937] w-80 rounded-2xl shadow-xl border border-gray-100 dark:border-gray-700 overflow-hidden z-50',
              lang === 'ar' ? 'left-4' : 'right-4'
            ]"
          >
            <div class="py-3 px-4 border-b border-gray-200 dark:border-gray-700">
              <div class="flex items-center justify-between">
                <h4 class="font-medium text-gray-800 dark:text-gray-100">{{ texts[lang]?.adminDashboard?.sidebar?.notifications || 'Notifications' }}</h4>
                <button
                  v-if="notificationCount > 0"
                  @click="markAllAsRead"
                  class="text-sm text-blue-600 dark:text-blue-400 hover:underline ml-2"
                >
                  {{ texts[lang]?.adminDashboard?.sidebar?.markAllAsRead || 'Mark All as Read' }}
                </button>
              </div>
            </div>

            <div class="flex flex-col max-h-80 overflow-y-auto">
              <!-- New Clients -->
              <router-link 
                v-if="newClientsCount > 0"
                @click="() => { isNotifOpen = false }" 
                to="/dashboard/users" 
                class="flex items-center justify-between px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#111827]"
              >
                <div class="flex items-center gap-2">
                  <i class="bi bi-person-plus text-[#5984C6]"></i>
                  <span>{{ texts[lang]?.adminDashboard?.notifications?.newClients || 'New clients' }}</span>
                </div>
                <div class="text-sm font-medium">{{ newClientsCount }}</div>
              </router-link>

              <!-- Pending Technicians -->
              <router-link 
                v-if="pendingTechniciansCount > 0"
                @click="() => { isNotifOpen = false }" 
                to="/dashboard/providers" 
                class="flex items-center justify-between px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#111827]"
              >
                <div class="flex items-center gap-2">
                  <i class="bi bi-person-badge text-[#f59e0b]"></i>
                  <span>{{ texts[lang]?.adminDashboard?.notifications?.pendingTechnicians || 'Pending technician accounts' }}</span>
                </div>
                <div class="text-sm font-medium">{{ pendingTechniciansCount }}</div>
              </router-link>

              <!-- Pending Companies -->
              <router-link 
                v-if="newCompaniesCount > 0"
                @click="() => { isNotifOpen = false }" 
                to="/dashboard/providers" 
                class="flex items-center justify-between px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#111827]"
              >
                <div class="flex items-center gap-2">
                  <i class="bi bi-building text-[#10b981]"></i>
                  <span>{{ texts[lang]?.adminDashboard?.notifications?.pendingCompanies || 'Pending company accounts' }}</span>
                </div>
                <div class="text-sm font-medium">{{ newCompaniesCount }}</div>
              </router-link>

              <!-- Completed Orders -->
              <router-link 
                v-if="newCompleteOrdersCount > 0"
                @click="() => { isNotifOpen = false }" 
                to="/dashboard/orders" 
                class="flex items-center justify-between px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#111827]"
              >
                <div class="flex items-center gap-2">
                  <i class="bi bi-cart-fill text-[#0cc033]"></i>
                  <span>{{ texts[lang]?.adminDashboard?.notifications?.completedOrders || 'Completed orders' }}</span>
                </div>
                <div class="text-sm font-medium">{{ newCompleteOrdersCount }}</div>
              </router-link>

              <!-- Cancelled Orders -->
              <router-link
                v-if="newCancelledOrdersCount > 0"
                @click="() => { isNotifOpen = false }"
                to="/dashboard/orders"
                class="flex items-center justify-between px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#111827]"
              >
                <div class="flex items-center gap-2">
                  <i class="bi bi-x-circle text-red-500"></i>
                  <span>{{ texts[lang]?.adminDashboard?.notifications?.cancelledOrders || 'Cancelled orders' }}</span>
                </div>
                <div class="text-sm font-medium">
                  {{ newCancelledOrdersCount }}
                </div>
              </router-link>

              <!-- New Payments -->
              <router-link 
                v-if="newPaymentsCount > 0"
                @click="() => { isNotifOpen = false }" 
                to="/dashboard/payments" 
                class="flex items-center justify-between px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#111827]"
              >
                <div class="flex items-center gap-2">
                  <i class="bi bi-credit-card text-[#06b6d4]"></i>
                  <span>{{texts[lang]?.adminDashboard?.notifications?.newPayments || 'New payments' }}</span>
                </div>
                <div class="text-sm font-medium">{{ newPaymentsCount }}</div>
              </router-link>

              <!-- Cancelled Payments -->
              <router-link
                v-if="newCancelledPaymentsCount > 0"
                @click="() => { isNotifOpen = false }"
                to="/dashboard/payments"
                class="flex items-center justify-between px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#111827]"
              >
                <div class="flex items-center gap-2">
                  <i class="bi bi-x-circle text-red-500"></i>
                  <span>{{ texts[lang]?.adminDashboard?.notifications?.cancelledPayments || 'Cancelled payments' }}</span>
                </div>
                <div class="text-sm font-medium">
                  {{ newCancelledPaymentsCount }}
                </div>
              </router-link>

              <!-- New Feedbacks -->
              <router-link 
                v-if="newFeedbacksCount > 0"
                @click="() => { isNotifOpen = false }" 
                to="/dashboard/support" 
                class="flex items-center justify-between px-4 py-2 hover:bg-gray-100 dark:hover:bg-[#111827]"
              >
                <div class="flex items-center gap-2">
                  <i class="bi bi-chat-left-text text-[#7c3aed]"></i>
                  <span>{{ texts[lang]?.adminDashboard?.notifications?.newFeedbacks || 'New feedback' }}</span>
                </div>
                <div class="text-sm font-medium">{{ newFeedbacksCount }}</div>
              </router-link>

              <!-- No Notifications Message -->
              <div 
                v-if="notificationCount === 0" 
                class="px-4 py-6 text-center text-gray-500 dark:text-gray-400 text-sm"
              >
                <i class="bi bi-bell text-2xl mb-2 block opacity-50"></i>
                <span>{{ texts[lang]?.adminDashboard?.notifications?.noNotifications || 'No notifications' }}</span>
              </div>
            </div>
          </div>
        </transition>
      </header>

      <!-- Page content -->
      <main class="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto bg-gray-50 dark:bg-[#0b1220]">
        <router-view></router-view>
      </main>
    </div>

    <!-- Overlay for mobile sidebar -->
    <div
      v-if="isSidebarOpen && windowWidth < 1024"
      @click="closeSidebar"
      class="fixed inset-0 bg-transparent z-30 lg:hidden"
    ></div>

  </div>
</template>
<script>
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useTestLang } from "@/langTest/useTestLang"
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc, collection, getDocs, query, where, setDoc, onSnapshot } from 'firebase/firestore'
import { db } from '../../firebase/firebase'

export default {
  setup() {
    const { lang, texts, switchLang } = useTestLang()
    const router = useRouter()
    const email = ref('')
    const password = ref('')
    const isUserMenuOpen = ref(false)
    const dropdown = ref(null)
    const langButton = ref(null)
    const langIcon = ref(null)
    const userEmail = ref('')
    const userName = ref('')
    const userPhoto = ref('')
    const isDark = ref(false)
    const isSidebarOpen = ref(false)
    const isNotifOpen = ref(false)
    const notifDropdown = ref(null)
    const newClientsCount = ref(0)
    const pendingTechniciansCount = ref(0)
    const newCompaniesCount = ref(0)
    const newCompleteOrdersCount = ref(0)
    const newPaymentsCount = ref(0)
    const newFeedbacksCount = ref(0)
    const newCancelledOrdersCount = ref(0)
    const newCancelledPaymentsCount = ref(0)

    const windowWidth = ref(window.innerWidth)
    const isLanguageSwitching = ref(false)
    const auth = getAuth()

    // Computed notification count as sum of all categories
    const notificationCount = computed(() => {
      return newClientsCount.value +
             pendingTechniciansCount.value +
             newCompaniesCount.value +
             newCompleteOrdersCount.value +
             newCancelledOrdersCount.value +
             newPaymentsCount.value +
             newCancelledPaymentsCount.value +   
             newFeedbacksCount.value
    })

    // Helper to get lastMarkedReadAt from Firebase
    const getLastMarkedReadAt = async () => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) return new Date(0); // Default to very old date
        
        const adminDoc = await getDoc(doc(db, 'admin', currentUser.uid));
        if (adminDoc.exists()) {
          const data = adminDoc.data();
          if (data.lastMarkedReadAt) {
            // Handle both Timestamp and string formats
            if (data.lastMarkedReadAt.seconds) {
              return new Date(data.lastMarkedReadAt.seconds * 1000);
            } else if (data.lastMarkedReadAt) {
              return new Date(data.lastMarkedReadAt);
            }
          }
        }
        
        // If no record exists, create one with current time
        const now = new Date();
        await setLastMarkedReadAt(now);
        return now;
      } catch (error) {
        console.error('Error getting lastMarkedReadAt from Firebase:', error);
        // Fallback to localStorage
        let ts = localStorage.getItem('lastMarkedReadAt');
        if (!ts) {
          const now = new Date();
          localStorage.setItem('lastMarkedReadAt', now.toISOString());
          ts = now.toISOString();
        }
        return new Date(ts);
      }
    };

    // Helper to set lastMarkedReadAt in Firebase
    const setLastMarkedReadAt = async (date) => {
      try {
        const currentUser = auth.currentUser;
        if (!currentUser) {
          // Fallback to localStorage if no user
          localStorage.setItem('lastMarkedReadAt', date.toISOString());
          return;
        }
        
        await setDoc(doc(db, 'admin', currentUser.uid), {
          lastMarkedReadAt: date.toISOString()
        }, { merge: true });
        
        // Also update localStorage as backup
        localStorage.setItem('lastMarkedReadAt', date.toISOString());
      } catch (error) {
        console.error('Error setting lastMarkedReadAt in Firebase:', error);
        // Fallback to localStorage
        localStorage.setItem('lastMarkedReadAt', date.toISOString());
      }
    };

    // Updated markAllAsRead function
    const markAllAsRead = async () => {
      try {
        const now = new Date();
        await setLastMarkedReadAt(now);
        
        // Reset all counts
        newClientsCount.value = 0;
        pendingTechniciansCount.value = 0;
        newCompaniesCount.value = 0;
        newCompleteOrdersCount.value = 0;
        newCancelledOrdersCount.value = 0;
        newPaymentsCount.value = 0;
        newCancelledPaymentsCount.value = 0;
        newFeedbacksCount.value = 0;
        
        isNotifOpen.value = false;
        
        console.log('All notifications marked as read at:', now);
      } catch (error) {
        console.error('Error marking all as read:', error);
      }
    };

    // Add real-time listeners for notifications
    const setupRealTimeListeners = () => {
      // Listen for new clients
      onSnapshot(collection(db, 'clients'), (snapshot) => {
        fetchNotificationCounts(); // Refresh counts when clients change
      });

      // Listen for technicians
      onSnapshot(query(collection(db, 'technicians'), where('status', '==', 'pending')), (snapshot) => {
        fetchNotificationCounts();
      });

      // Listen for companies
      onSnapshot(collection(db, 'companies'), (snapshot) => {
        fetchNotificationCounts();
      });

      // Listen for orders
      onSnapshot(collection(db, 'orders'), (snapshot) => {
        fetchNotificationCounts();
      });

      // Listen for payments
      onSnapshot(collection(db, 'payments'), (snapshot) => {
        fetchNotificationCounts();
      });

      // Listen for feedbacks
      onSnapshot(collection(db, 'feedbacks'), (snapshot) => {
        fetchNotificationCounts();
      });
    };

    // Updated fetchNotificationCounts to use Firebase timestamp
    const fetchNotificationCounts = async () => {
      try {
        const lastMarkedReadAt = await getLastMarkedReadAt();
        console.log('Fetching notifications after:', lastMarkedReadAt);

        // New clients (createdAt may be string or Timestamp)
        try {
          const clientsSnap = await getDocs(collection(db, 'clients'));
          let c = 0;
          clientsSnap.forEach((d) => {
            const data = d.data() || {};
            let dt = null;
            if (data.createdAt && data.createdAt.seconds) dt = new Date(data.createdAt.seconds * 1000);
            else if (data.createdAt) dt = new Date(data.createdAt);
            if (dt && dt > lastMarkedReadAt) c++;
          });
          newClientsCount.value = c;
        } catch (e) { 
          console.error('Error fetching clients:', e);
          newClientsCount.value = 0;
        }

        // Pending technicians (status pending)
        try {
          const pendingTechSnap = await getDocs(query(collection(db, 'technicians'), where('status', '==', 'pending')));
          let pCount = 0;
          pendingTechSnap.forEach((d) => {
            const data = d.data() || {};
            let dt = null;
            if (data.createdAt && data.createdAt.seconds) dt = new Date(data.createdAt.seconds * 1000);
            else if (data.createdAt) dt = new Date(data.createdAt);
            if (dt && dt > lastMarkedReadAt) pCount++;
          });
          pendingTechniciansCount.value = pCount;
        } catch (e) { 
          console.error('Error fetching technicians:', e);
          pendingTechniciansCount.value = 0;
        }

        // New companies (createdAt after lastMarkedReadAt)
        try {
          const compsSnap = await getDocs(collection(db, 'companies'));
          let cc = 0;
          compsSnap.forEach((d) => {
            const data = d.data() || {};
            let dt = null;
            if (data.createdAt && data.createdAt.seconds) dt = new Date(data.createdAt.seconds * 1000);
            else if (data.createdAt) dt = new Date(data.createdAt);
            if (dt && dt > lastMarkedReadAt) cc++;
          });
          newCompaniesCount.value = cc;
        } catch (e) { 
          console.error('Error fetching companies:', e);
          newCompaniesCount.value = 0;
        }

        // New completed orders (status completed and after lastMarkedReadAt)
        try {
          const ordersSnap = await getDocs(collection(db, 'orders'));
          let oc = 0;
          let cc = 0;
          ordersSnap.forEach((d) => {
            const data = d.data() || {};
            if (data.status === 'completed') {
              let dt = null;
              if (data.createdAt && data.createdAt.seconds) dt = new Date(data.createdAt.seconds * 1000);
              else if (data.createdAt) dt = new Date(data.createdAt);
              else if (data.date && data.date.seconds) dt = new Date(data.date.seconds * 1000);
              if (dt && dt > lastMarkedReadAt) oc++;
            }
            if (data.status === 'cancelled') {
              let dt = null;
              if (data.createdAt && data.createdAt.seconds) dt = new Date(data.createdAt.seconds * 1000);
              else if (data.createdAt) dt = new Date(data.createdAt);
              else if (data.date && data.date.seconds) dt = new Date(data.date.seconds * 1000);
              if (dt && dt > lastMarkedReadAt) cc++;
            }
          });
          newCompleteOrdersCount.value = oc;
          newCancelledOrdersCount.value = cc;
        } catch (e) { 
          console.error('Error fetching orders:', e);
          newCompleteOrdersCount.value = 0;
          newCancelledOrdersCount.value = 0;
        }

        // New payments
        try {
          const paySnap = await getDocs(collection(db, 'payments'));
          let pc = 0;
          let cc = 0;
          paySnap.forEach((d) => {
            const data = d.data() || {};
            let dt = null;
            if (data.date && data.date.seconds) dt = new Date(data.date.seconds * 1000);
            else if (data.createdAt && data.createdAt.seconds) dt = new Date(data.createdAt.seconds * 1000);
            else if (data.createdAt) dt = new Date(data.createdAt);

            if (data.status === 'completed' && dt && dt > lastMarkedReadAt) pc++;
            if (data.status === 'cancelled' && dt && dt > lastMarkedReadAt) cc++;
          });
          newPaymentsCount.value = pc;
          newCancelledPaymentsCount.value = cc;
        } catch (e) {
          console.error('Error fetching payments:', e);
          newPaymentsCount.value = 0;
          newCancelledPaymentsCount.value = 0;
        }

        // New feedbacks (createdAt after lastMarkedReadAt)
        try {
          const fbSnap = await getDocs(collection(db, 'feedbacks'));
          let fc = 0;
          fbSnap.forEach((d) => {
            const data = d.data() || {};
            let dt = null;
            if (data.createdAt && data.createdAt.seconds) dt = new Date(data.createdAt.seconds * 1000);
            else if (data.createdAt) dt = new Date(data.createdAt);
            if (dt && dt > lastMarkedReadAt) fc++;
          });
          newFeedbacksCount.value = fc;
        } catch (e) { 
          console.error('Error fetching feedbacks:', e);
          newFeedbacksCount.value = 0;
        }

      } catch (e) {
        console.error('fetchNotificationCounts failed', e);
      }
    };

    // 🟦 تحميل بيانات المستخدم
    onMounted(() => {
      const currentUser = auth.currentUser
      if (currentUser) {
        userEmail.value = currentUser.email
        userName.value = localStorage.getItem('adminName') || currentUser.displayName || ''
        userPhoto.value = localStorage.getItem('adminPhoto') || currentUser.photoURL || ''
      }

      onAuthStateChanged(auth, async (user) => {
        if (user) {
          userEmail.value = user.email

          const cachedName = localStorage.getItem('adminName')
          const cachedPhoto = localStorage.getItem('adminPhoto')

          if (cachedName) userName.value = cachedName
          if (cachedPhoto) userPhoto.value = cachedPhoto

          if (!cachedName || !cachedPhoto) {
            try {
              const refDoc = doc(db, 'admin', user.uid)
              const snap = await getDoc(refDoc)

              if (snap.exists()) {
                const data = snap.data()
                if (data.name) {
                  userName.value = data.name
                  localStorage.setItem('adminName', data.name)
                }
                if (data.photoURL) {
                  userPhoto.value = data.photoURL
                  localStorage.setItem('adminPhoto', data.photoURL)
                }
              }
            } catch (e) {}
          }
        } else {
          userEmail.value = ""
        }
      })

      // تحديث من AdminProfile
      window.addEventListener('adminProfileChanged', (e) => {
        if (e.detail.name) {
          userName.value = e.detail.name
          localStorage.setItem('adminName', e.detail.name)
        }

        if ("photoURL" in e.detail) {
          if (e.detail.photoURL) {
            userPhoto.value = e.detail.photoURL
            localStorage.setItem('adminPhoto', e.detail.photoURL)
          } else {
            userPhoto.value = null
            localStorage.removeItem('adminPhoto')
          }
        }
      })

      window.addEventListener('storage', (e) => {
        if (e.key === 'adminName') userName.value = e.newValue
        if (e.key === 'adminPhoto') userPhoto.value = e.newValue
      })

      document.addEventListener('click', handleClickOutside)
      window.addEventListener('resize', handleResize)

      // الثيم
      const savedTheme = localStorage.getItem('theme')
      applyTheme(savedTheme || "light")
      
      // Load initial notification counts
      fetchNotificationCounts()
      
      // Setup real-time listeners
      setupRealTimeListeners()
      
      // refresh counts periodically (backup)
      setInterval(() => {
        fetchNotificationCounts()
      }, 30000)
    })

    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside)
      window.removeEventListener('resize', handleResize)
    })

    // 🟧 قائمة المستخدم
    const toggleUserMenu = () => {
      isNotifOpen.value = false;
      isUserMenuOpen.value = !isUserMenuOpen.value;
    }
    const closeMenu = () => isUserMenuOpen.value = false

    const handleClickOutside = (e) => {
      if (dropdown.value && !dropdown.value.contains(e.target)) {
        isUserMenuOpen.value = false
      }
      if (notifDropdown.value && !notifDropdown.value.contains(e.target)) {
        isNotifOpen.value = false
      }
    }

    const goToProfile = () => {
      router.push('/dashboard/adminprofile')
      isUserMenuOpen.value = false
    }

    // 🔴 تسجيل خروج
    const handleLogout = async () => {
      try {
        await signOut(auth)
        router.push('/login')
      } catch (e) {
        alert("Logout failed")
      }
    }

    // 🟢 تسجيل دخول
    const handleSignIn = async () => {
      try {
        const userCredential = await signInWithEmailAndPassword(auth, email.value, password.value)
        const user = userCredential.user
        const userDoc = await getDoc(doc(db, 'users', user.uid))

        if (userDoc.exists()) {
          const role = userDoc.data().role
          router.push(role === "admin" ? "/dashboard" : "/home")
        }
      } catch (e) {
        alert("Login failed")
      }
    }

    // 🌙/☀️ الثيم
    const applyTheme = (theme) => {
      const root = document.documentElement
      if (theme === "dark") {
        root.classList.add("dark")
        isDark.value = true
      } else {
        root.classList.remove("dark")
        isDark.value = false
      }
    }

    const toggleDarkMode = () => {
      const next = isDark.value ? "light" : "dark"
      applyTheme(next)
      localStorage.setItem("theme", next)
    }

    const toggleLanguage = () => {
      isLanguageSwitching.value = true

      const next = lang.value === "ar" ? "en" : "ar"
      const isClockwise = next === "ar" // Clockwise for English to Arabic

      // Add rotation class to icon
      if (langIcon.value) {
        langIcon.value.classList.add(isClockwise ? 'rotate-animate-clockwise' : 'rotate-animate-counterclockwise')
      }

      switchLang(next)

      document.documentElement.lang = next
      document.documentElement.dir = next === "ar" ? "rtl" : "ltr"

      localStorage.setItem("lang", next)

      // إنهاء الانيميشن بعد انتهاء الدوران
      setTimeout(() => {
        isLanguageSwitching.value = false
        // Remove rotation class after animation
        if (langIcon.value) {
          langIcon.value.classList.remove('rotate-animate-clockwise', 'rotate-animate-counterclockwise')
        }
      }, 600) // Slightly longer than animation duration
    }

    const handleImageError = (event) => {
      userPhoto.value = null
      localStorage.removeItem('adminPhoto')
      event.target.style.display = "none"
    }

    // Notifications
    const toggleNotifMenu = () => {
      isUserMenuOpen.value = false;
      isNotifOpen.value = !isNotifOpen.value;
    }

    // Sidebar toggle functions
    const toggleSidebar = () => {
      isSidebarOpen.value = !isSidebarOpen.value
    }

    const closeSidebar = () => {
      isSidebarOpen.value = false
    }

    const handleResize = () => {
      windowWidth.value = window.innerWidth
      // Auto-close sidebar on desktop resize
      if (windowWidth.value >= 1024) {
        isSidebarOpen.value = false
      }
    }

    return {
      lang,
      texts,
      switchLang,
      toggleLanguage,
      email,
      password,
      handleSignIn,
      handleLogout,
      switchAccount: () => { handleLogout(); router.push('/login') },
      toggleUserMenu,
      closeMenu,
      isUserMenuOpen,
      dropdown,
      goToProfile,
      userEmail,
      userName,
      userPhoto,
      handleImageError,
      isDark,
      toggleDarkMode,
      langButton,
      langIcon,
      isSidebarOpen,
      toggleSidebar,
      closeSidebar,
      // Notifications
      isNotifOpen,
      toggleNotifMenu,
      notifDropdown,
      newClientsCount,
      pendingTechniciansCount,
      newCompaniesCount,
      newCompleteOrdersCount,
      newPaymentsCount,
      newFeedbacksCount,
      fetchNotificationCounts,
      windowWidth,
      isLanguageSwitching,
      markAllAsRead,
      notificationCount,
      newCancelledOrdersCount,
      newCancelledPaymentsCount
    }
  }
}
</script>