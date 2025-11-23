<template>
  <div>
    <!-- ======== GRID VIEW ======== -->
    <div
      v-if="viewType === 'grid'"
      class="relative group bg-linear-to-b from-[#f5f5f5] to-gray-300 dark:bg-linear-to-b dark:from-[#1f2937] dark:to-[#111827] w-full h-100 rounded-2xl overflow-hidden shadow-xl transition-all duration-200"
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
    >
      <img
        :src="profileImageSrc"
        alt="Profile photo"
        class="absolute w-full h-[60%] object-contain"
      />

      <svg
        class="absolute bottom-0 left-0 w-full z-10 transition-all duration-500"
        viewBox="0 0 1440 350"
        preserveAspectRatio="none"
      >
        <path
          class="transition-all duration-500"
          :class="{
            'fill-accent-color': isHovered,
            'fill-white dark:fill-(--surface)': !isHovered,
          }"
          d="
          M0,200
          C240,220,480,180,720,200
          C960,220,1200,180,1440,200
          V350H0Z
        "
        />
      </svg>

      <div
        class="h-15 w-15 rounded-full absolute z-20 top-1/2 right-10 rtl:right-auto rtl:left-10 border border-white flex items-center justify-center transition-all duration-500"
        :class="isHovered ? 'bg-dark-blue' : 'bg-accent-color'"
      >
        <img :src="serviceIcon" alt="service icon" class="transition-all duration-500 p-2" />
      </div>

      <div class="absolute bottom-0 w-full px-4 py-3 z-20 flex flex-col items-center text-center">
        <h2
          class="text-2xl font-bold transition-colors duration-500"
          :class="isHovered ? 'text-white' : 'text-(--text-primary)'"
        >
          {{ profile.name }}
        </h2>

        <div
          class="text-m pt-4"
          :class="isHovered ? 'text-(--text-primary)' : 'text-accent-color'"
        >
          {{ texts[lang].profilesPage.ordersCompleted }}
          <span class="font-semibold">
            {{ ordersCompleted > 0 ? "+" + ordersCompleted : 0 }}
          </span>
        </div>

        <div class="flex items-center gap-1">
          <span
            class="text-sm font-bold"
            :class="isHovered ? 'text-white' : 'text-(--text-primary)'"
          >
            {{ profile.rating.toFixed() }}
          </span>
          <i class="fa-solid fa-star text-[#FF9529]"></i>
        </div>

        <div class="flex flex-row items-center gap-10">
          <button
            class="mt-4 text-white text-sm font-medium px-5 py-2 rounded-lg shadow transition-all duration-500"
            :class="isHovered ? 'bg-[#0B161B]' : 'bg-[#5984C6]'"
            @click="goToProfile"
          >
            {{ texts[lang].profilesPage.viewProfile }}
          </button>

          <div class="flex items-center gap-1 mt-2">
            <i
              class="fa-solid fa-location-dot"
              :class="isHovered ? 'text-white' : 'text-(--text-primary)'"
            ></i>
            <span class="text-sm" :class="isHovered ? 'text-white' : 'text-(--text-primary)'">
              {{ profile.location }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- ======== LIST VIEW ======== -->
    <div
      v-else
      @mouseenter="isHovered = true"
      @mouseleave="isHovered = false"
      class="flex flex-col sm:flex-row items-start dark:bg-(--surface) rounded-2xl overflow-hidden shadow-xl p-4 gap-4 sm:gap-6 hover:shadow-2xl transition-shadow duration-200"
    >
      <img
        :src="profileImageSrc"
        alt="Profile photo"
        class="w-full sm:w-32 sm:h-32 md:w-50 md:h-50 object-cover rounded-xl"
      />

      <div class="flex flex-col flex-1 mt-4 sm:mt-0 text-left rtl:text-right">

        <h2 class="text-lg md:text-xl font-bold text-(--text-primary)">
          {{ profile.name }}
        </h2>

        <div class="flex items-center gap-2 text-sm text-(--text-muted)">
          <span class="font-medium text-accent-color">
            {{ profile.service }}
          </span>
        </div>

        <p class="text-sm md:text-base text-(--text-muted) mt-2">
          {{ profile.bio }}
        </p>

        <div
          class="flex flex-col sm:flex-row sm:items-center sm:justify-between mt-4 md:mt-20 gap-4"
        >
          <div class="flex items-center gap-6 text-sm text-(--text-primary)">
            <div class="flex items-center gap-1">
              <i class="fa-solid fa-star text-[#FF9529]"></i>
              <span class="font-bold">{{ profile.rating.toFixed() }}</span>
            </div>

            <div class="flex items-center gap-1">
              <i class="fa-solid fa-location-dot text-accent-color"></i>
              <span class="font-semibold">{{ profile.location || "not specified" }}</span>
            </div>

            <div class="flex items-center gap-1">
              <img src="../images/mechanical (1).png" class="w-5 h-5" alt="" />
              <span class="font-semibold">
                {{ ordersCompleted > 0 ? "+" + ordersCompleted : 0 }}
              </span>
            </div>
          </div>

          <button
            @click="goToProfile"
            class="w-full sm:w-auto mx-auto sm:mx-0 text-white text-sm font-medium px-5 py-2 rounded-lg transition duration-300 bg-accent-color hover:bg-dark-blue"
          >
            {{ texts[lang].profilesPage.viewProfile }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { auth, db } from "@/firebase/firebase";
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  onSnapshot,
} from "firebase/firestore";

import { useTestLang } from "@/langTest/useTestLang";

export default {
  name: "ProfileCard",

  setup() {
    const { lang, texts } = useTestLang();
    return { lang, texts };
  },

  data() {
    return {
      isHovered: false,
      memberSince: "",
      ordersCompleted: 0,
      ordersUnsub: null,
    };
  },

  props: {
    profile: Object,
    viewType: {
      type: String,
      default: "grid",
    },
  },

  computed: {
          // import images via import.meta.url so bundler resolves them correctly
  electIcon() { return new URL('../images/electretionIcon.png', import.meta.url).href; },
  finishIcon() { return new URL('../images/finishcompanyIcon.png', import.meta.url).href; },
  carpIcon() { return new URL('../images/carpenterIcon.png', import.meta.url).href; },
  plumbIcon() { return new URL('../images/plumberIcon.png', import.meta.url).href; },

  serviceIcon() {
    const svc = (this.profile?.service || "").toString().toLowerCase().trim();
    if (svc.includes("elect") || svc.includes("electric") || svc.includes("electrical")) return this.electIcon;
    if (svc.includes("finish") || svc.includes("finishing") || svc.includes("painting")) return this.finishIcon;
    if (svc.includes("carp") || svc.includes("carpentry")) return this.carpIcon;
    if (svc.includes("plumb") || svc.includes("plumbing")) return this.plumbIcon;

    // fallback to profile image or default
    if (this.profile?.profileImage) return this.profile.profileImage;
    return new URL('../images/engineer2.png', import.meta.url).href;
  },

    profileImageSrc() {
      return typeof this.profile.profileImage === "string" && this.profile.profileImage
        ? this.profile.profileImage
        : "/images/engineer2.png";
    },
  },

  methods: {
    goToProfile() {
      if (this.profile.type === "technician") {
        this.$router.push(`/profile/${this.profile.id}`);
      } else if (this.profile.type === "company") {
        this.$router.push(`/company-profile/${this.profile.id}`);
      } else {
        this.$router.push(`/profile/${this.profile.id}`);
      }
    },
  },

  async mounted() {
    try {
      const profileId = this.profile?.id;

      if (profileId) {
        const userRef = doc(db, "technicians", profileId);
        const userSnap = await getDoc(userRef);

        if (userSnap.exists()) {
          const data = userSnap.data();

          if (data.createdAt?.seconds) {
            const date = new Date(data.createdAt.seconds * 1000);
            this.memberSince = date.getFullYear();
          } else {
            const d = new Date(data.createdAt);
            this.memberSince = isNaN(d.getTime())
              ? this.texts[this.lang].profilesPage.fallbackNA
              : d.getFullYear();
          }
        }
      }

      const pid = profileId || auth.currentUser?.uid;

      if (pid) {
        const ordersRef = collection(db, "orders");
        const q = query(
          ordersRef,
          where("technicianId", "==", pid),
          where("status", "==", "completed")
        );

        this.ordersUnsub = onSnapshot(q, (snap) => {
          this.ordersCompleted = snap.size;
        });
      }
    } catch (e) {
      console.error("ProfileCard mounted error:", e);
    }
  },

  beforeUnmount() {
    if (this.ordersUnsub) this.ordersUnsub();
  },
};
</script>

<style scoped>
svg {
  height: 100%;
}
</style>
