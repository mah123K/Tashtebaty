<template>
  <div class="pb-16">
    <div class="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 mt-10">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        
        <div
          class="relative lg:col-span-2 w-full mx-auto bg-accent-color rounded-3xl p-8 text-white shadow-2xl transform hover:scale-105 transition duration-300"
        >
          <div
            class="absolute top-4 right-4 rtl:right-auto rtl:left-4 bg-white/20 backdrop-blur-sm px-3 py-1 rounded-full text-sm"
          >
            {{ texts[lang].offersPage.banner1.tag }}
          </div>
          <h1 class="text-3xl md:text-4xl font-bold mb-4">{{ texts[lang].offersPage.banner1.title }}</h1>
          <div
            class="bg-white/10 backdrop-blur-md rounded-2xl p-6 border-2 border-white/30 inline-block"
          >
            <div class="text-4xl md:text-5xl font-black mb-2">150 EGP</div>
            <div class="text-2xl font-semibold">{{ texts[lang].offersPage.banner1.subtitle }}</div>
          </div>
          <p class="mt-6 text-lg">{{ texts[lang].offersPage.banner1.text }}</p>
          <router-link
            to="/signup"
            class="mt-6 bg-white text-accent-color w-fit px-8 py-3 rounded-full font-semibold hover:shadow-xl transition transform hover:scale-105 flex items-center space-x-2 rtl:space-x-reverse"
          >
            <span>{{ texts[lang].offersPage.banner1.button }}</span>
          </router-link>
        </div>

        <div
          class="bg-gradient-to-br w-full mx-auto from-purple-600 to-pink-500 rounded-2xl p-8 text-white shadow-2xl hover:scale-105 transition duration-300"
        >
          <div class="flex flex-col items-center justify-between gap-6">
            <div class="flex-1 text-center">
              <h2 class="text-2xl md:text-3xl font-bold mb-2">{{ texts[lang].offersPage.banner2.title }}</h2>
              <p class="text-lg opacity-90">
                {{ texts[lang].offersPage.banner2.text }}
              </p>
            </div>

            <div
              class="bg-white/10 backdrop-blur-md rounded-2xl px-8 py-6 border-2 border-white/30"
            >
              <div class="text-3xl md:text-4xl font-black">100 EGP</div>
              <div class="text-sm font-semibold mt-1">{{ texts[lang].offersPage.banner2.subtitle }}</div>
            </div>

            <button
              class="bg-white text-purple-600 px-8 py-4 rounded-full font-semibold hover:shadow-xl transition transform hover:scale-105 flex items-center space-x-2 rtl:space-x-reverse whitespace-nowrap"
            >
              <span>{{ texts[lang].offersPage.banner2.button }}</span>
            </button>
          </div>
        </div>
      </div>
    </div>

    <div class="w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
      <div v-if="isLoading" class="text-center py-20">
        <div
          class="animate-spin rounded-full h-10 w-10 border-b-2 border-accent-color mx-auto"
        ></div>
        <p class="mt-3 text-(--text-muted)">{{ texts[lang].offersPage.grid.loading }}</p>
      </div>

      <div v-else-if="offers.length === 0" class="text-center py-20">
        <i class="fa-solid fa-tags text-4xl text-(--text-muted) mb-4"></i>
        <h3 class="text-xl font-semibold text-(--text-primary)">
          {{ texts[lang].offersPage.grid.emptyTitle }}
        </h3>
        <p class="text-(--text-muted) mt-2">{{ texts[lang].offersPage.grid.emptyText }}</p>
      </div>

      <div class="pb-16">
        <!-- Toast Message -->
        <!-- <div
          v-if="showMessage"
          class="fixed top-5 left-1/2 -translate-x-1/2 bg-red-600 text-white px-6 py-3 rounded-xl shadow-lg z-50"
        >
          {{ showMessage }}
        </div> -->

        <!-- Offers Grid -->
        <div class="w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-14">
          <!-- Loading -->
          <div v-if="isLoading" class="text-center py-20">
            <div
              class="animate-spin rounded-full h-10 w-10 border-b-2 border-accent-color mx-auto"
            ></div>
            <p class="mt-3 text-(--text-muted)">{{ texts[lang].offersPage.grid.loading }}</p>
          </div>

          <!-- Empty -->
          <div v-else-if="offers.length === 0" class="text-center py-20">
            <i class="fa-solid fa-tags text-4xl text-(--text-muted) mb-4"></i>
            <h3 class="text-xl font-semibold text-(--text-primary)">
              {{ texts[lang].offersPage.grid.emptyTitle }}
            </h3>
            <p class="text-(--text-muted) mt-2">{{ texts[lang].offersPage.grid.emptyText }}</p>
          </div>

          <!-- Offers -->
          <div
            v-else
            class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 justify-items-center"
          >
            <div
              v-for="offer in offers"
              :key="offer.id"
              class="relative bg-(--surface) rounded-2xl w-full max-w-xs sm:max-w-none shadow-md hover:shadow-xl transition transform hover:scale-105"
            >
              <div class="absolute top-0 left-0 rtl:left-auto rtl:right-0">
                <img src="../images/offerdisc.png" class="w-15" alt="" />
              </div>

              <img
                :src="offer.image"
                alt="offer image"
                class="w-full rounded-t-2xl h-70 object-cover"
              />

              <div class="card-body mt-2 items-center text-center p-3">
                <h2 class="text-(--accent) font-bold text-xl">
                  {{ offer.title }}
                  <span v-if="!String(offer.title || '').toLowerCase().includes('off')">
                    {{ texts[lang].offersPage.grid.suffix }}
                  </span>
                </h2>

                <p class="text-(--text-muted) text-sm">{{ offer.description }}</p>

                <!-- Offer Status -->
                <p v-if="claimedOfferIds.has(offer.id)" class="text-green-600 mt-2 font-semibold">
                  {{ texts[lang].offersPage.grid.messageClaimed }}
                </p>
                <p
                  v-else-if="isExpired(offer) || !offer.active"
                  class="text-red-500 mt-2 font-semibold"
                >
                  {{ texts[lang].offersPage.grid.messageExpired }}
                </p>

                <!-- Button -->
                <div class="mt-4">
                  <button
                    @click="claimOffer(offer)"
                    :disabled="
                      isClaiming === offer.id ||
                      claimedOfferIds.has(offer.id) ||
                      isExpired(offer) ||
                      !offer.active
                    "
                    class="text-white font-semibold py-2 transition rounded-[10px] px-3 text-lg"
                    :class="[
                      claimedOfferIds.has(offer.id) ? 'bg-green-600 cursor-default' : '',
                      isExpired(offer) || !offer.active
                        ? 'bg-gray-500 text-white cursor-not-allowed'
                        : '',
                      !claimedOfferIds.has(offer.id) && !isExpired(offer) && offer.active
                        ? 'bg-accent-color hover:bg-(--accent)'
                        : '',
                      isClaiming === offer.id ? 'opacity-50 cursor-not-allowed' : '',
                    ]"
                  >
                    {{
                      isClaiming === offer.id
                        ? texts[lang].offersPage.grid.buttonClaiming
                        : claimedOfferIds.has(offer.id)
                        ? texts[lang].offersPage.grid.buttonClaimed
                        : isExpired(offer) || !offer.active
                        ? "Not Available"
                        : texts[lang].offersPage.grid.buttonClaim
                    }}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import { useTestLang } from "@/langTest/useTestLang";
