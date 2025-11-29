<template>
  <div class="min-h-screen bg-linear-to-br bg-white dark:from-[#0f172a] dark:to-[#1a2332] text-gray-900 dark:text-gray-100 shadow-lg rounded-2xl p-6 sm:p-6 lg:p-8">

    <!-- Header Section -->
    <div class="mb-6 sm:mb-8">
      <h1 class="text-2xl sm:text-3xl lg:text-4xl font-bold text-[#5984C6] dark:text-[#7ba3d9] mb-1">
        {{ texts[lang].adminDashboard.offers.title }}
      </h1>
    </div>

    <!-- Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-8 md:gap-6 lg:gap-8">

      <!-- ADD / EDIT FORM -->
      <div class="md:col-span-1 min-h-[600px] flex flex-col">
        <div class="bg-white dark:bg-[#1f2937] rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex-1">
          <div class="bg-linear-to-r from-[#5984C6] to-[#7ba3d9] px-4 sm:px-6 py-4 sm:py-5">
            <h2 class="text-lg sm:text-xl font-bold text-white">
              {{ isEditing ? 'Edit Offer' : texts[lang].adminDashboard.offers.addNewOffer }}
            </h2>
            <p class="text-xs sm:text-sm text-blue-100 mt-1">{{ isEditing ? 'Modify existing offer' : 'Create new promotional offer' }}</p>
          </div>

          <form @submit.prevent="handleSubmit" class="p-4 sm:p-6 space-y-4">

            <!-- Discount Value (percentage only) -->
            <div>
              <label class="block font-medium mb-1">Discount Value:</label>
              <div class="flex gap-2">
                <input
                  v-model.number="form.discountValue"
                  type="number"
                  required
                  placeholder=""
                  class="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
                />
                <div class="shrink-0 flex items-center px-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-900">
                  <span>%</span>
                </div>
              </div>
            </div>

            <!-- Max Usage -->
            <div>
              <label class="block font-medium mb-1">valid to use for:</label>
              <input
                v-model.number="form.maxUsage"
                type="number"
                required
                min="1"
                class="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              />
            </div>

            <!-- Expiry Date -->
            <div>
              <label class="block font-medium mb-1">Expires At (optional)</label>
              <input
                v-model="form.expiresAt"
                type="date"
                class="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800"
              />
              <p class="text-xs text-gray-500 mt-1">If empty, offer will be considered 'no expiry' unless you toggle inactive.</p>
            </div>

            <!-- NOTE: Active checkbox removed (admin cannot directly toggle here) -->

            <!-- Targeting: only 4 categories dropdown -->
            <div>
              <label class="block font-medium mb-1">section</label>
              <select v-model="form.targetType" class="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800">
                <!-- only the four categories -->
                <option value="plumbing">Plumbing</option>
                <option value="carpentry">Carpentry</option>
                <option value="finishing">finishing</option>
                <option value="electrical">electrical</option>
              </select>

              <!-- Categories multi-select (kept but won't show since targetType no longer equals 'multiple-categories') -->
              <div v-if="form.targetType === 'multiple-categories'" class="mt-3">
                <p class="text-xs text-gray-500 mb-2">Choose one or more categories:</p>
                <div class="grid grid-cols-2 gap-2 max-h-40 overflow-auto p-2 border rounded-lg bg-white dark:bg-gray-900">
                  <label v-for="cat in categories" :key="cat.id || cat" class="inline-flex items-center gap-2 text-sm">
                    <input type="checkbox" :value="cat.id || cat" v-model="form.targetCategories" class="h-4 w-4" />
                    <span class="truncate">{{ cat.name || cat }}</span>
                  </label>
                </div>
                <p v-if="categories.length === 0" class="text-xs text-gray-400 mt-2">No categories found.</p>
              </div>
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
            <div v-if="imagePreview" class="pt-2">
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

            <!-- Validation error -->
            <div v-if="formError" class="text-sm text-red-600 font-medium">
              {{ formError }}
            </div>

            <!-- Submit -->
            <button
              type="submit"
              :disabled="isSaving"
              class="w-full bg-linear-to-r from-[#5984C6] to-[#7ba3d9] hover:shadow-lg text-white font-semibold py-3 sm:py-4 px-4 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2 transition-all duration-300"
            >
              <svg
                v-if="isSaving"
                class="animate-spin h-5 w-5 text-white"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291 A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>{{ isEditing ? 'Save Changes' : texts[lang].adminDashboard.offers.addOffer }}</span>
            </button>

            <!-- Cancel edit -->
            <button v-if="isEditing" type="button" @click="cancelEdit" class="w-full mt-2 border border-gray-300 dark:border-gray-700 rounded-lg py-2">
              Cancel Edit
            </button>

          </form>
        </div>
      </div>

      <!-- EXISTING OFFERS LIST -->
      <div class="md:col-span-1 min-h-[600px] flex flex-col">
        <div class="bg-white dark:bg-[#1f2937] rounded-2xl shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden flex-1 flex flex-col">
          <div class="bg-linear-to-r from-[#5984C6] to-[#7ba3d9] px-4 sm:px-6 py-4 sm:py-5">
            <h2 class="text-lg sm:text-xl font-bold text-white">
              {{ texts[lang].adminDashboard.offers.currentOffers }}
            </h2>
            <p class="text-xs sm:text-sm text-blue-100 mt-1">{{ offers.length }} active offers</p>
          </div>

          <div class="p-4 sm:p-6 flex-1" :class="offers.length > 3 ? 'max-h-[500px] overflow-y-auto' : ''">
            <div v-if="isLoading" class="text-center py-12">
              <div class="animate-spin rounded-full h-10 w-10 border-4 border-[#5984C6] border-t-[#7ba3d9] mx-auto mb-4"></div>
              <p class="text-gray-600 dark:text-gray-400 text-sm">{{ texts[lang].adminDashboard.offers.loading }}</p>
            </div>

            <div v-else-if="offers.length === 0" class="text-center py-12">
              <div class="text-4xl mb-3">📦</div>
              <p class="text-gray-600 dark:text-gray-400 font-medium">{{ texts[lang].adminDashboard.offers.noOffers }}</p>
              <p class="text-gray-500 dark:text-gray-500 text-sm mt-1">Create your first offer to get started</p>
            </div>

            <div v-else class="space-y-4">
              <div v-for="offer in offers" :key="offer.id" class="bg-gray-50 dark:bg-gray-800 rounded-xl overflow-hidden border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow flex flex-row items-center gap-3 p-3 sm:gap-4 sm:p-4">
                <div class="relative w-24 h-24 sm:w-32 sm:h-32 shrink-0 overflow-hidden bg-gray-200 dark:bg-gray-900 rounded-lg">
                  <img :src="offer.image" class="w-full h-full object-cover hover:scale-105 transition-transform duration-300" />
                </div>

                <div class="flex flex-col grow min-w-0">
                  <h3 class="text-sm sm:text-base font-bold text-gray-900 dark:text-white truncate">{{ offer.title }}</h3>
                  <p class="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{{ offer.description }}</p>

                  <div class="flex gap-2 items-center text-xs text-gray-500 mt-2">
                    <span>{{ offer.discountType === 'percentage' ? (offer.discountValue + '%') : (offer.discountValue + ' EGP') }}</span>
                    <span>•</span>
                    <span v-if="offer.expiresAt">Expires: {{ formatDate(offer.expiresAt) }}</span>
                    <span v-else>No expiry</span>
                    <span>•</span>
                    <span :class="offer.active ? 'text-green-600' : 'text-red-500'">{{ offer.active ? 'Active' : 'Inactive' }}</span>
                  </div>

                  <div class="flex gap-2 items-center text-xs text-gray-400 mt-1">
                    <span>Target:</span>
                    <span class="font-medium text-gray-700 dark:text-gray-200">{{ describeTarget(offer) }}</span>
                  </div>
                </div>

                <div class="flex flex-col gap-2">
                  <button @click="initEdit(offer)" class="shrink-0 bg-yellow-500 hover:bg-yellow-600 text-white font-semibold py-2 px-2 sm:px-3 rounded-lg transition-colors flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10" title="Edit">
                    <i class="fa-solid fa-pen-to-square text-sm"></i>
                  </button>

                  <!-- Toggle Active/Inactive button -->
                  <button
                    @click="confirmToggle(offer)"
                    :class="[
                      'shrink-0 text-white font-semibold py-2 px-2 sm:px-3 rounded-lg transition-colors flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10',
                      offer.active ? 'bg-gray-500 hover:bg-gray-600' : 'bg-green-600 hover:bg-green-700'
                    ]"
                    :title="offer.active ? 'Deactivate' : 'Activate'"
                  >
                    <i :class="offer.active ? 'fa-solid fa-ban text-sm' : 'fa-solid fa-toggle-on text-sm'"></i>
                  </button>

                  <!-- Updated: Trash now performs permanent delete -->
                  <button @click="confirmPermanentDelete(offer)" class="shrink-0 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-2 sm:px-3 rounded-lg transition-colors flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10" :title="texts[lang].adminDashboard.offers.delete">
                    <i class="fa-solid fa-trash-can text-sm"></i>
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>

    </div>

    <!-- Toggle Active/Deactivate Modal -->
    <Teleport to="body">
      <transition name="modal">
        <div v-if="showDeleteModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" @click.self="closeDeleteModal">
          <div class="bg-white dark:bg-[#111827] dark:text-gray-100 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <h3 class="text-xl font-semibold text-red-600 mb-4" v-if="offerToDelete?.active">Deactivate Offer</h3>
            <h3 class="text-xl font-semibold text-green-600 mb-4" v-else>Activate Offer</h3>

            <p class="text-gray-600 dark:text-gray-300 mb-6" v-if="offerToDelete?.active">
              Are you sure you want to deactivate the offer "<strong>{{ offerToDelete?.title }}</strong>"?<br/>
              <span class="text-sm text-gray-500">This action will mark the offer as inactive and can be re-activated later.</span>
            </p>

            <p class="text-gray-600 dark:text-gray-300 mb-6" v-else>
              Are you sure you want to activate the offer "<strong>{{ offerToDelete?.title }}</strong>"?<br/>
              <span class="text-sm text-gray-500">This action will mark the offer as active and make it available to users.</span>
            </p>

            <div class="flex justify-center gap-4">
              <button @click="performToggle" :class="['px-6 py-2 font-semibold rounded-lg transition', offerToDelete?.active ? 'bg-red-600 hover:bg-red-700 text-white' : 'bg-green-600 hover:bg-green-700 text-white']">
                {{ offerToDelete?.active ? 'Deactivate' : 'Activate' }}
              </button>
              <button @click="closeDeleteModal" class="px-6 py-2 bg-gray-200 dark:bg-gray-700 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold rounded-lg transition">Cancel</button>
            </div>
          </div>
        </div>
      </transition>
    </Teleport>

    <!-- Permanent Delete Modal -->
    <Teleport to="body">
      <transition name="modal">
        <div v-if="showPermanentDeleteModal" class="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50" @click.self="closePermanentDeleteModal">
          <div class="bg-white dark:bg-[#111827] dark:text-gray-100 rounded-2xl shadow-2xl w-full max-w-sm p-6 text-center">
            <h3 class="text-xl font-semibold text-red-600 mb-4">Delete Offer Permanently</h3>
            <p class="text-gray-600 dark:text-gray-300 mb-6">
              Are you sure you want to <strong>permanently delete</strong> the offer "<strong>{{ offerToPermanentDelete?.title }}</strong>"?<br/>
              <span class="text-sm text-gray-500">This action cannot be undone — the offer will be removed from the database.</span>
            </p>

            <div class="flex justify-center gap-4">
              <button @click="performPermanentDelete" class="px-6 py-2 bg-red-700 hover:bg-red-800 text-white font-semibold rounded-lg transition">Delete Permanently</button>
              <button @click="closePermanentDeleteModal" class="px-6 py-2 bg-gray-200 dark:bg-gray-700 dark:text-gray-100 hover:bg-gray-300 dark:hover:bg-gray-600 font-semibold rounded-lg transition">Cancel</button>
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
import { collection, getDocs, addDoc, updateDoc, doc, orderBy, query, deleteDoc, deleteField } from "firebase/firestore";
import { uploadImageOnly } from "@/composables/useImageUpload";
import { useTestLang } from "@/langTest/useTestLang";

