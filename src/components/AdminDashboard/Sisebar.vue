<template>
  <div class="flex bg-gray-100 dark:bg-[#0f172a] text-gray-900 dark:text-gray-100 h-screen">

    <!-- Sidebar -->
    <aside class="flex-shrink-0 w-64 bg-[#344767] text-white flex flex-col p-5 justify-between">
      <div>
        <div class="flex flex-col items-center mb-6">
          <img
            src="https://res.cloudinary.com/dlrgf0myy/image/upload/v1760784552/image__11_-removebg-preview_ev3uvd.png"
            alt="Logo"
            class="h-16 mb-3"
          />
          <h2 class="text-lg font-semibold tracking-wide">
            {{ texts[lang].adminDashboard.sidebar.title }}
          </h2>
          <div class="w-full h-px bg-gray-400 mt-5"></div>
        </div>

        <nav class="flex flex-col space-y-3">
          <router-link
            to="/dashboard"
            class="flex items-center space-x-2 p-2 rounded-md transition-colors duration-200"
            :class="{ 'bg-[#5984C6]': $route.path === '/dashboard' }"
          >
            <i class="bi bi-house"></i>
            <span>{{ texts[lang].adminDashboard.sidebar.dashboard }}</span>
          </router-link>

          <router-link
            to="/dashboard/users"
            class="flex items-center space-x-2 p-2 rounded-md transition-colors duration-200"
            :class="{ 'bg-[#5984C6]': $route.path === '/dashboard/users' }"
          >
            <i class="bi bi-people"></i>
            <span>{{ texts[lang].adminDashboard.sidebar.users }}</span>
          </router-link>

          <router-link
            to="/dashboard/services"
            class="flex items-center space-x-2 p-2 rounded-md transition-colors duration-200"
            :class="{ 'bg-[#5984C6]': $route.path === '/dashboard/services' }"
          >
            <i class="bi bi-briefcase"></i>
            <span>{{ texts[lang].adminDashboard.sidebar.services }}</span>
          </router-link>

          <router-link
            to="/dashboard/providers"
            class="flex items-center space-x-2 p-2 rounded-md transition-colors duration-200"
            :class="{ 'bg-[#5984C6]': $route.path === '/dashboard/providers' }"
          >
            <i class="bi bi-building"></i>
            <span>{{ texts[lang].adminDashboard.sidebar.providers }}</span>
          </router-link>

          <router-link
            to="/dashboard/orders"
            class="flex items-center space-x-2 p-2 rounded-md transition-colors duration-200"
            :class="{ 'bg-[#5984C6]': $route.path === '/dashboard/orders' }"
          >
            <i class="bi bi-receipt"></i>
            <span>{{ texts[lang].adminDashboard.sidebar.orders }}</span>
          </router-link>

          <router-link
            to="/dashboard/payments"
            class="flex items-center space-x-2 p-2 rounded-md transition-colors duration-200"
            :class="{ 'bg-[#5984C6]': $route.path === '/dashboard/payments' }"
          >
            <i class="bi bi-credit-card"></i>
            <span>{{ texts[lang].adminDashboard.sidebar.payments }}</span>
          </router-link>

          <router-link
            to="/dashboard/support"
            class="flex items-center space-x-2 p-2 rounded-md transition-colors duration-200"
            :class="{ 'bg-[#5984C6]': $route.path === '/dashboard/support' }"
          >
            <i class="bi bi-question-circle"></i>
            <span>{{ texts[lang].adminDashboard.sidebar.support }}</span>
          </router-link>

          <router-link
            to="/dashboard/addoffer"
            class="flex items-center space-x-2 p-2 rounded-md transition-colors duration-200"
            :class="{ 'bg-[#5984C6]': $route.path === '/dashboard/addoffer' }"
          >
            <i class="bi bi-tags"></i>
            <span>{{ texts[lang].adminDashboard.sidebar.offers }}</span>
          </router-link>
        </nav>
      </div>

      <!-- Logout Button -->
      <div class="flex justify-center mb-4">
        <button
          @click="handleLogout"
          class="flex items-center justify-center space-x-1 text-white font-medium text-sm py-1 px-3 rounded-xl transition-all duration-500 border border-white hover:bg-white hover:text-[#133B5D]"
        >
          <i class="bi bi-box-arrow-right text-lg"></i>
          <span>{{ texts[lang].adminDashboard.sidebar.logout }}</span>
        </button>
      </div>
    </aside>

    <!-- Main layout -->
    <div class="flex-1 flex flex-col">
      <header class="flex justify-end items-center bg-white dark:bg-[#111827] shadow-sm p-4 space-x-4 relative">

        <!-- Language Switch -->
        <button
          ref="langButton"
          @click="toggleLanguage"
          class="group relative h-9 w-9 rounded-full border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-[#5984C6] dark:hover:border-[#5984C6] transition-colors duration-200 language-switch-button"
          :title="texts[lang].adminDashboard.sidebar.switchToEnglish"
        >
          <i
            class="fa-solid fa-language absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-600 transition-all duration-500 dark:text-gray-100 group-hover:text-[#5984C6] dark:group-hover:text-white"
          ></i>
          <span class="sr-only">Toggle language</span>
        </button>

        <!-- Dark Mode Switch -->
        <button
          @click="toggleDarkMode"
          class="group relative h-9 w-9 rounded-full border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-[#5984C6] dark:hover:border-[#5984C6] transition-colors duration-200"
          :title="isDark ? texts[lang].adminDashboard.sidebar.lightMode : texts[lang].adminDashboard.sidebar.darkMode"
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

        <!-- Profile button -->
        <div
          @click.stop="toggleUserMenu"
          class="w-10 h-10 flex items-center justify-center bg-gray-200 rounded-full hover:bg-[#5984C6] transition-all duration-300 cursor-pointer overflow-hidden"
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
                class="w-16 h-16 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center border border-gray-300 dark:border-gray-600 overflow-hidden"
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
              <h3 class="text-gray-800 dark:text-gray-100 font-medium mt-2">{{ userName || 'Admin' }}</h3>
              <p class="text-gray-500 dark:text-gray-300 text-sm">{{ userEmail }}</p>
            </div>

            <div class="flex flex-col py-2">
              <div @click="goToProfile" class="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer">
                <i class="fa-solid fa-user-gear text-[#5984C6]"></i>
                <span>{{ texts[lang].adminDashboard.sidebar.profileSettings }}</span>
              </div>

              <div
                @click="switchAccount"
                class="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
              >
                <i class="fa-solid fa-repeat text-[#5984C6]"></i>
                <span>{{ texts[lang].adminDashboard.sidebar.switchAccount }}</span>
              </div>

              <div
                @click="handleLogout"
                class="flex items-center space-x-2 px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700 transition cursor-pointer"
              >
                <i class="fa-solid fa-arrow-right-from-bracket text-[#5984C6]"></i>
                <span>{{ texts[lang].adminDashboard.sidebar.logout }}</span>
              </div>
            </div>
          </div>
        </transition>

      </header>

      <!-- Page content -->
      <main class="flex-1 p-8 overflow-y-auto bg-gray-50 dark:bg-[#0b1220]">
        <router-view></router-view>
      </main>
    </div>

  </div>