import { db } from "@/firebase/firebase";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, getDocs, doc, setDoc } from "firebase/firestore";

const { lang, texts } = useTestLang();
const offers = ref([]);
const isLoading = ref(true);
const userId = ref(null);
const claimedOfferIds = ref(new Set());
const isClaiming = ref(null);

// --- Composables ---
const router = useRouter();
const auth = getAuth();

/** Fetch all offers from Firestore */
const fetchOffers = async () => {
  try {
    const snapshot = await getDocs(collection(db, "offers"));
    offers.value = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
  } catch (err) {
    console.error(err);
  } finally {
    isLoading.value = false;
  }
};

/** Fetch claimed offers for current user */
const fetchClaimedOffers = async (uid) => {
  if (!uid) {
    claimedOfferIds.value = new Set();
    return;
  }
  try {
    const snapshot = await getDocs(collection(db, "clients", uid, "claimedOffers"));
    const ids = new Set();
    snapshot.forEach((doc) => ids.add(doc.id));
    claimedOfferIds.value = ids;
  } catch (err) {
    console.error(err);
  }
};

/** Check if offer expired */
const isExpired = (offer) => {
  return offer.expiresAt && new Date(offer.expiresAt) < new Date();
};

/** Claim an offer */
const claimOffer = async (offer) => {
  const user = auth.currentUser;
  if (!user) return router.push("/login");

  // // If expired
  // if (isExpired(offer)) {
  //   notify(texts[lang].offersPage.grid.messageExpired);
  //   return;
  // }

  // // If not active
  // if (!offer.active) {
  //   notify(texts[lang].offersPage.grid.messageNotActive || "This offer is not active.");
  //   return;
  // }

  // // If already claimed
  // if (claimedOfferIds.value.has(offer.id)) {
  //   notify(texts[lang].offersPage.grid.messageClaimed);
  //   return;
  // }

  isClaiming.value = offer.id;

  try {
    let value = offer.discountValue;
    if (offer.discountType === "percentage") {
      value = Math.min(Math.max(Number(value), 0), 100);
    }

    await setDoc(doc(db, "clients", user.uid, "claimedOffers", offer.id), {
      ...offer,
      discountValue: value,
      used: false,
      claimedAt: new Date(),
    });

    claimedOfferIds.value.add(offer.id);
  } catch (err) {
    console.error(err);
  } finally {
    isClaiming.value = null;
  }
};

onMounted(() => {
  fetchOffers();

  onAuthStateChanged(auth, (user) => {
    if (user) {
      userId.value = user.uid;
      fetchClaimedOffers(user.uid);
    } else {
      userId.value = null;
      claimedOfferIds.value = new Set();
    }
  });
});
</script>

<style scoped>
</style>