const { lang, texts } = useTestLang();

/* State */
const offers = ref([]);
const isLoading = ref(true);
const isSaving = ref(false);
const formError = ref("");

const selectedFile = ref(null);
const imagePreview = ref(null);

const isEditing = ref(false);
const editId = ref(null);

/* Toggle Modal (used for activating/deactivating) */
const showDeleteModal = ref(false);
const offerToDelete = ref(null);

/* Permanent Delete Modal */
const showPermanentDeleteModal = ref(false);
const offerToPermanentDelete = ref(null);

/* Categories: try fetch from Firestore; fallback to static */
const categories = ref([]);
const fallbackCategories = [
  { id: "plumbing", name: "Plumbing" },
  { id: "electricity", name: "Electricity" },
  { id: "painting", name: "Painting" },
  { id: "ac", name: "AC" },
];

/* Form model */
const form = ref({
  // title & description will be generated automatically before save
  title: "",
  description: "",
  // discountType removed - always percentage
  discountValue: null,
  maxUsage: 1,
  expiresAt: "", // yyyy-mm-dd (string)
  active: true,
  image: "",
  // targeting (now single category)
  targetType: "plumbing", // default to plumbing
  targetCategories: [], // kept for compatibility
});

/* Firestore refs */
const offersCollection = collection(db, "offers");
const categoriesCollection = collection(db, "services");

