<script setup>
const props = defineProps({
  service: {
    type: Object,
    required: true,
  },
   userType: String 
})

const emit = defineEmits(["order"])
</script>
<template>
  <div
    class="serviceCard  text-center bg-white dark:bg-[#16222B]"
  >
    <div class="serviceImg mb-4">
      <img
        :src="service.image"
        :alt="service.descreption"
        class=" w-full h-40 rounded-2xl"
      />
    </div>

    <h2 class="font-semibold text-gray-700 dark:text-white">{{ service.descreption }}</h2>
    <h2 class="font-bold text-[#5984C6] dark:text-white text-lg md:text-xl">
      {{ service.price }} EGP
    </h2>

    <button
    v-if="userType === 'technician'"
      @click="emit('order', service)"
      class="w-full bg-accent-color text-white px-4 py-2 mt-auto rounded-lg font-semibold hover:bg-[#4a74b3] transition cursor-pointer"
    >
      Order Now
    </button>
  </div>
</template>


<style scoped>

</style>