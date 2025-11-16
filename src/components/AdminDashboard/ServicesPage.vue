<template>
  <div class="services-page p-4 sm:p-6 text-gray-900 dark:text-gray-100">

    <!-- Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 sm:mb-6 gap-4">
      <div>
        <h1 class="text-xl sm:text-2xl font-semibold text-gray-800 dark:text-gray-100">
          {{ texts[lang].adminDashboard.services.title }}
        </h1>
        <p class="text-gray-500 dark:text-gray-300 text-sm sm:text-base">
          {{ texts[lang].adminDashboard.services.subtitle }}
        </p>
      </div>

      <!-- Add Category Button -->
      <button
        @click="showModal = true"
        class="bg-[#5984C6] hover:bg-[#4968a0] text-white font-semibold px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg shadow-md transition-colors duration-200 flex items-center text-sm sm:text-base"
      >
        {{ texts[lang].adminDashboard.services.addCategory }}
        <i class="fas fa-plus ml-2"></i>
      </button>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="text-center py-8">
      <p class="text-gray-500">
        {{ texts[lang].adminDashboard.services.loadingservices }}
      </p>
    </div>

    <!-- Service Category Grid -->
    <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-6">
      <ServiceCategoryCard
        v-for="category in categories"
        :key="category.id"
        :category="category"
        @view-providers="handleViewProviders"
      />
    </div>

    <!-- Add Category Modal -->
    <div
      v-if="showModal"
      class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4"
    >
      <div class="bg-white dark:bg-[#1f2937] rounded-lg shadow-lg p-4 sm:p-6 w-full max-w-md mx-auto">
        <h2 class="text-lg sm:text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">
          {{ texts[lang].adminDashboard.services.addNewCategory }}
        </h2>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
            {{ texts[lang].adminDashboard.services.categoryName }}
          </label>
          <input
            v-model="newCategory.name"
            type="text"
            :placeholder="texts[lang].adminDashboard.services.categoryName"
            class="w-full border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-2 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div class="mb-4">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-2">
            {{ texts[lang].adminDashboard.services.categoryImage }}
          </label>

          <div class="flex items-center gap-4">
            <div
              class="w-16 h-16 rounded-full border border-gray-300 dark:border-gray-600 flex items-center justify-center bg-gray-100 dark:bg-gray-700 overflow-hidden cursor-pointer hover:opacity-80 transition"
              @click="triggerCategoryFile"
            >
              <img
                v-if="newCategoryPreview"
                :src="newCategoryPreview"
                alt="Category"
                class="w-full h-full object-cover"
                @error="handlePreviewError"
              />
              <i v-else class="fa-solid fa-image text-xl text-gray-500"></i>
            </div>

            <div>
              <input
                ref="categoryFileInput"
                type="file"
                accept="image/*"
                @change="onCategoryFileChange"
                class="hidden"
              />

              <button
                type="button"
                @click="triggerCategoryFile"
                class="px-3 py-1.5 rounded-md bg-gray-100 dark:bg-gray-800 hover:bg-gray-200 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-200 text-sm"
              >
                {{ texts[lang].adminDashboard.services.chooseImage }}
              </button>

              <p class="text-xs text-gray-500 dark:text-gray-300 mt-1">
                <span v-if="uploading" class="text-[#5984C6] ml-1">
                  {{ texts[lang].adminDashboard.services.uploading }}
                </span>
              </p>

              <p v-if="uploadError" class="text-xs text-red-600 mt-1">
                {{ uploadError }}
              </p>
            </div>
          </div>
        </div>

        <div class="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-3">
          <button
            @click="showModal = false"
            class="px-3 sm:px-4 py-2 bg-gray-200 hover:bg-gray-300 rounded-lg text-gray-700 text-sm sm:text-base"
          >
            {{ texts[lang].adminDashboard.services.cancel }}
          </button>

          <button
            @click="saveCategory"
            class="px-3 sm:px-4 py-2 bg-[#5984C6] hover:bg-[#4968a0] text-white rounded-lg font-semibold text-sm sm:text-base"
          >
            {{ texts[lang].adminDashboard.services.save }}
          </button>
        </div>
      </div>
    </div>

  </div>
</template>


<script>
import ServiceCategoryCard from './ServiceCategoryCard.vue';
import { db } from '@/firebase/firebase';
import { collection, getDocs, addDoc, onSnapshot } from 'firebase/firestore';
import { useTestLang } from "@/langTest/useTestLang";