/* helpers: icons map and generator */
const sectionIcons = {
  plumbing: "🔧",
  carpentry: "🪚",
  finishing: "🎨",
  electrical: "⚡",
};

const generateTitleAndDescription = (category, discountValue) => {
  const sectionNameMap = {
    plumbing: "plumbing",
    carpentry: "carpentry",
    finishing: "finishing",
    electrical: "electrical",
  };
  const sec = sectionNameMap[category] || category || "service";
  const icon = sectionIcons[category] || "";
  const title = `${discountValue} %off on ${sec}`;
  const description = `${sec} ${icon}`.trim();
  return { title, description };
};

/* Helpers */
const resetForm = () => {
  form.value = {
    title: "",
    description: "",
    discountValue: null,
    maxUsage: 1,
    expiresAt: "",
    active: true,
    image: "",
    targetType: "plumbing",
    targetCategories: [],
  };
  selectedFile.value = null;
  imagePreview.value = null;
  formError.value = "";
  isEditing.value = false;
  editId.value = null;
};

const validateForm = () => {
  // basic presence
  // title & description no longer required as they are generated automatically

  // discount (percentage only now)
  if (!form.value.discountValue && form.value.discountValue !== 0) return "Discount value is required.";
  if (form.value.discountValue <= 0 || form.value.discountValue > 90) {
    return "Percentage must be between 1 and 90.";
  }

  if (!form.value.maxUsage || form.value.maxUsage < 1) return "Max usage per user must be at least 1.";

  // expiry (optional) but if present should be in future
  if (form.value.expiresAt) {
    const now = new Date();
    const expiry = new Date(form.value.expiresAt + "T23:59:59");
    if (expiry <= now) return "Expiry date must be in the future.";
  }

  // image required on create
  if (!isEditing.value && !selectedFile.value) return "Please upload an image for the offer.";

  return null;
};

