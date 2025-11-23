<template>
  <div class="min-h-screen py-16 px-6">
    <div class="max-w-6xl mx-auto mt-10">
      <h1 class="text-3xl font-bold text-accent-color mb-8 text-center">{{ texts[lang].myOrdersPage.title }}</h1>

      <div v-if="loading" class="text-center text-gray-500 mt-10">
        <div class="animate-spin rounded-full h-8 w-8 border-b-2 border-accent-color mx-auto mb-3"></div>
        {{ texts[lang].myOrdersPage.loading }}
      </div>

      <!-- TABS + CONTENT -->
      <div v-else-if="orders.length">
        <!-- Tabs header -->
        <div class="flex flex-wrap justify-center gap-3 mb-8">
          <button
            v-for="tab in tabs"
            :key="tab.key"
            @click="activeTab = tab.key"
            class="px-5 py-2 rounded-lg font-medium transition-all"
            :class="activeTab === tab.key ? 'bg-accent-color text-white' : 'bg-(--surface)/50 dark:bg-(--surface) text-(--text-primary) '"
          >
            {{ tab.label }}
            <span v-if="tab.count > 0" class="ml-2 text-sm text-(--text-muted)">({{ tab.count }})</span>
          </button>
        </div>

        <!-- Tab contents -->
        <div>
          <!-- All -->
          <div v-show="activeTab === 'all'">
            <h2 class="text-2xl font-semibold mb-4 text-center text-(--text-primary)">{{ texts[lang].myOrdersPage.tabs.all }}</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="order in orders"
                :key="order.id"
                class="rounded-2xl p-6 relative transition hover:shadow-lg dark:bg-(--surface) border border-(--border)"
              >
                <!-- card content (same as original) -->
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-lg font-semibold text-accent-color">
                    {{ getTranslatedName(order.serviceTitle) || texts[lang].myOrdersPage.card.service }}:
                  </h3>
                  <span class="px-3 py-1 text-sm rounded-full font-medium" :class="statusColor(order.status)">
                    {{ order.status }}
                  </span>
                </div>

                <ul class="space-y-2 text-(--text-muted)">
                  <li>
                    <span class="font-semibold text-(--text-primary)">{{ getOrderProviderLabel(order) }}:</span>
                    {{ getOrderProviderName(order) }}
                  </li>
                  <li><span class="font-semibold text-(--text-primary)">{{ texts[lang].myOrdersPage.card.price }}</span> {{ order.price }} EGP</li>
                  <li><span class="font-semibold text-(--text-primary)">{{ texts[lang].myOrdersPage.card.date }}</span> {{ order.date }}</li>
                  <li><span class="font-semibold text-(--text-primary)">{{ texts[lang].myOrdersPage.card.time }}</span> {{ order.time }}</li>
                  <li><span class="font-semibold text-(--text-primary)">{{ texts[lang].myOrdersPage.card.location }}</span> {{ formatLocation(order.location) }}</li>
                  <li v-if="order.orderCode" class="font-semibold text-green-700 mt-2">🔐 {{ texts[lang].myOrdersPage.card.orderCode }} <span class="text-accent-color">{{ order.orderCode }}</span></li>
                </ul>

                <div class="mt-5 text-center">
                  <button
                    v-if="order.status === 'unconfirmed'"
                    @click="openPaymentPopup(order)"
                    class="bg-accent-color hover:bg-(--accent) text-white px-6 py-2 rounded-lg font-semibold transition"
                  >
                    {{ texts[lang].myOrdersPage.card.payNow }}
                  </button>
                  <button
                    v-if="order.status === 'new' || order.status === 'unconfirmed'"
                    @click="openCancelPopup(order)"
                    class="bg-red-600 ml-2 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition"
                  >
                    {{ texts[lang].myOrdersPage.card.cancelOrder }}
                  </button>
                  <div v-else-if="order.status === 'upcoming'" class="text-green-600 font-semibold">{{ texts[lang].myOrdersPage.card.paymentCompleted }}</div>
                  <div v-else-if="order.status === 'completed'" class="text-accent-color font-semibold">{{ texts[lang].myOrdersPage.card.serviceCompleted }}</div>
                  <div v-else-if="order.status === 'declined' || order.status === 'cancelled'" class="text-red-500 font-semibold">
                    {{ /* fallback: if card.orderWas exists use it, else show generic */ (texts[lang].myOrdersPage.card.orderWas ? texts[lang].myOrdersPage.card.orderWas.replace('{status}', order.status) : ('This order was ' + order.status + '.')) }}
                  </div>
                  <div v-if="order.status === 'completed'" class="mt-3 text-center">
                    <button
                      v-if="!hasRated(order.id)"
                      @click="openRatePopup(order)"
                      class="bg-accent-color hover:bg-(--accent) text-white px-4 py-2 rounded-lg font-semibold transition"
                    >
                      {{ texts[lang].myOrdersPage.card.rateProvider.replace('{providerType}', getOrderProviderLabel(order)) }}
                    </button>
                    <div v-else class="text-(--text-muted)">{{ texts[lang].myOrdersPage.card.youRated.replace('{rating}', getExistingRating(order.id)) }}</div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <!-- Unconfirmed -->
          <div v-show="activeTab === 'unconfirmed'">
            <h2 class="text-2xl font-semibold mb-4 text-center text-(--text-primary)">{{ texts[lang].myOrdersPage.tabs.unconfirmed }}</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="order in grouped.unconfirmed"
                :key="order.id"
                class="rounded-2xl p-6 relative transition hover:shadow-lg dark:bg-(--surface) border border-(--border)"
              >
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-lg font-semibold text-accent-color">
                    {{ getTranslatedName(order.serviceTitle) || texts[lang].myOrdersPage.card.service }}:
                  </h3>
                  <span class="px-3 py-1 text-sm rounded-full font-medium" :class="statusColor(order.status)">
                    {{ order.status }}
                  </span>
                </div>

                <ul class="space-y-2 text-(--text-muted)">
                  <li>
                    <span class="font-semibold text-(--text-primary)">{{ getOrderProviderLabel(order) }}:</span>
                    {{ getOrderProviderName(order) }}
                  </li>
                  <li><span class="font-semibold text-(--text-primary)">{{ texts[lang].myOrdersPage.card.price }}</span> {{ order.price }} EGP</li>
                  <li><span class="font-semibold text-(--text-primary)">{{ texts[lang].myOrdersPage.card.date }}</span> {{ order.date }}</li>
                  <li><span class="font-semibold text-(--text-primary)">{{ texts[lang].myOrdersPage.card.time }}</span> {{ order.time }}</li>
                  <li><span class="font-semibold text-(--text-primary)">{{ texts[lang].myOrdersPage.card.location }}</span> {{ formatLocation(order.location) }}</li>
                  <li v-if="order.orderCode" class="font-semibold text-green-700 mt-2">🔐 {{ texts[lang].myOrdersPage.card.orderCode }} <span class="text-accent-color">{{ order.orderCode }}</span></li>
                </ul>

                <div class="mt-5 text-center">
                  <button @click="openPaymentPopup(order)" class="bg-accent-color hover:bg-(--accent) text-white px-6 py-2 rounded-lg font-semibold transition">{{ texts[lang].myOrdersPage.card.payNow }}</button>
                </div>
              </div>
            </div>
          </div>

          <!-- Upcoming -->
          <div v-show="activeTab === 'upcoming'">
            <h2 class="text-2xl font-semibold mb-4 text-center text-(--text-primary)">{{ texts[lang].myOrdersPage.tabs.upcoming }}</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="order in grouped.upcoming"
                :key="order.id"
                class="rounded-2xl p-6 relative transition hover:shadow-lg dark:bg-(--surface) border border-(--border)"
              >
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-lg font-semibold text-accent-color">
                    {{ getTranslatedName(order.serviceTitle) || texts[lang].myOrdersPage.card.service }}:
                  </h3>
                  <span class="px-3 py-1 text-sm rounded-full font-medium" :class="statusColor(order.status)">
                    {{ order.status }}
                  </span>
                </div>

                <ul class="space-y-2 text-(--text-muted)">
                  <li>
                    <span class="font-semibold text-(--text-primary)">{{ getOrderProviderLabel(order) }}:</span>
                    {{ getOrderProviderName(order) }}
                  </li>
                  <li><span class="font-semibold text-(--text-primary)">{{ texts[lang].myOrdersPage.card.price }}</span> {{ order.price }} EGP</li>
                  <li><span class="font-semibold text-(--text-primary)">{{ texts[lang].myOrdersPage.card.date }}</span> {{ order.date }}</li>
                  <li><span class="font-semibold text-(--text-primary)">{{ texts[lang].myOrdersPage.card.time }}</span> {{ order.time }}</li>
                  <li><span class="font-semibold text-(--text-primary)">{{ texts[lang].myOrdersPage.card.location }}</span> {{ formatLocation(order.location) }}</li>
                  <li v-if="order.orderCode" class="font-semibold text-green-700 mt-2">🔐 {{ texts[lang].myOrdersPage.card.orderCode }} <span class="text-accent-color">{{ order.orderCode }}</span></li>
                </ul>

                <div class="mt-5 text-center text-green-600 font-semibold">{{ texts[lang].myOrdersPage.card.paymentCompleted }}</div>
              </div>
            </div>
          </div>

          <!-- Completed -->
          <div v-show="activeTab === 'completed'">
            <h2 class="text-2xl font-semibold mb-4 text-center text-(--text-primary)">{{ texts[lang].myOrdersPage.tabs.completed }}</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="order in grouped.completed"
                :key="order.id"
                class="rounded-2xl p-6 relative transition hover:shadow-lg dark:bg-(--surface) border border-(--border)"
              >
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-lg font-semibold text-accent-color">
                    {{ getTranslatedName(order.serviceTitle) || texts[lang].myOrdersPage.card.service }}:
                  </h3>
                  <span class="px-3 py-1 text-sm rounded-full font-medium" :class="statusColor(order.status)">
                    {{ order.status }}
                  </span>
                </div>

                <ul class="space-y-2 text-(--text-muted)">
                  <li>
                    <span class="font-semibold text-(--text-primary)">{{ getOrderProviderLabel(order) }}:</span>
                    {{ getOrderProviderName(order) }}
                  </li>                  
                  <li><span class="font-semibold text-(--text-primary)">{{ texts[lang].myOrdersPage.card.price }}</span> {{ order.price }} EGP</li>
                  <li><span class="font-semibold text-(--text-primary)">{{ texts[lang].myOrdersPage.card.date }}</span> {{ order.date }}</li>
                  <li><span class="font-semibold text-(--text-primary)">{{ texts[lang].myOrdersPage.card.time }}</span> {{ order.time }}</li>
                  <li><span class="font-semibold text-(--text-primary)">{{ texts[lang].myOrdersPage.card.location }}</span> {{ formatLocation(order.location) }}</li>
                  <li v-if="order.orderCode" class="font-semibold text-green-700 mt-2">🔐 {{ texts[lang].myOrdersPage.card.orderCode }} <span class="text-accent-color">{{ order.orderCode }}</span></li>
                </ul>

                <div class="mt-5 text-center text-accent-color font-semibold">{{ texts[lang].myOrdersPage.card.serviceCompleted }}</div>
                <div class="mt-3 text-center">
                  <button
                    v-if="!hasRated(order.id)"
                    @click="openRatePopup(order)"
                    class="bg-accent-color hover:bg-(--accent) text-white px-4 py-2 rounded-lg font-semibold transition"
                  >
                    {{ texts[lang].myOrdersPage.card.rateProvider.replace('{providerType}', getOrderProviderLabel(order)) }}
                  </button>
                  <div v-else class="text-(--text-muted)">{{ texts[lang].myOrdersPage.card.youRated.replace('{rating}', getExistingRating(order.id)) }}</div>
                </div>
              </div>
            </div>
          </div>

          <!-- Declined / Cancelled -->
          <div v-show="activeTab === 'declined'">
            <h2 class="text-2xl font-semibold mb-4 text-center text-(--text-primary)">{{ texts[lang].myOrdersPage.tabs.declined }}</h2>
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <div
                v-for="order in [...grouped.declined, ...grouped.cancelled]"
                :key="order.id"
                class="rounded-2xl p-6 relative transition hover:shadow-lg dark:bg-(--surface) border border-(--border)"
              >
                <div class="flex justify-between items-center mb-4">
                  <h3 class="text-lg font-semibold text-accent-color">
                    {{ getTranslatedName(order.serviceTitle) || texts[lang].myOrdersPage.card.service }}:
                  </h3>
                  <span class="px-3 py-1 text-sm rounded-full font-medium" :class="statusColor(order.status)">
                    {{ order.status }}
                  </span>
                </div>

                <ul class="space-y-2 text-(--text-muted)">
                  <li><span class="font-semibold text-(--text-primary)">{{ texts[lang].myOrdersPage.card.technician }}:</span> {{ getTranslatedName(order.technicianName) || texts[lang].myOrdersPage.card.noProvider }}</li>
                  <li><span class="font-semibold text-(--text-primary)">{{ texts[lang].myOrdersPage.card.price }}</span> {{ order.price }} EGP</li>
                  <li><span class="font-semibold text-(--text-primary)">{{ texts[lang].myOrdersPage.card.date }}</span> {{ order.date }}</li>
                  <li><span class="font-semibold text-(--text-primary)">{{ texts[lang].myOrdersPage.card.time }}</span> {{ order.time }}</li>
                  <li><span class="font-semibold text-(--text-primary)">{{ texts[lang].myOrdersPage.card.location }}</span> {{ formatLocation(order.location) }}</li>
                  <li v-if="order.orderCode" class="font-semibold text-green-700 mt-2">🔐 {{ texts[lang].myOrdersPage.card.orderCode }} <span class="text-accent-color">{{ order.orderCode }}</span></li>
                </ul>

                <div class="mt-5 text-center text-red-500 font-semibold">
                  {{ texts[lang].myOrdersPage.card.orderWas ? texts[lang].myOrdersPage.card.orderWas.replace('{status}', order.status) : ('This order was ' + order.status + '.') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div v-if="orders.length === 0" class="text-center py-16">
  <!-- <img src="/images/no-orders-big.svg" class="w-56 mx-auto mb-6" /> -->
  <h2 class="text-2xl font-bold text-(--text-primary)">No Orders Yet</h2>
  <p class="text-(--text-muted) mt-2 mb-6">
  🎉 Ready? Book your first service and meet the best technicians!
  </p>

<router-link
  to="profiles/Plumbing"
  class="px-6 py-3 bg-accent-color text-white rounded-full font-semibold hover:scale-105 transition transform animate-bounce"
>
  Get service now
</router-link>

</div>

    </div>

    <transition name="fade">
      <div v-if="showPopup" class="fixed inset-0 bg-[#000000d0] flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl p-8 w-[90%] max-w-md shadow-lg text-center">
          <h2 class="text-2xl font-semibold text-[#133B5D] mb-4">{{ texts[lang].myOrdersPage.paymentPopup.confirm }}</h2>

          <p class="text-gray-700 mb-4">
            <span class="font-semibold">{{ texts[lang].myOrdersPage.card.service }}:</span>
            {{ getTranslatedName(selectedOrder?.serviceTitle) }}
          </p>
          <p class="text-gray-700 mb-4">
            <span class="font-semibold">{{ texts[lang].myOrdersPage.card.technician }}:</span>
            {{ getTranslatedName(selectedOrder?.technicianName) }}
          </p>
          <p class="text-gray-900 text-xl font-bold mb-6">{{ selectedOrder?.price }} EGP</p>

          <div class="flex justify-center gap-4">
            <button @click="confirmPayment" class="bg-[#133B5D] hover:bg-[#1b5383] text-white px-6 py-2 rounded-lg font-semibold transition">{{ texts[lang].myOrdersPage.paymentPopup.confirm }}</button>
            <button @click="cancelPayment" class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg font-semibold transition">{{ texts[lang].myOrdersPage.paymentPopup.cancel }}</button>
          </div>
        </div>
      </div>
    </transition>

    <!-- 🟥 Cancel confirmation popup -->
    <transition name="fade">
      <div v-if="showCancelPopup" class="fixed inset-0 bg-[#000000d0] flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl p-8 w-[90%] max-w-md shadow-lg text-center">
          <h2 class="text-2xl font-semibold text-[#133B5D] mb-4">{{ texts[lang].myOrdersPage.cancelPopup.title }}</h2>
          <p class="text-gray-700 mb-6">{{ texts[lang].myOrdersPage.cancelPopup.prompt }}</p>
          <div class="flex justify-center gap-4">
            <button
              @click="confirmCancelOrder"
              class="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              {{ texts[lang].myOrdersPage.cancelPopup.confirm }}
            </button>
            <button
              @click="closeCancelPopup"
              class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg font-semibold transition"
            >
              {{ texts[lang].myOrdersPage.cancelPopup.cancel }}
            </button>
          </div>
        </div>
      </div>
    </transition>

    <!-- ⭐ Rating popup -->
    <transition name="fade">
      <div v-if="showRatePopup" class="fixed inset-0 bg-[#000000d0] flex items-center justify-center z-50">
        <div class="bg-white rounded-2xl p-8 w-[90%] max-w-md shadow-lg text-center">
          <h2 class="text-2xl font-semibold text-[#133B5D] mb-4">{{ texts[lang].myOrdersPage.ratePopup.title.replace('{providerType}', getOrderProviderLabel(ratingOrder)) }}</h2>

          <p class="text-gray-700 mb-4">
            <span class="font-semibold">{{ getOrderProviderLabel(ratingOrder) }}:</span>
            {{ getOrderProviderName(ratingOrder) }}
          </p>
          <p class="text-gray-700 mb-4">
            <span class="font-semibold">{{ texts[lang].myOrdersPage.paymentPopup.service }}</span>
            {{ getTranslatedName(ratingOrder?.serviceTitle) || texts[lang].myOrdersPage.card.service }}
          </p>

          <div class="flex justify-center gap-2 mb-4 text-2xl text-yellow-400">
            <button
              v-for="n in 5"
              :key="n"
              @click="ratingStars = n"
              class="focus:outline-none"
            >
              <i :class="n <= ratingStars ? 'fas fa-star' : 'far fa-star'"></i>
            </button>
          </div>

          <textarea
            v-model="ratingComment"
            rows="3"
            :placeholder="texts[lang].myOrdersPage.ratePopup.commentPlaceholder"
            class="w-full border border-(--border) rounded-lg p-3 text-sm mb-4 focus:outline-none"
          ></textarea>

          <div class="flex justify-center gap-4">
            <button
              :disabled="submittingRating || ratingStars === 0"
              @click="submitRating"
              class="bg-[#133B5D] disabled:opacity-60 hover:bg-[#1b5383] text-white px-6 py-2 rounded-lg font-semibold transition"
            >
              {{ submittingRating ? texts[lang].myOrdersPage.ratePopup.submitting : texts[lang].myOrdersPage.ratePopup.submit }}
            </button>
            <button @click="closeRatePopup" class="bg-gray-300 hover:bg-gray-400 text-gray-800 px-6 py-2 rounded-lg font-semibold transition">{{ texts[lang].myOrdersPage.ratePopup.cancel }}</button>
          </div>
        </div>
      </div>
    </transition>

    <AlertPopup :show="showPopupMessage" :message="popupMessageContent" @close="closeAlert" />
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { db } from "@/firebase/firebase";
import {
  collection,
  query,
  where,
  onSnapshot,
  doc,
  updateDoc,
  addDoc,
  serverTimestamp,
  getDoc,
  getDocs,
  runTransaction,
} from "firebase/firestore";
// NEW: Import the custom alert popup
import AlertPopup from "../components/AlertPopup.vue"; // <-- Adjust path as needed
// NEW: Added missing import for i18n helper and test lang
import { useI18n } from "vue-i18n";
import { useTestLang } from "@/langTest/useTestLang";

const orders = ref([]);
const loading = ref(true);
const showPopup = ref(false); // This is for the PAYMENT popup
const selectedOrder = ref(null);
const showCancelPopup = ref(false);
const orderToCancel = ref(null);

// Rating state
const showRatePopup = ref(false);
const ratingOrder = ref(null);
const ratingStars = ref(0);
const ratingComment = ref("");
const submittingRating = ref(false);
const ratingsByOrderId = ref({}); // { [orderId]: number }

// Refs for the custom alert popup
const showPopupMessage = ref(false);
const popupMessageContent = ref("");

// Helper functions for custom alert popup
const triggerAlert = (message) => {
  popupMessageContent.value = message;
  showPopupMessage.value = true;
};
const closeAlert = () => {
  showPopupMessage.value = false;
  popupMessageContent.value = "";
};

const formatLocation = (loc) => {
  if (!loc) return "—";
  if (typeof loc === "string") return loc; // في حال اتخزنت كنص
  if (typeof loc === "object") {
    const parts = [loc.street, loc.city, loc.country]
      .filter(Boolean)
      .join(", ");
    return parts || "Location not specified";
  }
  return "—";
};

const { locale } = useI18n(); // *** 2. Initialize locale ***

// --- NEW: initialize test lang composable (handles refs) ---
const { lang, texts } = useTestLang();

// --- NEW: safe accessor for texts[lang] that works whether texts/lang are refs or plain objects ---
const getT = () => {
  // texts may be a ref or plain object. lang may be ref or string.
  const langKey = (typeof lang === "object" && typeof lang.value !== "undefined") ? lang.value : lang;
  // If texts is a ref with .value
  if (typeof texts === "object" && typeof texts.value !== "undefined") {
    return texts.value?.[langKey] || texts.value?.en || {};
  }
  // texts plain object
  return texts?.[langKey] || texts?.en || {};
};

// Helper function for translating object-based names
const getTranslatedName = (nameObject) => {
  const currentLocale = locale.value || (typeof lang === "object" && typeof lang.value !== "undefined" ? lang.value : "en");
  if (typeof nameObject === "object" && nameObject !== null) {
    return nameObject[currentLocale] || nameObject.en || "";
  }
  return nameObject || "";
};

// 🟩 Open confirmation popup before redirecting
const openPaymentPopup = (order) => {
  selectedOrder.value = order;
  showPopup.value = true;
};

// 🟥 Cancel popup
const cancelPayment = () => {
  selectedOrder.value = null;
  showPopup.value = false;
};

// 🟦 Confirm & redirect to Paymob
const confirmPayment = async () => {
  if (!selectedOrder.value) return;

  try {
    const id = selectedOrder.value.id;
    const amount = Number(selectedOrder.value.price) || 0;

    // 🟡 بدل "upcoming" نخليها مؤقتًا pending_payment
    const orderRef = doc(db, "orders", id);
    await updateDoc(orderRef, { status: "pending_payment" });

    // 🟦 تغيير اللينك → /api/pay (Fix #1)
    const response = await fetch("/api/pay", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        amount,
        orderId: id,
        serviceTitle: getTranslatedName(selectedOrder.value.serviceTitle),
        technicianName: getTranslatedName(selectedOrder.value.technicianName),
      }),
    });

    const data = await response.json();

    if (!response.ok || !data.url) {
      // ❌ لو الدفع فشل → رجّع الحالة unconfirmed (Fix #2)
      await updateDoc(orderRef, { status: "unconfirmed" });
      triggerAlert(getT()?.myOrdersPage?.alerts?.paymentFailed || "Payment request failed.");
      return;
    }

    // 🚀 لو نجح → روح لصفحة الدفع
    window.location.href = data.url;

  } catch (err) {
    console.error("Error:", err);

    // ❌ رجّع الأوردر لحالته الطبيعية (Fix #2)
    try {
      await updateDoc(doc(db, "orders", selectedOrder.value.id), { status: "unconfirmed" });
    } catch (_) {}

    triggerAlert(getT()?.myOrdersPage?.alerts?.paymentError || "Error while preparing payment.");
  } finally {
    showPopup.value = false;
    selectedOrder.value = null;
  }
};