export default {
  name: 'ServicesPage',
  components: { ServiceCategoryCard },

  setup() {
    const { lang, texts } = useTestLang();
    return { lang, texts };
  },

  data() {
    return {
      categories: [],
      loading: true,
      showModal: false,
      newCategory: { name: '', icon: '' },
      newCategoryPreview: '',
      uploading: false,
      uploadError: '',
      categoryFile: null,
      unsubscribeServices: null,
    };
  },

  methods: {

    handleViewProviders(serviceName) {
      this.$router.push(`/dashboard/providers?category=${serviceName}`);
    },

    async saveCategory() {
      if (!this.newCategory.name) {
        alert("Please enter a category name");
        return;
      }
      if (!this.newCategory.icon) {
        alert("Please select and upload an image for the category");
        return;
      }
      if (this.uploading) {
        alert("Please wait for the image upload to finish");
        return;
      }

      try {
        await addDoc(collection(db, 'services'), {
          name: this.newCategory.name,
          icon: this.newCategory.icon,
          status: 'Active',
          createdAt: new Date(),
        });

        this.resetNewCategoryForm();
        this.showModal = false;
      } catch (error) {
        console.error("Error saving category:", error);
        alert("Error adding category. Please try again.");
      }
    },

    async onCategoryFileChange(e) {
      const file = e.target.files && e.target.files[0];
      this.uploadError = '';
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        this.uploadError = 'Please select a valid image file.';
        e.target.value = '';
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        this.uploadError = 'Image size should be less than 5MB.';
        e.target.value = '';
        return;
      }

      // Check image dimensions
      const img = new Image();
      const self = this;
      img.onload = function() {
        const maxWidth = 800;
        const maxHeight = 800;
        if (this.width > maxWidth || this.height > maxHeight) {
          self.uploadError = `Image dimensions should be ${maxWidth}x${maxHeight} pixels or smaller. Current: ${this.width}x${this.height}`;
          e.target.value = '';
          return;
        }
        // Continue with existing logic if dimensions are OK
        self.processFileAfterValidation(file, tempURL);
      };

      img.onerror = () => {
        this.uploadError = 'Failed to load image. Please choose another file.';
        e.target.value = '';
      };

      const tempURL = URL.createObjectURL(file);
      img.src = tempURL;
    },

    processFileAfterValidation(file, tempURL) {
      this.categoryFile = file;
      this.newCategoryPreview = tempURL;

      const img = new Image();
      img.onload = async () => {
        try {
          this.uploading = true;
          const { uploadImageOnly } = await import('@/composables/useImageUpload');
          const uploadedUrl = await uploadImageOnly(file);
          this.newCategory.icon = uploadedUrl;
        } catch (err) {
          console.error('Image upload failed:', err);
          this.uploadError = 'Failed to upload image. Please try again.';
          this.newCategory.icon = '';
        } finally {
          this.uploading = false;
          URL.revokeObjectURL(tempURL);
        }
      };

      img.onerror = () => {
        this.uploadError = 'Failed to load image. Please choose another file.';
        this.categoryFile = null;
        this.newCategoryPreview = '';
        this.newCategory.icon = '';
        if (this.$refs.categoryFileInput) this.$refs.categoryFileInput.value = '';
        URL.revokeObjectURL(tempURL);
      };

      img.src = tempURL;
    },

    async onCategoryFileChange(e) {
      const file = e.target.files && e.target.files[0];
      this.uploadError = '';
      if (!file) return;

      if (!file.type.startsWith('image/')) {
        this.uploadError = 'Please select a valid image file.';
        e.target.value = '';
        return;
      }

      const maxSize = 5 * 1024 * 1024;
      if (file.size > maxSize) {
        this.uploadError = 'Image size should be less than 5MB.';
        e.target.value = '';
        return;
      }

      // Check image dimensions
      const img = new Image();
      const self = this;
      img.onload = function() {
        const maxWidth = 800;
        const maxHeight = 800;
        if (this.width > maxWidth || this.height > maxHeight) {
          self.uploadError = `Image dimensions should be ${maxWidth}x${maxHeight} pixels or smaller. Current: ${this.width}x${this.height}`;
          e.target.value = '';
          return;
        }
        // Continue with existing logic if dimensions are OK
        self.processFileAfterValidation(file, URL.createObjectURL(file));
      };

      img.onerror = () => {
        this.uploadError = 'Failed to load image. Please choose another file.';
        e.target.value = '';
      };

      const tempURL = URL.createObjectURL(file);
      img.src = tempURL;
    },

    triggerCategoryFile() {
      if (this.$refs.categoryFileInput) {
        this.$refs.categoryFileInput.click();
      }
    },

    handlePreviewError(event) {
      this.newCategoryPreview = '';
      if (event && event.target) {
        event.target.style.display = 'none';
      }
    },

    resetNewCategoryForm() {
      this.newCategory = { name: '', icon: '' };
      this.newCategoryPreview = '';
      this.uploading = false;
      this.uploadError = '';
      this.categoryFile = null;

      if (this.$refs.categoryFileInput) {
        this.$refs.categoryFileInput.value = '';
      }
    }
  },

  mounted() {
    const servicesRef = collection(db, 'services');

    this.unsubscribeServices = onSnapshot(servicesRef, async (snapshot) => {
      try {
        // Get technicians
        const techniciansRef = collection(db, 'technicians');
        const techSnapshot = await getDocs(techniciansRef);

        const providerCount = {};

        techSnapshot.forEach(doc => {
          const data = doc.data();
          const skill = data.skill;
          if (skill) {
            providerCount[skill.toLowerCase()] =
              (providerCount[skill.toLowerCase()] || 0) + 1;
          }
        });

        // Get companies (Finishing)
        const companiesRef = collection(db, 'companies');
        const companySnapshot = await getDocs(companiesRef);
        providerCount["finishing"] = companySnapshot.size;

        // Update categories
        this.categories = snapshot.docs.map(doc => {
          const service = doc.data();
          const nameLower = service.name.toLowerCase();

          return {
            id: doc.id,
            name: service.name,
            icon: service.icon,
            status: service.status || 'Active',
            providers: providerCount[nameLower] || 0,
          };
        });

      } catch (error) {
        console.error("Error updating categories:", error);
      } finally {
        this.loading = false;
      }
    });
  },

  beforeUnmount() {
    if (this.unsubscribeServices) this.unsubscribeServices();
  }
};
</script>


<style scoped>
</style