/* Image handling */
const handleFileChange = (event) => {
  const file = event.target.files?.[0];
  if (!file) return;
  // quick checks: size < 5MB
  const maxSize = 5 * 1024 * 1024;
  if (file.size > maxSize) {
    formError.value = "Image too large. Max 5MB.";
    return;
  }
  selectedFile.value = file;
  imagePreview.value = URL.createObjectURL(file);
  formError.value = "";
};

const clearPreview = () => {
  selectedFile.value = null;
  imagePreview.value = null;
};

/* Date formatting helper */
const formatDate = (d) => {
  if (!d) return "";
  // d might be timestamp or string
  const date = typeof d === "string" ? new Date(d) : d.toDate ? d.toDate() : new Date(d);
  return date.toLocaleDateString();
};

/* Describe target */
const describeTarget = (offer) => {
  if (!offer) return "";
  switch (offer.targetType) {
    case "all":
      return "All";
    case "multiple-categories":
      if (!offer.targetCategories || offer.targetCategories.length === 0) return "Specific categories";
      // map ids to names
      return (offer.targetCategories || []).map(id => {
        const found = categories.value.find(c => (c.id || c) === id || (c.name && c.name === id));
        return found ? (found.name || found) : id;
      }).join(", ");
    case "technicians-only":
      return "Technicians only";
    case "companies-only":
      return "Companies only";
    case "both":
      return "Technicians + Companies";
    default:
      // if targetType is a single category id, try map to name
      const foundCat = categories.value.find(c => (c.id || c) === offer.targetType || (c.name && c.name === offer.targetType));
      if (foundCat) return foundCat.name || offer.targetType;
      // fallback: show the raw value
      return offer.targetType || "Custom";
  }
};