// 🟦 Open cancel confirmation
const openCancelPopup = (order) => {
  orderToCancel.value = order;
  showCancelPopup.value = true;
};

// 🟥 Confirm cancel
const confirmCancelOrder = async () => {
  if (!orderToCancel.value) return;
  try {
    const orderRef = doc(db, "orders", orderToCancel.value.id);
    const orderSnap = await getDoc(orderRef);
    const orderData = orderSnap.exists() ? orderSnap.data() : null;

    await updateDoc(orderRef, { status: "cancelled" });
    // 🔔 Notify technician
    if (orderData?.technicianId) {
      const notifCol = collection(db, "technicians", orderData.technicianId, "notifications");
      await addDoc(notifCol, {
        orderId: orderToCancel.value.id,
        message: `⚠️ The client has cancelled the order "${orderData.descreption || "No description"}". Status changed to cancelled.`,
        status: "cancelled",
        isRead: false,
        timestamp: serverTimestamp(),
      });
    }

    // (Note: original had a duplicate notify - left unchanged per your request)

    triggerAlert(getT()?.myOrdersPage?.alerts?.cancelSuccess || "Order cancelled successfully.");
    showCancelPopup.value = false;
  } catch (error) {
    console.error("Error cancelling order:", error);
    triggerAlert(getT()?.myOrdersPage?.alerts?.cancelError || "Failed to cancel order.");
  }
};

