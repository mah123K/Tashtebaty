<template>
  <div class="min-h-screen bg-linear-to-br bg-white dark:from-[#0f172a] dark:to-[#1a2332] text-gray-900 dark:text-gray-100 shadow-lg rounded-2xl p-6 sm:p-6 lg:p-8">

    <!-- Header Section -->
    <div class="mb-6 sm:mb-8">
      <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#5984C6] dark:text-[#7ba3d9] mb-1">
        {{ texts[lang].adminDashboard.offers.title }}
      </h1>
    
    </div>

    <!-- Responsive Grid: 1 col mobile, split on tablet/desktop -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-8 md:gap-6 lg:gap-8">

      <!-- ADD NEW OFFER FORM -->
      <div class="md:col-span-1">
        <div class="sticky top-4 bg-white dark:bg-[#1f2937] rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <!-- Header -->
          <div class="bg-linear-to-r from-[#5984C6] to-[#7ba3d9] px-4 sm:px-6 py-4 sm:py-5">
            <h2 class="text-lg sm:text-xl font-bold text-white">
              {{ texts[lang].adminDashboard.offers.addNewOffer }}
            </h2>
            <p class="text-xs sm:text-sm text-blue-100 mt-1">Create new promotional offer</p>
          </div>

          <!-- Form Content -->
          <form @submit.prevent="addOffer" class="p-4 sm:p-6 space-y-4">

            <!-- Title Input -->
            <div>
              <label :class="['block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300', lang === 'ar' ? 'text-right' : 'text-left']">
                {{ texts[lang].adminDashboard.offers.titleLabel }}
              </label>
              <input
                v-model="newOffer.title"
                type="text"
                required
                placeholder="e.g., 20% OFF"
                :class="['w-full px-4 py-2 sm:py-3 rounded-lg border-2 border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 placeholder-gray-400 focus:outline-none focus:border-[#5984C6] focus:ring-2 focus:ring-[#5984C6]/20 transition', lang === 'ar' ? 'text-right' : 'text-left']"
              />
            </div>

            <!-- Description Input -->
            <div>
              <label :class="['block text-sm font-semibold mb-2 text-gray-700 dark:text-gray-300', lang === 'ar' ? 'text-right' : 'text-left']">
                {{ texts[lang].adminDashboard.offers.descriptionLabel }}
              </label>
              <input
                v-model="newOffer.description"
                type="text"
                required
                placeholder="e.g., On all plumbing services"
                class="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              />
            </div>
            <!-- Discount Type -->
            <div>
              <label class="block font-medium mb-1">Discount Type</label>
              <select
                v-model="newOffer.discountType"
                class="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              >
                <option value="percentage">Percentage (%)</option>
                <option value="fixed">Fixed Amount (EGP)</option>
              </select>
            </div>

            <!-- Discount Value -->
            <div>
              <label class="block font-medium mb-1">Discount Value</label>
              <input
                v-model="newOffer.discountValue"
                type="number"
                required
                placeholder="e.g., 20 or 150"
                class="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              />
            </div>

            <!-- Minimum Order -->
            <div>
              <label class="block font-medium mb-1">Minimum Order (optional)</label>
              <input
                v-model="newOffer.minOrder"
                type="number"
                class="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              />
            </div>

            <!-- Max Usage -->
            <div>
              <label class="block font-medium mb-1">Max Usage Per User</label>
              <input
                v-model="newOffer.maxUsage"
                type="number"
                required
                class="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              />
            </div>

            <!-- Expiry Date -->
            <div>
              <label class="block font-medium mb-1">Expires At</label>
              <input
                v-model="newOffer.expiresAt"
                type="date"
                required
                class="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              />
            </div>

            <!-- Image Upload -->
            <div>
              <label class="block font-medium mb-1">
                {{ texts[lang].adminDashboard.offers.uploadImage }}
              </label>
              <input
                type="file"
                accept="image/*"
                @change="handleFileChange"
                class="w-full px-4 py-2 text-sm rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 cursor-pointer hover:border-[#5984C6] hover:bg-blue-50 dark:hover:bg-gray-800/50 transition file:mr-3 file:px-3 file:py-1 file:rounded file:border-0 file:text-xs file:font-semibold file:bg-[#5984C6] file:text-white file:cursor-pointer"
              />
            </div>

            <!-- Image Preview -->
            <div v-if="selectedFile" class="pt-2">
              <div class="relative w-full h-32 sm:h-40 rounded-lg overflow-hidden border-2 border-[#5984C6]/30 bg-gray-100 dark:bg-gray-800">
                <img :src="imagePreview" class="w-full h-full object-cover" />
                <button
                  type="button"
                  @click="clearPreview"
                  class="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white rounded-full p-2 w-8 h-8 flex items-center justify-center transition shadow-lg"
                >
                  ✕
                </button>
              </div>
            </div>

            <!-- Submit Button -->
            <button
              type="submit"
              :disabled="isSaving || !selectedFile"
              class="w-full bg-linear-to-r from-[#5984C6] to-[#7ba3d9] hover:shadow-lg text-white font-semibold py-3 sm:py-4 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-300"
            >
              <svg
                v-if="isSaving"
                class="animate-spin h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  class="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  stroke-width="4"
                ></circle>
                <path
                  class="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291
                   A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3
                   7.938l3-2.647z"
                ></path>
              </svg>
              <span>
                {{
                  isSaving
                    ? texts[lang].adminDashboard.offers.saving
                    : texts[lang].adminDashboard.offers.addOffer
                }}
              </span>
            </button>
          </form>
        </div>
      </div>

      <!-- EXISTING OFFERS SECTION -->
      <div class="md:col-span-1">
        <div class="bg-white dark:bg-[#1f2937] rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <!-- Header -->
          <div class="bg-linear-to-r from-[#5984C6] to-[#7ba3d9] px-4 sm:px-6 py-4 sm:py-5">
            <h2 class="text-lg sm:text-xl font-bold text-white">
              {{ texts[lang].adminDashboard.offers.currentOffers }}
            </h2>
            <p class="text-xs sm:text-sm text-blue-100 mt-1">{{ offers.length }} active offers</p>
          </div>

          <!-- Content -->
          <div class="p-4 sm:p-6">
       
            <!-- Loading State -->
            <div v-if="isLoading" class="text-center py-12">
              <div class="animate-spin rounded-full h-10 w-10 border-4 border-[#5984C6] border-t-[#7ba3d9] mx-auto mb-4"></div>
              <p class="text-gray-600 dark:text-gray-400 text-sm">{{ texts[lang].adminDashboard.offers.loading }}</p>
            </div>

            <!-- Empty State -->
            <div v-else-if="offers.length === 0" class="text-center py-12">
              <div class="text-4xl mb-3">📦</div>
              <p class="text-gray-600 dark:text-gray-400 font-medium">{{ texts[lang].adminDashboard.offers.noOffers }}</p>
              <p class="text-gray-500 dark:text-gray-500 text-sm mt-1">Create your first offer to get started</p>
            </div>

            <!-- Offers Grid -->
            <div v-else class="space-y-4">
              <div
                v-for="offer in offers"
                :key="offer.id"
                class="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow flex flex-row items-center gap-3 p-3 sm:gap-4 sm:p-4"
              >
                <!-- Image Container -->
                <div class="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0 overflow-hidden bg-gray-200 dark:bg-gray-900 rounded-lg">
                  <img
                    :src="offer.image"
                    class="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                  />
                </div>

                <!-- Content -->
                <div class="flex flex-col grow min-w-0">
                  <h3 :class="['text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate', lang === 'ar' ? 'text-right' : 'text-left']">
                    {{ offer.title }}
                  </h3>
                  <p :class="['text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2', lang === 'ar' ? 'text-right' : 'text-left']">
                    {{ offer.description }}
                  </p>
                </div>

                <!-- Delete Button -->
                <button
                  @click="deleteOffer(offer.id, offer.title)"
                  class="shrink-0 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-2 sm:px-3 rounded-lg transition-colors flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10"
                  :title="texts[lang].adminDashboard.offers.delete"
                >
                  <i class="fa-solid fa-trash-can text-sm"></i>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>

    <!-- Delete Modal Overlay -->
    <Teleport to="body">
      <transition name="modal">
        <div
          v-if="showDeleteModal"
          class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
          @click.self="closeDeleteModal"
        >
          <!-- Delete Modal -->
          <div class="bg-white dark:bg-[#111827] dark:text-gray-100 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <h3 class="text-xl font-semibold text-red-600 mb-4">
              {{ texts[lang].adminDashboard.offers.deleteConfirm }}
            </h3>

            <p class="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to delete the offer "<strong>{{ offerToDelete?.title }}</strong>"?<br/>
              <span class="text-sm text-gray-500">This action cannot be undone.</span>
            </p>

            <div class="flex justify-center gap-4">
              <button
                @click="confirmDelete"
                class="px-6 py-2 bg-red-600 hover:bg-red-700 text-white font-semibold rounded-lg transition"
              >
                Delete
              </button>

              <button
                @click="closeDeleteModal"
                class="px-6 py-2 bg-gray-200 dark:bg-gray-700 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold rounded-lg transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { db } from "../../firebase/firebase";
