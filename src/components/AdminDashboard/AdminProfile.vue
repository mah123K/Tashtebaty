<template>
  <div class="min-h-screen bg-gray-50 dark:bg-[#0f172a] p-6">
    <div class="max-w-2xl mx-auto bg-white dark:bg-[#1f2937] shadow-md rounded-2xl p-6">
      <div class="flex items-center justify-between mb-4">
        <h2 class="text-2xl font-semibold text-[#5984C6] dark:text-[#8db4ff]">{{ texts.adminDashboard?.adminProfile?.title || 'Admin Profile' }}</h2>
        
        <!-- Language Switch -->
        <!-- <button
          ref="langButton"
          @click="toggleLanguage"
          class="group relative h-9 w-9 rounded-full border border-gray-200 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-800 hover:border-[#5984C6] dark:hover:border-[#5984C6] transition-colors duration-200 language-switch-button"
          :title="texts[lang]?.adminDashboard?.sidebar?.switchToEnglish || 'Switch language'"
        >
          <i
            ref="langIcon"
            class="fa-solid fa-language absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-gray-600 transition-all duration-500 dark:text-gray-100 group-hover:text-[#5984C6] dark:group-hover:text-white"
          ></i>
          <span class="sr-only">Toggle language</span>
        </button> -->
      </div>
      
      <!-- Loading -->
      <div v-if="loading" class="text-center py-8 text-gray-600 dark:text-gray-300">{{ texts.adminDashboard?.adminProfile?.loading || 'Loading...' }}</div>
      
      <!-- Content -->
      <div v-else>
        <!-- Profile Picture Section -->
        <div class="flex flex-col items-center mb-6 relative">
          <div
            @click="triggerFileInput"
            class="w-24 h-24 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-100 dark:bg-gray-700 overflow-hidden cursor-pointer hover:opacity-80 transition relative"
          >
            <img
              v-if="photoURL && photoURL !== 'null' && !photoURL.startsWith('undefined')"
              :src="photoURL"
              alt="Profile"
              class="w-full h-full object-cover"
              @error="handleImageError"
            />
            <i v-else class="fa-solid fa-user text-4xl text-gray-500"></i>
          </div>
          
          <!-- Delete Image Button -->
          <button
            v-if="photoURL && photoURL !== 'null' && !photoURL.startsWith('undefined')"
            @click="deleteProfileImage"
            class="absolute top-20 right-1/2 transform translate-x-12 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center hover:bg-red-600 transition-colors shadow-sm"
            :title="texts.adminDashboard?.adminProfile?.removeProfilePicture || 'Remove profile picture'"
          >
            <i class="fa-solid fa-xmark text-[10px]"></i>
          </button>
        </div>

        <!-- Upload Instructions -->
        <p class="text-sm text-gray-500 dark:text-gray-300 mt-2 text-center">
          {{ photoURL ? (texts.adminDashboard?.adminProfile?.clickToChange || 'Click to change profile picture') : (texts.adminDashboard?.adminProfile?.clickToAdd || 'Click to add profile picture') }}
        </p>
   
        <!-- Hidden Input for image -->
        <input
          ref="fileInput"
          type="file"
          accept="image/*"
          @change="onFileChange"
          class="hidden"
        />

        <!-- Profile Info -->
        <div class="space-y-4">
          <div>
            <label class="block text-gray-700 dark:text-gray-200 mb-1">{{ texts.adminDashboard?.adminProfile?.name || 'Name' }}</label>
            <input
              v-model="name"
              type="text"
              class="w-full border dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 focus:ring-2 focus:ring-[#5984C6]"
            />
          </div>

          <div>
            <label class="block text-gray-700 dark:text-gray-200 mb-1">{{ texts.adminDashboard?.adminProfile?.email || 'Email' }}</label>
            <input
              v-model="email"
              type="email"
              disabled
              class="w-full border dark:border-gray-600 rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 cursor-not-allowed"
            />
          </div>

          <button
            @click="updateProfile"
            :disabled="saving"
            class="w-full bg-[#5984C6] text-white py-2 rounded-lg hover:bg-[#4a6ea8] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {{ saving ? (texts.adminDashboard?.adminProfile?.saving || 'Saving...') : (texts.adminDashboard?.adminProfile?.saveChanges || 'Save Changes') }}
          </button>
        </div>

        <div class="mt-3">
          <p v-if="successMessage" class="text-green-600 text-sm">{{ successMessage }}</p>
          <p v-if="errorMessage" class="text-red-600 text-sm">{{ errorMessage }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, onMounted } from "vue";
import { auth, db } from "../../firebase/firebase";
import { getDoc, doc, setDoc } from "firebase/firestore";
import { updateProfile, reload } from "firebase/auth";
import { useTestLang } from "@/langTest/useTestLang";
import { uploadImageOnly } from "../../composables/useImageUpload";