const closeCancelPopup = () => {
  showCancelPopup.value = false;
  orderToCancel.value = null;
};


// 🟨 Status badge colors (unchanged)
const statusColor = (status) => {
  switch ((status || "").toLowerCase()) {
    case "unconfirmed":
      return "bg-yellow-100 text-yellow-700";
    case "upcoming":
      return "bg-green-100 text-green-700";
    case "completed":
      return "bg-blue-100 text-blue-700";
    case "declined":
    case "cancelled":
      return "bg-red-100 text-red-700";
    default:
      return "bg-gray-100 text-gray-600";
  }
};

// Load orders
onMounted(() => {
  const auth = getAuth();
  onAuthStateChanged(auth, (user) => {
    if (user) {
      const q = query(collection(db, "orders"), where("clientId", "==", user.uid));
      onSnapshot(q, (snap) => {
        orders.value = snap.docs.map((d) => ({ id: d.id, ...d.data() }));
        loading.value = false;
      });

      // Load existing ratings by this client to prevent duplicates
      const rq = query(collection(db, "Ratings"), where("clientId", "==", user.uid));
      onSnapshot(rq, (snap) => {
        const map = {};
        snap.forEach((docu) => {
          const data = docu.data();
          if (data.orderId) map[data.orderId] = data.stars || data.rating || 0;
        });
        ratingsByOrderId.value = map;
      });
    } else {
      loading.value = false;
    }
  });
});