/* Fetch categories (try Firestore, else fallback) */
const fetchCategories = async () => {
  try {
    const q = query(categoriesCollection);
    const snap = await getDocs(q);
    if (!snap.empty) {
      categories.value = snap.docs.map(d => ({ id: d.id, ...(d.data() || {}) }));
      return;
    }
  } catch (err) {
    console.warn("Categories fetch failed, using fallback", err);
  }
  // fallback
  categories.value = fallbackCategories;
};

/* Fetch offers */
const fetchOffers = async () => {
  isLoading.value = true;
  try {
    const q = query(offersCollection, orderBy('createdAt', 'desc'));
    const snap = await getDocs(q);
    offers.value = snap.docs.map(d => ({ id: d.id, ...(d.data() || {}) }));
    // ensure arrays exist
    offers.value.forEach(o => {
      if (!o.targetCategories) o.targetCategories = [];
    });
  } catch (err) {
    console.error("Error fetching offers:", err);
  } finally {
    isLoading.value = false;
  }
};

/* Create or update */
const handleSubmit = async () => {
  formError.value = "";
  const err = validateForm();
  if (err) {
    formError.value = err;
    return;
  }

  isSaving.value = true;

  try {
    // upload image if new file selected
    if (selectedFile.value) {
      const url = await uploadImageOnly(selectedFile.value);
      form.value.image = url;
    }

    // generate title & description automatically from discountValue and targetType
    const { title, description } = generateTitleAndDescription(form.value.targetType, Number(form.value.discountValue));
    // ensure we store generated values
    form.value.title = title;
    form.value.description = description;

    // --- generate title & description automatically ---
const sectionKey = form.value.targetType || "plumbing";

// map id -> nice name
const sectionNames = {
  plumbing: "Plumbing",
  carpentry: "Carpentry",
  finishing: "Finishing",
  electrical: "Electrical",
};

// simple icon mapping
const sectionIcons = {
  plumbing: "🔧",
  carpentry: "🪚",
  finishing: "🎨",
  electrical: "💡",
};

const sectionName = sectionNames[sectionKey] || sectionKey;
const sectionIcon = sectionIcons[sectionKey] || "";

const discountNum = Number(form.value.discountValue) || 0;

const autoTitle = `${discountNum}%off on ${sectionName}`;
const autoDescription = `${sectionName} ${sectionIcon}`;

const payload = {
  title: autoTitle,
  description: autoDescription,
  discountType: 'percentage',
  discountValue: discountNum,
  maxUsage: Number(form.value.maxUsage || 1),
  expiresAt: form.value.expiresAt || null,
  active: !!form.value.active,
  image: form.value.image || "",
  createdAt: isEditing.value ? (new Date()) : new Date(),
  targetType: form.value.targetType,
  targetCategories: form.value.targetCategories || [],
};


    if (isEditing.value && editId.value) {
      // update
      await updateDoc(doc(db, "offers", editId.value), payload);
    } else {
      // add
      await addDoc(offersCollection, payload);
    }

    await fetchOffers();
    resetForm();
  } catch (err) {
    console.error("Save error:", err);
    formError.value = "Save failed. Check console.";
  } finally {
    isSaving.value = false;
  }
};

