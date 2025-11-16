<template>
  <div
    class="flex flex-col items-center justify-center min-h-screen 
           bg-[#f5f8fc] dark:bg-[#0B1217] text-center px-6"
  >
    <div
      class="bg-white dark:bg-[#16222B] shadow-lg rounded-2xl p-10 
             max-w-md w-full text-gray-700 dark:text-white"
    >
      <div
        class="w-24 h-24 bg-green-100 dark:bg-green-900 rounded-full 
               flex items-center justify-center mx-auto mb-6"
      >
        <i class="fa-solid fa-check text-green-600 dark:text-green-300 text-5xl"></i>
      </div>

      <h1 class="text-3xl font-bold text-[#133B5D] dark:text-white mb-3">
        Payment Successful 🎉
      </h1>

      <p class="text-gray-600 dark:text-gray-300 mb-6">
        Your payment has been received successfully!
        Your order is now confirmed and will be processed by our technician.
      </p>

      <button
        @click="goToOrders"
        class="bg-[#133B5D] hover:bg-[#1b5383] text-white px-6 py-3 rounded-lg font-semibold transition"
      >
        View My Orders
      </button>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/firebase/firebase";

const router = useRouter();

// Read order ID from URL
const params = new URLSearchParams(window.location.search);
const orderId = params.get("order_id");

if (orderId) {
  const updateOrderStatus = async () => {
    try {
      const orderRef = doc(db, "orders", orderId);
      await updateDoc(orderRef, { status: "upcoming" });

      // Remove or update this in production
      await fetch("/api/payment-callback", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ orderId, success: true }),
      });

      console.log("Order updated successfully.");
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  updateOrderStatus();
}

const goToOrders = () => {
  router.push("/my-orders");
};
</script>