// grouped BEFORE tabs (important)
const grouped = computed(() => {
  const buckets = {
    unconfirmed: [],
    upcoming: [],
    completed: [],
    declined: [],
    cancelled: [],
    other: [],
  };
  for (const o of orders.value) {
    const st = (o.status || "").toLowerCase();
    if (st in buckets) buckets[st].push(o);
    else buckets.other.push(o);
  }
  return buckets;
});

// tabs control
const activeTab = ref("all");
const tabs = computed(() => {
  const t = getT();
  // If translations not loaded yet, return safe defaults (labels in English)
  const tabsLabels = t?.myOrdersPage?.tabs || {
    all: "All",
    unconfirmed: "Unconfirmed",
    upcoming: "Upcoming",
    completed: "Completed",
    declined: "Declined",
  };

  return [
    { key: "all", label: tabsLabels.all, count: orders.value.length },
    { key: "unconfirmed", label: tabsLabels.unconfirmed, count: grouped.value.unconfirmed.length },
    { key: "upcoming", label: tabsLabels.upcoming, count: grouped.value.upcoming.length },
    { key: "completed", label: tabsLabels.completed, count: grouped.value.completed.length },
    { key: "declined", label: tabsLabels.declined, count: grouped.value.declined.length + grouped.value.cancelled.length },
  ];
});