export default {
  name: "AdminProfile",
  setup() {
    const { lang, texts: allTexts, switchLang } = useTestLang();
    const texts = computed(() => allTexts[lang.value] || {});
    const langButton = ref(null);
    const langIcon = ref(null);
    const isLanguageSwitching = ref(false);

    const name = ref("");
    const email = ref("");
    const photoURL = ref("");
    const fileInput = ref(null);
    const successMessage = ref("");
    const errorMessage = ref("");

    const loading = ref(true);
    const saving = ref(false);


    const toggleLanguage = () => {
      isLanguageSwitching.value = true;

      const next = lang.value === "ar" ? "en" : "ar";
      const isClockwise = next === "ar"; // Clockwise for English to Arabic

      // Add rotation class to icon
      if (langIcon.value) {
        langIcon.value.classList.add(
          isClockwise ? "rotate-animate-clockwise" : "rotate-animate-counterclockwise"
        );
      }

      switchLang(next);

      document.documentElement.lang = next;
      document.documentElement.dir = next === "ar" ? "rtl" : "ltr";

      localStorage.setItem("lang", next);

      // Remove rotation class after animation
      setTimeout(() => {
        isLanguageSwitching.value = false;
        if (langIcon.value) {
          langIcon.value.classList.remove(
            "rotate-animate-clockwise",
            "rotate-animate-counterclockwise"
          );
        }
      }, 600);
    };

    // Load profile data
    const loadProfile = async () => {
      try {
        const user = auth.currentUser;
        if (user) {
          email.value = user.email || "";
          name.value = user.displayName || "";
          photoURL.value = user.photoURL || "";

          // Also check Firestore for additional data
          const adminDoc = await getDoc(doc(db, 'admin', user.uid));
          if (adminDoc.exists()) {
            const data = adminDoc.data();
            if (data.name) name.value = data.name;
            if (data.photoURL) photoURL.value = data.photoURL;
          }
        }
      } catch (error) {
        console.error("Error loading profile:", error);
        errorMessage.value = "Failed to load profile data.";
      } finally {
        loading.value = false;
      }
    };

    // Trigger file input
    const triggerFileInput = () => {
      if (fileInput.value) {
        fileInput.value.click();
      }
    };

    // Handle file change
    const onFileChange = async (event) => {
      const file = event.target.files[0];
      if (!file) return;

      // Validate file type
      if (!file.type.startsWith('image/')) {
        errorMessage.value = "Please select a valid image file.";
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        errorMessage.value = "Image size must be less than 5MB.";
        return;
      }

      try {
        errorMessage.value = "";
        successMessage.value = "Uploading image...";

        const imageUrl = await uploadImageOnly(file);
        photoURL.value = imageUrl;

        successMessage.value = "Image uploaded successfully!";
        setTimeout(() => successMessage.value = "", 3000);
      } catch (error) {
        console.error("Upload failed:", error);
        errorMessage.value = "Failed to upload image. Please try again.";
        successMessage.value = "";
      }
    };

    // Delete profile image
    const deleteProfileImage = async () => {
      try {
        photoURL.value = "";
        successMessage.value = "Profile image removed.";
        setTimeout(() => successMessage.value = "", 3000);
      } catch (error) {
        console.error("Error removing image:", error);
        errorMessage.value = "Failed to remove image.";
      }
    };

    // Handle image error
    const handleImageError = (event) => {
      photoURL.value = "";
      event.target.style.display = "none";
    };

    // Update profile
    const updateProfile = async () => {
      if (saving.value) return; // Prevent multiple calls

      if (!name.value.trim()) {
        errorMessage.value = "Name is required.";
        return;
      }

      saving.value = true;
      errorMessage.value = "";
      successMessage.value = "";

      try {
        const user = auth.currentUser;
        if (!user) throw new Error("No user logged in");

        // Update Firebase Auth
        await updateProfile(user, {
          displayName: name.value,
          photoURL: photoURL.value || null,
        });

        // Update Firestore
        await setDoc(doc(db, 'admin', user.uid), {
          name: name.value,
          photoURL: photoURL.value || null,
          updatedAt: new Date(),
        }, { merge: true });

        // Update localStorage
        localStorage.setItem('adminName', name.value);
        if (photoURL.value) {
          localStorage.setItem('adminPhoto', photoURL.value);
        } else {
          localStorage.removeItem('adminPhoto');
        }

        // Dispatch event to update sidebar
        window.dispatchEvent(new CustomEvent('adminProfileChanged', {
          detail: {
            name: name.value,
            photoURL: photoURL.value,
          }
        }));

        successMessage.value = "Profile updated successfully!";
        setTimeout(() => successMessage.value = "", 3000);
      } catch (error) {
        console.error("Update failed:", error);
        errorMessage.value = "Failed to update profile. Please try again.";
      } finally {
        saving.value = false;
      }
    };

    // Load profile on mount
    onMounted(() => {
      loadProfile();
    });

    return {
      lang,
      texts,
      langButton,
      langIcon,
      isLanguageSwitching,
      name,
      email,
      photoURL,
      fileInput,
      successMessage,
      errorMessage,
      loading,
      saving,

      toggleLanguage,
      triggerFileInput,
      onFileChange,
      deleteProfileImage,
      handleImageError,
      updateProfile,
    };
  }
};
</script>

<style scoped>
.rotate-animate-clockwise {
  animation: rotateClockwise 0.5s ease-in-out;
}

.rotate-animate-counterclockwise {
  animation: rotateCounterclockwise 0.5s ease-in-out;
}

@keyframes rotateClockwise {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(360deg); }
}

@keyframes rotateCounterclockwise {
  from { transform: translate(-50%, -50%) rotate(0deg); }
  to { transform: translate(-50%, -50%) rotate(-360deg); }
}

input[type="file"] {
  border: none;
}
</style>