import { collection, getDocs, addDoc, deleteDoc, doc } from "firebase/firestore";

import { uploadImageOnly } from "@/composables/useImageUpload";

// 🔥 اللغة الجديدة
import { useTestLang } from "@/langTest/useTestLang";
const { lang, texts } = useTestLang();

const offers = ref([]);
const isLoading = ref(true);
const isSaving = ref(false);
const selectedFile = ref(null);
const imagePreview = ref(null);
const showDeleteModal = ref(false);
const offerToDelete = ref(null);

const newOffer = ref({
  title: "",
  description: "",
  discountType: "percentage",
  discountValue: null,
  minOrder: 0,
  maxUsage: 1,
  expiresAt: "",
  active: true,
  image: "",
});

const offersCollection = collection(db, "offers");

const handleFileChange = (event) => {
  selectedFile.value = event.target.files[0];
};

const fetchOffers = async () => {
  isLoading.value = true;
  try {
    const querySnapshot = await getDocs(offersCollection);
    offers.value = querySnapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));
  } catch (error) {
    console.error("Error fetching offers:", error);
  } finally {
    isLoading.value = false;
  }
};

const addOffer = async () => {
  if (!newOffer.value.title || !newOffer.value.description || !selectedFile.value) {
    alert(texts[lang].adminDashboard.offers.fillAllFields);
    return;
  }

  isSaving.value = true;

  try {
    newOffer.value.image = await uploadImageOnly(selectedFile.value);

    await addDoc(offersCollection, {
      title: newOffer.value.title,
      description: newOffer.value.description,
      discountType: newOffer.value.discountType,
      discountValue: Number(newOffer.value.discountValue),
      minOrder: Number(newOffer.value.minOrder),
      maxUsage: Number(newOffer.value.maxUsage),
      expiresAt: newOffer.value.expiresAt,
      active: newOffer.value.active,
      image: newOffer.value.image,
      createdAt: new Date(),
    });

    newOffer.value = { title: "", description: "", image: "" };
    selectedFile.value = null;

    await fetchOffers();
  } catch (error) {
    console.error("Error adding offer:", error);
  } finally {
    isSaving.value = false;
  }
};

const deleteOffer = async (id) => {
  if (!confirm(texts[lang].adminDashboard.offers.deleteConfirm)) return;

  try {
    await deleteDoc(doc(db, "offers", id));
    await fetchOffers();
  } catch (error) {
    console.error("Error deleting offer:", error);
  }
};

onMounted(fetchOffers);
</script>

<style scoped>
/* نفس الـ CSS بدون تغيير */
</style>