// ⭐ Rating helpers
const hasRated = (orderId) => {
  return Boolean(ratingsByOrderId.value[orderId]);
};

const getExistingRating = (orderId) => {
  return ratingsByOrderId.value[orderId] || 0;
};

const openRatePopup = (order) => {
  ratingOrder.value = order;
  ratingStars.value = 0;
  ratingComment.value = "";
  showRatePopup.value = true;
};

const closeRatePopup = () => {
  showRatePopup.value = false;
  ratingOrder.value = null;
};

const submitRating = async () => {
  if (!ratingOrder.value || ratingStars.value === 0) return;
  submittingRating.value = true;
  try {
    const auth = getAuth();
    const user = auth.currentUser;
    if (!user) throw new Error("Not authenticated");

    // ✅ Prevent duplicate rating
    const existingQ = query(
      collection(db, "Ratings"),
      where("orderId", "==", ratingOrder.value.id),
      where("clientId", "==", user.uid)
    );
    const existing = await getDocs(existingQ);
    if (!existing.empty) {
      triggerAlert(getT()?.myOrdersPage?.alerts?.rateDuplicate || "You have already rated this order.");
      submittingRating.value = false;
      showRatePopup.value = false;
      return;
    }

    // ✅ Load client info
    let clientImageUrl = "";
    let clientName = ratingOrder.value.clientName || user.displayName || null;
    try {
      const clientRef = doc(db, "clients", user.uid);
      const clientSnap = await getDoc(clientRef);
      if (clientSnap.exists()) {
        const c = clientSnap.data();
        clientImageUrl = c.image || "";
        clientName = c.name || clientName;
      }
    } catch (e) {
      console.warn("Could not fetch client profile:", e);
    }

    // ✅ Determine provider (technician OR company)
    const isTechnician = !!ratingOrder.value.technicianId;
    const providerId = isTechnician
      ? ratingOrder.value.technicianId
      : ratingOrder.value.companyId;
    const providerName = isTechnician
      ? ratingOrder.value.technicianName
      : ratingOrder.value.companyName;
    const providerType = isTechnician ? "technician" : "company";

    // ✅ Add rating record
    await addDoc(collection(db, "Ratings"), {
      orderId: ratingOrder.value.id,
      providerId,
      providerName: providerName || null,
      providerType,
      clientId: user.uid,
      clientName,
      clientImageUrl,
      stars: ratingStars.value,
      comment: ratingComment.value || "",
      createdAt: serverTimestamp(),
    });

    // ✅ Update provider’s rating average & count
    const collectionName = isTechnician ? "technicians" : "companies";
    const providerRef = doc(db, collectionName, providerId);

    await runTransaction(db, async (transaction) => {
      const providerSnap = await transaction.get(providerRef);
      const data = providerSnap.exists() ? providerSnap.data() : {};
      const currentAvg = Number(data.ratingAverage || 0);
      const currentCount = Number(data.ratingCount || 0);
      const newCount = currentCount + 1;
      const newAvg =
        newCount > 0
          ? (currentAvg * currentCount + ratingStars.value) / newCount
          : ratingStars.value;
      transaction.update(providerRef, {
        ratingAverage: Number(newAvg.toFixed(2)),
        ratingCount: newCount,
      });
    });

    triggerAlert(getT()?.myOrdersPage?.alerts?.rateSuccess || "Thank you! Your rating has been submitted.");
    showRatePopup.value = false;
  } catch (err) {
    console.error("Error submitting rating:", err);
    triggerAlert(getT()?.myOrdersPage?.alerts?.rateError || "Failed to submit rating.");
  } finally {
    submittingRating.value = false;
  }
};

const getOrderProviderName = (order) => {
  if (order.companyId && order.companyName) {
    return getTranslatedName(order.companyName); // لو في شركة
  } else if (order.technicianName) {
    return getTranslatedName(order.technicianName); // لو فني
  } else {
    return getT()?.myOrdersPage?.card?.noProvider || "—";
  }
};

const getOrderProviderLabel = (order) => {
  return order.companyId ? (getT()?.myOrdersPage?.card?.company || "Company") : (getT()?.myOrdersPage?.card?.technician || "Technician");
};

</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