</template>


<script>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRouter } from 'vue-router'
import { useTestLang } from "@/langTest/useTestLang"
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { db } from '../../firebase/firebase'

export default {
  setup() {
    // 🟩 الترجمة الجديدة
    const { lang, texts, switchLang } = useTestLang()

    const router = useRouter()
    const email = ref('')
    const password = ref('')
    const isUserMenuOpen = ref(false)
    const dropdown = ref(null)
    const langButton = ref(null)
    const userEmail = ref('')
    const userName = ref('')
    const userPhoto = ref('')
    const isDark = ref(false)
    const auth = getAuth()

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

      // الثيم
      const savedTheme = localStorage.getItem('theme')
      applyTheme(savedTheme || "light")
    })

    onBeforeUnmount(() => {
      document.removeEventListener('click', handleClickOutside)
    })

    // 🟧 قائمة المستخدم
    const toggleUserMenu = () => isUserMenuOpen.value = !isUserMenuOpen.value
    const closeMenu = () => isUserMenuOpen.value = false

    const handleClickOutside = (e) => {
      if (dropdown.value && !dropdown.value.contains(e.target)) {
        isUserMenuOpen.value = false
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

    // 🌐 تغيير اللغة الجديدة
    const toggleLanguage = () => {
      const next = lang.value === "ar" ? "en" : "ar"
      switchLang(next)

      document.documentElement.lang = next
      document.documentElement.dir = next === "ar" ? "rtl" : "ltr"

      localStorage.setItem("lang", next)
    }

    // ⛔ صورة فاسدة
    const handleImageError = (event) => {
      userPhoto.value = null
      localStorage.removeItem('adminPhoto')
      event.target.style.display = "none"
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
    }
  }
}
</script>


<style scoped>
.fade-slide-enter-active,
.fade-slide-leave-active {
  transition: all 0.3s ease;
}
.fade-slide-enter-from,
.fade-slide-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}

/* Language switch animation */
.language-switch-button {
  transition: transform 0.3s ease-in-out;
}

.rotate-animation {
  animation: rotate 0.5s ease-in-out;
}

@keyframes rotate {
  from {
    transform: rotate(0deg);
  }
  to {
    transform: rotate(360deg);
  }
}

</style>
