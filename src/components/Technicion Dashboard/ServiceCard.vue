<script setup>
  defineOptions({ name: "ServiceCard" })

  import { useTestLang } from "@/langTest/useTestLang";
  const { lang, texts } = useTestLang();

  const props = defineProps({
    service: {
      type: Object,
      required: true,
    },
  })
  const emit = defineEmits(["editService"])

  const handleEdit = () => {
    emit("editService", props.service)
  }
</script>

<template>
  <div class="serviceCard rounded-2xl shadow-lg text-center p-6 bg-[#f7f7f7] dark:bg-[#16222B] flex flex-col items-center justify-between w-full h-full transition-transform hover:scale-[1.02]">
    <img
      :src="service.image"
      :alt="texts[lang].technicianDashboard.services?.imageAlt || 'service icon'"
      class="rounded-2xl object-cover h-50"
    />
    <h2 class="font-semibold">{{ service.descreption }}</h2>
    <h2 class="font-bold text-[#6897D4] dark:text-white">{{ service.price }} EGP</h2>
    <div class="buttonsContainer my-2">
      <button
        @click="handleEdit"
        class="bg-[#133B5D] rounded-lg p-1 px-3 text-white mx-2 hover:bg-[#1b5383] cursor-pointer"
      >
        {{ texts[lang].technicianDashboard.buttons?.edit || 'Edit' }}
      </button>
      <button
        @click="$emit('deleteService', service.id)"
        class="bg-[#ff0000] rounded-lg p-1 px-3 text-white mx-2 hover:bg-red-700 cursor-pointer"
      >
        {{ texts[lang].technicianDashboard.buttons?.delete || 'Delete' }}
      </button>
    </div>
  </div>
</template>

<style scoped>

</style>
