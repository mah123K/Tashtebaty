<template>
  <div v-if="isLoading" class="text-center text-gray-500 dark:text-white mt-20">
    <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-[#133B5D] mx-auto mb-3"></div>
    Loading Company Profile...
  </div>

  <section v-else class="space-y-6">
    <div class="flex justify-end" v-if="!isEditing">
      <button
        @click="isEditing = true"
        class="bg-[#133B5D] text-white font-semibold py-2 px-6 rounded-lg hover:bg-[#1b5383] transition duration-300 flex items-center justify-center gap-2 shadow-md"
      >
        <i class="fa-solid fa-pen-to-square"></i> Edit Profile
      </button>
    </div>

    <div class="bg-white dark:bg-[#16222B] p-6 rounded-2xl shadow-md border border-gray-200">
      <h3 class="text-2xl font-semibold text-[#133B5D] dark:text-white mb-5">Company Information</h3>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-5">
        <!-- Logo -->
        <div class="md:col-span-2 flex flex-col items-center gap-3 mb-4">
          <div class="relative group">
            <img
              :src="tempCompany.logoImage || '/images/Ellipse 56.png'"
              class="w-40 h-40 rounded-full object-cover border-4 border-[#133B5D] shadow-lg"
              :class="{ 'group-hover:opacity-70 cursor-pointer': isEditing }"
              @click="isEditing && triggerImageUpload"
            />
            <div
              v-if="isEditing"
              class="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 cursor-pointer"
              @click="triggerImageUpload"
            >
              <i class="fa-solid fa-camera text-white text-3xl"></i>
            </div>
            <input ref="imageInput" type="file" class="hidden" accept="image/*" @change="handleImageUpload" />
          </div>
        </div>

        <div>
          <label class="block text-gray-700 dark:text-white font-medium mb-1">
            <i class="fa-solid fa-building mr-2 text-[#133B5D] dark:text-white"></i> Company Name
          </label>
          <input
            v-model="tempCompany.companyName"
            type="text"
            :disabled="!isEditing"
            placeholder="Enter company name"
            class="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#133B5D] focus:outline-none dark:bg-[#16222B] dark:text-gray-100 placeholder-gray-600 dark:placeholder-gray-400"
          />
        </div>

        <div>
          <label class="block text-gray-700 dark:text-white font-medium mb-1">
            <i class="fa-solid fa-envelope mr-2 text-[#133B5D] dark:text-white"></i> Email
          </label>
          <input v-model="tempCompany.email" type="email" disabled class="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#133B5D] focus:outline-none dark:bg-[#16222B] dark:text-gray-100 placeholder-gray-600 dark:placeholder-gray-400 text-gray-500" />
        </div>

        <div>
          <label class="block text-gray-700 dark:text-white font-medium mb-1">
            <i class="fa-solid fa-phone mr-2 text-[#133B5D] dark:text-white"></i> Phone
          </label>
          <input
            v-model="tempCompany.phone"
            type="text"
            :disabled="!isEditing"
            placeholder="Phone number"
            class="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#133B5D] focus:outline-none dark:bg-[#16222B] dark:text-gray-100 placeholder-gray-600 dark:placeholder-gray-400"
          />
        </div>

        <div>
          <label class="block text-gray-700 dark:text-white font-medium mb-1">
            <i class="fa-solid fa-globe mr-2 text-[#133B5D] dark:text-white"></i> Website
          </label>
          <input
            v-model="tempCompany.website"
            type="text"
            :disabled="!isEditing"
            placeholder="https://example.com"
            class="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#133B5D] focus:outline-none dark:bg-[#16222B] dark:text-gray-100 placeholder-gray-600 dark:placeholder-gray-400"
          />
        </div>

        <div>
          <label class="block text-gray-700 dark:text-white font-medium mb-1">
            <i class="fa-solid fa-users mr-2 text-[#133B5D] dark:text-white"></i> Team Size
          </label>
          <input
            v-model="tempCompany.teamSize"
            type="text"
            :disabled="!isEditing"
            placeholder="e.g. 20 employees"
            class="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#133B5D] focus:outline-none dark:bg-[#16222B] dark:text-gray-100 placeholder-gray-600 dark:placeholder-gray-400"
          />
        </div>

        <div class="md:col-span-2">
          <label class="block text-gray-700 dark:text-white font-medium mb-1">
            <i class="fa-solid fa-book-open mr-2 text-[#133B5D] dark:text-white"></i> Description
          </label>
          <textarea
            v-model="tempCompany.description"
            rows="4"
            :disabled="!isEditing"
            placeholder="Write a short description about your company..."
            class="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#133B5D] focus:outline-none dark:bg-[#16222B] dark:text-gray-100 placeholder-gray-600 dark:placeholder-gray-400"
          ></textarea>
        </div>
      </div>
    </div>

    <!-- Address + Map -->
    <div class="bg-white dark:bg-[#16222B] p-6 rounded-2xl shadow-md border border-gray-200 flex flex-col md:flex-row gap-6">
      <div class="flex-1 space-y-4">
        <h3 class="text-xl font-semibold text-[#133B5D] dark:text-white">Address</h3>
        <div>
          <label class="block text-gray-700 dark:text-white font-medium mb-1">Address</label>
          <input
            v-model="tempCompany.address"
            type="text"
            :disabled="!isEditing"
            placeholder="Company address"
            class="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#133B5D] focus:outline-none dark:bg-[#16222B] dark:text-gray-100 placeholder-gray-600 dark:placeholder-gray-400"
          />
        </div>
        <div>
          <label class="block text-gray-700 dark:text-white font-medium mb-1">City</label>
          <input
            v-model="tempCompany.city"
            type="text"
            :disabled="!isEditing"
            placeholder="City"
            class="w-full p-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-[#133B5D] focus:outline-none dark:bg-[#16222B] dark:text-gray-100 placeholder-gray-600 dark:placeholder-gray-400"
          />
        </div>
      </div>
      <div class="flex-1 h-64 w-full rounded-2xl overflow-hidden border border-gray-300 shadow-inner">
        <iframe :src="mapSrc" width="100%" height="100%" style="border: 0" allowfullscreen="" loading="lazy"></iframe>
      </div>
    </div>

    <!-- CRN image -->
    <div class="bg-white dark:bg-[#16222B] p-6 rounded-2xl shadow-md border border-gray-200">
      <h3 class="text-xl font-semibold text-[#133B5D] dark:text-white mb-4">Commercial Registration (CRN)</h3>
      <div class="flex justify-center">
        <img
          :src="tempCompany.crnImage || '/images/placeholder.png'"
          class="w-72 h-auto rounded-lg shadow-md border border-gray-300 object-contain"
        />
      </div>
    </div>

    <!-- Save / Cancel buttons -->
    <div v-if="isEditing" class="flex justify-center gap-4 mt-6">
      <button
        @click="saveChanges"
        :disabled="isSaving"
        class="cursor-pointer bg-green-600 text-white font-semibold py-3 px-6 rounded-lg hover:bg-green-700 transition duration-300 shadow-lg disabled:opacity-50 flex items-center gap-2"
      >
        <svg
          v-if="isSaving"
          class="animate-spin h-5 w-5 text-white"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          ></path>
        </svg>
        {{ isSaving ? "Saving..." : "Save Changes" }}
      </button>

      <button
        @click="cancelEdit"
        class="bg-red-500 cursor-pointer text-white font-semibold py-3 px-6 rounded-lg hover:bg-red-600 transition duration-300 shadow-lg"
      >
        <i class="fa-solid fa-xmark"></i> Cancel
      </button>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from "vue";
import { auth, db } from "@/firebase/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { uploadImageOnly } from "@/composables/useImageUpload";

const emit = defineEmits(["showNotification"]);

const isEditing = ref(false);
const isLoading = ref(true);
const isSaving = ref(false);

const companyId = ref(null);
const imageInput = ref(null);
const newImageFile = ref(null);

const defaultCompany = () => ({
  companyName: "",
  email: "",
  phone: "",
  address: "",
  city: "",
  website: "",
  teamSize: "",
  description: "",
  logoImage: "",
  crnImage: "",
});

const originalCompany = ref(defaultCompany());
const tempCompany = ref(defaultCompany());

let unsubscribe = null;

onMounted(() => {
  unsubscribe = onAuthStateChanged(auth, async (user) => {
    if (user) {
      companyId.value = user.uid;
      await loadProfile();
    } else {
      isLoading.value = false;
    }
  });
});

onUnmounted(() => unsubscribe && unsubscribe());

const loadProfile = async () => {
  if (!companyId.value) return;
  isLoading.value = true;
  try {
    const docRef = doc(db, "companies", companyId.value);
    const docSnap = await getDoc(docRef);
    if (docSnap.exists()) {
      const data = docSnap.data();
      originalCompany.value = JSON.parse(JSON.stringify(data));
      tempCompany.value = JSON.parse(JSON.stringify(data));
    } else {
      emit("showNotification", "Could not load company profile.", "error");
    }
  } catch (err) {
    console.error("Error loading company profile:", err);
    emit("showNotification", "Error loading company profile.", "error");
  }
  isLoading.value = false;
};

const saveChanges = async () => {
  if (!companyId.value) return;
  isSaving.value = true;
  try {
    if (newImageFile.value) {
      const url = await uploadImageOnly(newImageFile.value);
      tempCompany.value.logoImage = url;
    }

    const docRef = doc(db, "companies", companyId.value);
    await updateDoc(docRef, {
      companyName: tempCompany.value.companyName,
      phone: tempCompany.value.phone,
      address: tempCompany.value.address,
      city: tempCompany.value.city,
      website: tempCompany.value.website,
      teamSize: tempCompany.value.teamSize,
      description: tempCompany.value.description,
      logoImage: tempCompany.value.logoImage,
    });

    window.dispatchEvent(
      new CustomEvent("profile-updated", {
        detail: { image: tempCompany.value.logoImage },
      })
    );

    originalCompany.value = JSON.parse(JSON.stringify(tempCompany.value));
    emit("showNotification", "Profile saved successfully!", "success");
    isEditing.value = false;
    newImageFile.value = null;
  } catch (err) {
    console.error("Error saving company profile:", err);
    emit("showNotification", "Failed to save profile.", "error");
  }
  isSaving.value = false;
};

const cancelEdit = () => {
  tempCompany.value = JSON.parse(JSON.stringify(originalCompany.value));
  newImageFile.value = null;
  isEditing.value = false;
};

const triggerImageUpload = () => imageInput.value.click();

const handleImageUpload = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  newImageFile.value = file;
  const reader = new FileReader();
  reader.onload = (ev) => {
    tempCompany.value.logoImage = ev.target.result;
  };
  reader.readAsDataURL(file);
};

const mapSrc = computed(() => {
  const addr = tempCompany.value.address || "";
  const city = tempCompany.value.city || "";
  const query = addr || city ? `${addr}, ${city}` : "Cairo, Egypt";
  return `https://maps.google.com/maps?q=${encodeURIComponent(query)}&hl=en&z=14&output=embed`;
});
</script>

<style scoped>

</style>
