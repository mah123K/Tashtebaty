<template>
  <div class="p-8">
    <h2 class="text-2xl font-semibold text-[#133B5D] dark:text-white mb-6">My Work Gallery</h2>

    <!-- Upload Button Card -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <!-- Upload Box -->
      <div
        class="relative flex flex-col items-center justify-center border-2 border-dashed border-[#133B5D]/50 rounded-2xl p-6 bg-white dark:bg-[#16222B] shadow hover:shadow-lg cursor-pointer transition"
        @click="triggerUpload"
      >
        <i class="fa-solid fa-upload text-5xl text-[#133B5D] dark:text-white mb-3"></i>
        <p class="text-[#133B5D] dark:text-white font-semibold">Upload Photo</p>
        <input
          ref="fileInput"
          type="file"
          class="hidden"
          accept="image/*"
          multiple
          @change="handleUpload"
        />
        <p v-if="images.length >= 15" class="text-red-500 text-sm mt-2">
          (Maximum 15 images)
        </p>

        <!-- Upload overlay with spinner + progress -->
        <div
          v-if="uploading"
          class="absolute inset-0 bg-white/70 dark:bg-black/50 flex flex-col items-center justify-center rounded-2xl"
        >
          <i class="fa-solid fa-spinner animate-spin text-4xl text-[#133B5D] dark:text-white mb-3"></i>
          <div class="w-3/4">
            <div class="h-2 bg-[#e6e6e6] rounded">
              <div :style="{ width: uploadProgress + '%' }" class="h-2 rounded bg-[#133B5D] transition-all"></div>
            </div>
            <p class="text-sm text-[#133B5D] dark:text-white mt-2 text-center">{{ uploadProgress }}%</p>
          </div>
        </div>
      </div>

      <!-- Gallery Images -->
      <div
        v-for="(img, index) in images"
        :key="img.id || index"
        class="relative rounded-2xl overflow-hidden bg-white shadow-lg"
      >
        <img
          :src="img.url"
          alt="Work photo"
          class="w-full h-48 object-cover rounded-2xl"
        />
        <button
          @click="confirmDelete(img.id)"
          class="absolute top-2 right-2 bg-red-600 text-white rounded-full p-2 hover:bg-red-700 transition"
        >
          <i class="fa-solid fa-trash text-sm"></i>
        </button>
      </div>
    </div>

    <!-- Popup confirmation -->
    <AlertPopup
      :show="showPopup"
      :message="popupMessage"
      @close="handlePopupClose"
    />
  </div>
</template>

<script setup>
import { ref, onMounted } from "vue";
import { auth, db } from "@/firebase/firebase";
import {
  collection,
  getDocs,
  addDoc,
  deleteDoc,
  doc,
  serverTimestamp,
} from "firebase/firestore";
import { uploadImageOnly } from "@/composables/useImageUpload";
import AlertPopup from "../AlertPopup.vue";

const images = ref([]);
const technicianId = ref(null);
const showPopup = ref(false);
const popupMessage = ref("");
const deleteTarget = ref(null);
const fileInput = ref(null);

// NEW: uploading state + progress
const uploading = ref(false);
const uploadProgress = ref(0);

const triggerUpload = () => {
  if (images.value.length >= 15) {
    popupMessage.value = "You can only upload up to 15 images.";
    showPopup.value = true;
    return;
  }
  fileInput.value.click();
};

const handleUpload = async (e) => {
  const files = Array.from(e.target.files);
  if (!files.length) return;
  if (!technicianId.value) {
    popupMessage.value = "User not loaded. Please refresh or login again.";
    showPopup.value = true;
    return;
  }

  const remainingSlots = 15 - images.value.length;
  const uploadList = files.slice(0, remainingSlots);

  // Start upload UI
  uploading.value = true;
  uploadProgress.value = 0;

  let completed = 0;
  const total = uploadList.length;

  for (const file of uploadList) {
    try {
      const imageUrl = await uploadImageOnly(file);
      await addDoc(collection(db, "technicians", technicianId.value, "gallery"), {
        url: imageUrl,
        uploadedAt: serverTimestamp(),
      });
    } catch (err) {
      console.error("Upload error for file:", file.name, err);
      // you can choose to show an error per file but we keep existing behavior
    }
    completed++;
    uploadProgress.value = Math.round((completed / total) * 100);
  }

  uploading.value = false;

  popupMessage.value = "Image uploaded !";
  showPopup.value = true;
  await loadGallery();
};

const confirmDelete = (id) => {
  deleteTarget.value = id;
  popupMessage.value = "Are you sure you want to delete this image?";
  showPopup.value = true;
};

/**
 * Important behavior:
 * - AlertPopup currently emits no value (emit('close')).
 * - handlePopupClose accepts the emitted value (may be undefined).
 * - If deleteTarget is set and confirmed is true OR undefined, we treat that as confirmation.
 * - For other uses of the popup (notifications), we just close it.
 */
const handlePopupClose = async (confirmed) => {
  // If we have a pending delete operation
  if (deleteTarget.value) {
    // Treat 'true' OR undefined (popup emitted nothing) as confirmation
    const isConfirmed = confirmed === true || typeof confirmed === "undefined";

    if (isConfirmed) {
      if (!technicianId.value) {
        popupMessage.value = "Unable to delete: user not loaded.";
        showPopup.value = true;
        deleteTarget.value = null;
        return;
      }
      try {
        await deleteDoc(doc(db, "technicians", technicianId.value, "gallery", deleteTarget.value));
        deleteTarget.value = null;
        popupMessage.value = "Image has been deleted";
        // reload gallery
        await loadGallery();
        // keep popup visible for success message
        showPopup.value = true;
      } catch (err) {
        console.error("Delete gallery image error:", err);
        popupMessage.value = "Failed to delete image. Try again.";
        showPopup.value = true;
        deleteTarget.value = null;
      }
    } else {
      // user cancelled explicitly (if AlertPopup ever emits false)
      deleteTarget.value = null;
      showPopup.value = false;
    }
    return;
  }

  // No delete pending — just close notification popups
  showPopup.value = false;
};

const loadGallery = async () => {
  if (!technicianId.value) return;
  const col = collection(db, "technicians", technicianId.value, "gallery");
  const snap = await getDocs(col);
  images.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
};

onMounted(async () => {
  const user = auth.currentUser;
  if (user) {
    technicianId.value = user.uid;
    await loadGallery();
  }
});
</script>

<style scoped>
img {
  transition: transform 0.3s ease;
}
img:hover {
  transform: scale(1.05);
}
</style>