/* Edit flow */
const initEdit = (offer) => {
  isEditing.value = true;
  editId.value = offer.id;
  // populate form (clone)
  form.value = {
    title: offer.title || "",
    description: offer.description || "",
    discountValue: offer.discountValue || null,
    maxUsage: offer.maxUsage || 1,
    expiresAt: offer.expiresAt || "",
    active: !!offer.active,
    image: offer.image || "",
    targetType: offer.targetType || "plumbing",
    targetCategories: offer.targetCategories ? [...offer.targetCategories] : [],
  };

  // regenerate title/description from targetType & discountValue to keep automatic behavior
  const { title, description } = generateTitleAndDescription(form.value.targetType, Number(form.value.discountValue || 0));
  form.value.title = title;
  form.value.description = description;

  // preview current image
  imagePreview.value = offer.image || null;
  selectedFile.value = null;
  window.scrollTo({ top: 0, behavior: "smooth" });
};

const cancelEdit = () => {
  resetForm();
};

/* Toggle (activate/deactivate) flow */
const confirmToggle = (offer) => {
  offerToDelete.value = offer;
  showDeleteModal.value = true;
};

const closeDeleteModal = () => {
  showDeleteModal.value = false;
  offerToDelete.value = null;
};

const performToggle = async () => {
  if (!offerToDelete.value) return;
  try {
    const offerRef = doc(db, "offers", offerToDelete.value.id);
    if (offerToDelete.value.active) {
      // deactivate
      await updateDoc(offerRef, {
        active: false,
        deletedAt: new Date(),
      });
    } else {
      // activate: set active true and remove deletedAt
      await updateDoc(offerRef, {
        active: true,
        deletedAt: deleteField(),
      });
    }
    await fetchOffers();
  } catch (err) {
    console.error("Toggle active failed:", err);
  } finally {
    closeDeleteModal();
  }
};

/* Permanent delete flow */
const confirmPermanentDelete = (offer) => {
  offerToPermanentDelete.value = offer;
  showPermanentDeleteModal.value = true;
};

const closePermanentDeleteModal = () => {
  showPermanentDeleteModal.value = false;
  offerToPermanentDelete.value = null;
};

const performPermanentDelete = async () => {
  if (!offerToPermanentDelete.value) return;
  try {
    await deleteDoc(doc(db, "offers", offerToPermanentDelete.value.id));
    await fetchOffers();
  } catch (err) {
    console.error("Permanent delete failed:", err);
  } finally {
    closePermanentDeleteModal();
  }
};

/* Lifecycle */
onMounted(async () => {
  await fetchCategories();
  await fetchOffers();
});
</script>

<style scoped>
/* Retained your original styling approach; add any small tweaks here if needed */
</style>
