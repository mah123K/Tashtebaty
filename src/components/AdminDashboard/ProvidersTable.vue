<template>
  <div class="bg-white dark:bg-[#1f2937] dark:text-gray-100 shadow-lg rounded-2xl p-4 sm:p-6">
    <!-- Header -->
    <div class="flex justify-between items-center mb-6">
      <h2 class="text-2xl font-semibold text-[#5984C6] dark:text-[#8db4ff]">
        {{ texts[lang].adminDashboard.providers.title }}
      </h2>

      <!-- Search -->
      <div class="flex items-center space-x-2 sm:space-x-4">
        <div class="relative w-full sm:w-auto">
          <input
            v-model="searchTerm"
            type="text"
            :placeholder="texts[lang].adminDashboard.providers.searchPlaceholder"
            class="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg pl-10 pr-4 py-2 w-full sm:w-64 focus:outline-none focus:ring-2 focus:ring-[#5984C6]"
          />
          <svg
            class="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"/>
          </svg>
        </div>
      </div>
    </div>

    <!-- Tabs -->
    <div class="flex border-b border-gray-200 dark:border-gray-700 mb-4 sm:mb-6 overflow-x-auto">
      <button
        @click="activeTab = 'company'"
        :class="[
          'px-4 sm:px-6 py-3 text-sm sm:text-lg font-medium border-b-2 whitespace-nowrap',
          activeTab === 'company'
            ? 'border-[#5984C6] text-[#5984C6]'
            : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300'
        ]"
      >
        {{ texts[lang].adminDashboard.providers.company }}
      </button>

      <button
        @click="activeTab = 'craftsmen'"
        :class="[
          'px-4 sm:px-6 py-3 text-sm sm:text-lg font-medium border-b-2 whitespace-nowrap',
          activeTab === 'craftsmen'
            ? 'border-[#5984C6] text-[#5984C6]'
            : 'border-transparent text-gray-500 dark:text-gray-300 hover:text-gray-700 dark:hover:text-gray-200 hover:border-gray-300'
        ]"
      >
        {{ texts[lang].adminDashboard.providers.craftsmen }}
      </button>
    </div>

    <!-- Loading -->
    <div v-if="loading" class="text-center py-6 text-gray-400">
      {{ texts[lang].adminDashboard.providers.loading }}
      {{ activeTab === 'company'
          ? texts[lang].adminDashboard.providers.loadingCompanies
          : texts[lang].adminDashboard.providers.loadingCraftsmen
      }}...
    </div>

    <!-- Companies Table -->
    <div
      v-else-if="activeTab === 'company'"
      class="hidden md:block overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700"
    >
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 p-2 sm:p-4 gap-2">
        <h3 class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100">
          {{ texts[lang].adminDashboard.providers.allCompanies }}
        </h3>

        <button
          @click="toggleSort('createdAt')"
          class="flex items-center justify-center gap-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition w-full sm:w-auto"
        >
          {{ texts[lang].adminDashboard.providers.sortByCreated }}
          <svg
            :class="['w-4 h-4 transition-transform', sortOrder === 'asc' ? 'rotate-180' : '']"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M5 15l7-7 7 7"
            ></path>
          </svg>
        </button>
      </div>

      <table class="min-w-full text-xs sm:text-sm text-gray-700 dark:text-gray-200">
        <thead class="bg-[#5984C6] text-white">
          <tr>
            <th class="py-2 sm:py-3 px-1 sm:px-2 text-center text-xs sm:text-sm whitespace-nowrap w-12 sm:w-16">
              {{ texts[lang].adminDashboard.providers.profile }}
            </th>
            <th class="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs sm:text-sm whitespace-nowrap">
              {{ texts[lang].adminDashboard.providers.companyName }}
            </th>
            <th class="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs sm:text-sm whitespace-nowrap">
              {{ texts[lang].adminDashboard.providers.email }}
            </th>
            <th class="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs sm:text-sm whitespace-nowrap">
              {{ texts[lang].adminDashboard.providers.phone }}
            </th>
            <th class="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs sm:text-sm whitespace-nowrap">
              {{ texts[lang].adminDashboard.providers.address }}
            </th>
            <th class="py-2 sm:py-3 px-2 sm:px-3 text-center text-xs sm:text-sm whitespace-nowrap min-w-14 sm:min-w-16">
              {{ texts[lang].adminDashboard.providers.rating }}
            </th>
            <th class="py-2 sm:py-3 px-2 sm:px-3 text-center text-xs sm:text-sm whitespace-nowrap min-w-16 sm:min-w-20">
              {{ texts[lang].adminDashboard.providers.viewModal.teamSize }}
            </th>
            <th class="py-2 sm:py-3 px-2 sm:px-3 text-center text-xs sm:text-sm whitespace-nowrap min-w-14 sm:min-w-16">
              {{ texts[lang].adminDashboard.providers.orders }}
            </th>
            <th class="py-2 sm:py-3 px-2 sm:px-4 text-center text-xs sm:text-sm whitespace-nowrap">
              {{ texts[lang].adminDashboard.providers.status }}
            </th>
            <th class="py-2 sm:py-3 px-1 sm:px-2 text-center text-xs sm:text-sm whitespace-nowrap">
              {{ texts[lang].adminDashboard.providers.actions }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="company in filteredCompanies"
            :key="company.id"
            class="border-t border-gray-200 dark:border-gray-700 hover:bg-[#f3f9fc] dark:hover:bg-gray-500 transition"
          >
            <td class="py-2 sm:py-3 px-1 sm:px-2">
              <div
                class="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-[#dedede] dark:bg-gray-800 border-2 border-[#5984C6] dark:border-[#8db4ff] overflow-hidden flex items-center justify-center text-[#5984C6] font-semibold hover:scale-110 transition-transform duration-200"
              >
                <img
                  :src="company.logoImage || getProviderImage(company) || defaultAvatar"
                  alt="logo"
                  class="h-full w-full object-contain"
                  @error="onImgError"
                />
              </div>
            </td>

            <td class="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">{{ company.name }}</td>
            <td class="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">{{ company.email }}</td>
            <td class="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">{{ company.phone || '-' }}</td>
            <td class="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">{{ formatCity(company) }}</td>

            <td class="py-2 sm:py-3 px-2 sm:px-3 flex items-center justify-center whitespace-nowrap">
              <span class="text-xs sm:text-sm">{{ company.rating ?? 0 }}</span>
              <i class="bi bi-star-fill text-yellow-400 text-sm ml-1"></i>
            </td>

            <td class="py-2 sm:py-3 px-2 sm:px-3 text-center text-xs sm:text-sm whitespace-nowrap">
              {{ company.teamSize ?? 0 }}
            </td>

            <td class="py-2 sm:py-3 px-2 sm:px-3 text-center text-xs sm:text-sm whitespace-nowrap">{{ company.orderCount ?? 0 }}</td>

            <td class="py-2 sm:py-3 px-2 sm:px-4 text-center">
              <span
                :class="[
                  'px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap inline-block',
                  company.status === 'banned'
                    ? 'bg-red-100 text-red-600'
                    : company.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'bg-green-100 text-green-600'
                ]"
              >
                {{
                  company.status === 'banned'
                    ? texts[lang].adminDashboard.providers.banned
                    : company.status === 'pending'
                    ? texts[lang].adminDashboard.providers.pending
                    : texts[lang].adminDashboard.providers.active
                }}
              </span>
            </td>

            <td class="py-2 sm:py-3 px-1 sm:px-2 flex justify-center space-x-1">
              <button
                @click="viewProvider(company)"
                class="p-1 sm:p-2 rounded-lg text-blue-500 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900 transition"
                :title="texts[lang].adminDashboard.providers.view"
              >
                <i class="bi bi-eye text-sm sm:text-base"></i>
              </button>

              <div class="h-5 border-l border-gray-300 dark:border-gray-600 mt-1 sm:mt-3"></div>

              <button
                @click="openEditModal(company)"
                class="p-1 sm:p-2 rounded-lg text-yellow-500 hover:bg-yellow-100 dark:text-yellow-400 dark:hover:bg-yellow-900/30 transition"
                :title="texts[lang].adminDashboard.providers.edit"
              >
                <i class="bi bi-pencil text-sm sm:text-base"></i>
              </button>

              <div class="h-5 border-l border-gray-300 dark:border-gray-600 mt-1 sm:mt-3"></div>

              <button
                v-if="company.status !== 'banned'"
                @click="openSuspendModal(company)"
                class="p-1 sm:p-2 rounded-lg text-red-500 hover:bg-orange-100 dark:text-red-400 dark:hover:bg-red-900/30 transition"
                :title="texts[lang].adminDashboard.providers.suspend"
              >
                <i class="bi bi-slash-circle text-sm sm:text-base"></i>
              </button>

              <button
                v-else
                @click="openReactivateModal(company)"
                class="p-1 sm:p-2 rounded-lg text-green-500 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/30 transition"
                :title="texts[lang].adminDashboard.providers.reactivate"
              >
                <i class="bi bi-check-circle text-sm sm:text-base"></i>
              </button>

              <div class="h-5 border-l border-gray-300 dark:border-gray-600 mt-1 sm:mt-3"></div>

              <button
                @click="openDeleteModal(company)"
                class="p-1 sm:p-2 rounded-lg text-red-500 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30 transition"
                :title="texts[lang].adminDashboard.providers.delete"
              >
                <i class="bi bi-trash text-sm sm:text-base"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div
        v-if="filteredCompanies.length === 0"
        class="text-center py-6 text-gray-500 dark:text-gray-300"
      >
        {{ texts[lang].adminDashboard.providers.noProvidersYet }}
      </div>
    </div>

    <!-- Companies Cards - Mobile -->
    <div v-if="activeTab === 'company'" class="md:hidden space-y-4">
      <div
        v-for="company in filteredCompanies"
        :key="company.id"
        class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm"
      >
        <div class="flex justify-between items-start mb-3">
          <div class="flex items-center space-x-3">
            <div
              class="h-12 w-12 rounded-full bg-[#dedede] dark:bg-gray-800 border-2 border-[#5984C6] dark:border-[#8db4ff] overflow-hidden flex items-center justify-center text-[#5984C6] font-semibold"
            >
              <img
                :src="company.logoImage || getProviderImage(company) || defaultAvatar"
                alt="logo"
                class="h-full w-full object-contain"
                @error="onImgError"
              />
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-gray-100">{{ company.name }}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-300">{{ company.email }}</p>
            </div>
          </div>
          <span
            :class="[
              'px-2 py-1 rounded-full text-xs font-semibold',
              company.status === 'banned'
                ? 'bg-red-100 text-red-600'
                : company.status === 'pending'
                ? 'bg-yellow-100 text-yellow-600'
                : 'bg-green-100 text-green-600'
            ]"
          >
            {{
              company.status === 'banned'
                ? texts[lang].adminDashboard.providers.banned
                : company.status === 'pending'
                ? texts[lang].adminDashboard.providers.pending
                : texts[lang].adminDashboard.providers.active
            }}
          </span>
        </div>

        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">{{ texts[lang].adminDashboard.providers.phone }}:</span>
            <span class="font-medium">{{ company.phone || '-' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">{{ texts[lang].adminDashboard.providers.address }}:</span>
            <span class="font-medium">{{ formatCity(company) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">{{ texts[lang].adminDashboard.providers.rating }}:</span>
            <span class="font-medium flex items-center gap-1">{{ company.rating ?? 0 }} <i class="bi bi-star-fill text-yellow-400"></i></span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">{{ texts[lang].adminDashboard.providers.viewModal.teamSize }}:</span>
            <span class="font-medium">{{ company.teamSize ?? 0 }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">{{ texts[lang].adminDashboard.providers.orders }}:</span>
            <span class="font-medium">{{ company.orderCount ?? 0 }}</span>
          </div>
        </div>

        <div class="flex justify-end space-x-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <button
            @click="viewProvider(company)"
            class="p-2 text-blue-500 hover:bg-blue-100 rounded-lg"
          >
            <i class="bi bi-eye"></i>
          </button>
          <button
            @click="openEditModal(company)"
            class="p-2 text-yellow-500 hover:bg-yellow-100 rounded-lg"
          >
            <i class="bi bi-pencil"></i>
          </button>
          <button
            v-if="company.status !== 'banned'"
            @click="openSuspendModal(company)"
            class="p-2 text-red-500 hover:bg-orange-100 rounded-lg"
          >
            <i class="bi bi-slash-circle"></i>
          </button>
          <button
            v-else
            @click="openReactivateModal(company)"
            class="p-2 text-green-500 hover:bg-green-100 rounded-lg"
          >
            <i class="bi bi-check-circle"></i>
          </button>
          <button
            @click="openDeleteModal(company)"
            class="p-2 text-red-500 hover:bg-red-100 rounded-lg"
          >
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    </div>

        <!-- Craftsmen Table -->
    <div
      v-else
      class="hidden md:block overflow-x-auto rounded-lg border border-gray-200 dark:border-gray-700"
    >
      <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 p-2 sm:p-4 gap-2">
        <h3 class="text-lg sm:text-xl font-semibold text-gray-800 dark:text-gray-100">
          {{ texts[lang].adminDashboard.providers.allCraftsmen }}
        </h3>

        <button
          @click="toggleSort('createdAt')"
          class="flex items-center justify-center gap-1 px-4 py-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-md transition w-full sm:w-auto"
        >
          {{ texts[lang].adminDashboard.providers.sortByCreated }}
          <svg
            :class="['w-4 h-4 transition-transform', sortOrder === 'asc' ? 'rotate-180' : '']"
            fill="none" stroke="currentColor" viewBox="0 0 24 24"
          >
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M5 15l7-7 7 7"
            ></path>
          </svg>
        </button>
      </div>

      <table class="min-w-full text-xs sm:text-sm text-gray-700 dark:text-gray-200">
        <thead class="bg-[#5984C6] text-white">
          <tr>
            <th class="py-2 sm:py-3 px-1 sm:px-2 text-center text-xs sm:text-sm whitespace-nowrap w-12 sm:w-16">
              {{ texts[lang].adminDashboard.providers.profile }}
            </th>
            <th class="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs sm:text-sm whitespace-nowrap">
              {{ texts[lang].adminDashboard.providers.name }}
            </th>
            <th class="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs sm:text-sm whitespace-nowrap">
              {{ texts[lang].adminDashboard.providers.email }}
            </th>
            <th class="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs sm:text-sm whitespace-nowrap">
              {{ texts[lang].adminDashboard.providers.phone }}
            </th>
            <th class="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs sm:text-sm whitespace-nowrap">
              {{ texts[lang].adminDashboard.providers.address }}
            </th>
            <th class="py-2 sm:py-3 px-2 sm:px-4 text-left text-xs sm:text-sm whitespace-nowrap">
              {{ texts[lang].adminDashboard.providers.skill }}
            </th>
            <th class="py-2 sm:py-3 px-2 sm:px-3 text-center text-xs sm:text-sm whitespace-nowrap min-w-14 sm:min-w-16">
              {{ texts[lang].adminDashboard.providers.rating }}
            </th>
            <th class="py-2 sm:py-3 px-2 sm:px-3 text-center text-xs sm:text-sm whitespace-nowrap min-w-14 sm:min-w-16">
              {{ texts[lang].adminDashboard.providers.orders }}
            </th>
            <th class="py-2 sm:py-3 px-2 sm:px-4 text-center text-xs sm:text-sm whitespace-nowrap">
              {{ texts[lang].adminDashboard.providers.status }}
            </th>
            <th class="py-2 sm:py-3 px-1 sm:px-2 text-center text-xs sm:text-sm whitespace-nowrap">
              {{ texts[lang].adminDashboard.providers.actions }}
            </th>
          </tr>
        </thead>

        <tbody>
          <tr
            v-for="craft in filteredCraftsmen"
            :key="craft.id"
            class="border-t border-gray-200 dark:border-gray-700 hover:bg-[#f3f9fc] dark:hover:bg-gray-500 transition"
          >
            <td class="py-2 sm:py-3 px-1 sm:px-2">
              <div
                class="h-8 w-8 sm:h-10 sm:w-10 rounded-full bg-[#e8f0fe] dark:bg-gray-800 border-2 border-[#5984C6] dark:border-[#8db4ff] overflow-hidden flex items-center justify-center text-[#5984C6] font-semibold hover:scale-110 transition-transform duration-200"
              >
                <img
                  :src="getProviderImage(craft) || defaultAvatar"
                  alt="avatar"
                  class="h-full w-full object-cover"
                  @error="onImgError"
                />
              </div>
            </td>

            <td class="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">{{ craft.name }}</td>
            <td class="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">{{ craft.email }}</td>
            <td class="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">{{ craft.phone || '-' }}</td>
            <td class="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">{{ formatCity(craft) }}</td>
            <td class="py-2 sm:py-3 px-2 sm:px-4 text-xs sm:text-sm">{{ craft.skill || '-' }}</td>

            <td class="py-2 sm:py-3 px-2 sm:px-3 flex items-center justify-center whitespace-nowrap">
              <span class="text-xs sm:text-sm">{{ craft.rating ?? 0 }}</span>
              <i class="bi bi-star-fill text-yellow-400 text-sm ml-1"></i>
            </td>

            <td class="py-2 sm:py-3 px-2 sm:px-3 text-center text-xs sm:text-sm whitespace-nowrap">{{ craft.orderCount ?? 0 }}</td>

            <td class="py-2 sm:py-3 px-2 sm:px-4 text-center">
              <span
                :class="[
                  'px-2 sm:px-3 py-1 rounded-full text-xs font-semibold whitespace-nowrap inline-block',
                  craft.status === 'banned'
                    ? 'bg-red-100 text-red-600'
                    : craft.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'bg-green-100 text-green-600'
                ]"
              >
                {{
                  craft.status === 'banned'
                    ? texts[lang].adminDashboard.providers.banned
                    : craft.status === 'pending'
                    ? texts[lang].adminDashboard.providers.pending
                    : texts[lang].adminDashboard.providers.active
                }}
              </span>
            </td>

            <td class="py-2 sm:py-3 px-1 sm:px-2 flex justify-center space-x-1">
              <button
                @click="viewProvider(craft)"
                class="p-1 sm:p-2 rounded-lg text-blue-500 hover:bg-blue-100 dark:text-blue-400 dark:hover:bg-blue-900 transition"
                :title="texts[lang].adminDashboard.providers.view"
              >
                <i class="bi bi-eye text-sm sm:text-base"></i>
              </button>

              <div class="h-5 border-l border-gray-300 dark:border-gray-600 mt-1 sm:mt-3"></div>

              <button
                @click="openEditModal(craft)"
                class="p-1 sm:p-2 rounded-lg text-yellow-500 hover:bg-yellow-100 dark:text-yellow-400 dark:hover:bg-yellow-900/30 transition"
                :title="texts[lang].adminDashboard.providers.edit"
              >
                <i class="bi bi-pencil text-sm sm:text-base"></i>
              </button>

              <div class="h-5 border-l border-gray-300 dark:border-gray-600 mt-1 sm:mt-3"></div>

              <button
                v-if="craft.status !== 'banned'"
                @click="openSuspendModal(craft)"
                class="p-1 sm:p-2 rounded-lg text-red-500 hover:bg-orange-100 dark:text-red-400 dark:hover:bg-red-900/30 transition"
                :title="texts[lang].adminDashboard.providers.suspend"
              >
                <i class="bi bi-slash-circle text-sm sm:text-base"></i>
              </button>

              <button
                v-else
                @click="openReactivateModal(craft)"
                class="p-1 sm:p-2 rounded-lg text-green-500 hover:bg-green-100 dark:text-green-400 dark:hover:bg-green-900/30 transition"
                :title="texts[lang].adminDashboard.providers.reactivate"
              >
                <i class="bi bi-check-circle text-sm sm:text-base"></i>
              </button>

              <div class="h-5 border-l border-gray-300 dark:border-gray-600 mt-1 sm:mt-3"></div>

              <button
                @click="openDeleteModal(craft)"
                class="p-1 sm:p-2 rounded-lg text-red-500 hover:bg-red-100 dark:text-red-400 dark:hover:bg-red-900/30 transition"
                :title="texts[lang].adminDashboard.providers.delete"
              >
                <i class="bi bi-trash text-sm sm:text-base"></i>
              </button>
            </td>
          </tr>
        </tbody>
      </table>

      <div
        v-if="filteredCraftsmen.length === 0"
        class="text-center py-6 text-gray-500 dark:text-gray-300"
      >
        {{ texts[lang].adminDashboard.providers.noProvidersYet }}
      </div>
    </div>

    <!-- Craftsmen Cards - Mobile -->
    <div v-if="activeTab === 'craftsmen'" class="md:hidden space-y-4">
      <div
        v-for="craft in filteredCraftsmen"
        :key="craft.id"
        class="bg-white dark:bg-gray-800 rounded-lg p-4 border border-gray-200 dark:border-gray-700 shadow-sm"
      >
        <div class="flex justify-between items-start mb-3">
          <div class="flex items-center space-x-3">
            <div
              class="h-12 w-12 rounded-full bg-[#e8f0fe] dark:bg-gray-800 border-2 border-[#5984C6] dark:border-[#8db4ff] overflow-hidden flex items-center justify-center text-[#5984C6] font-semibold"
            >
              <img
                :src="getProviderImage(craft) || defaultAvatar"
                alt="avatar"
                class="h-full w-full object-cover"
                @error="onImgError"
              />
            </div>
            <div>
              <h3 class="font-semibold text-gray-900 dark:text-gray-100">{{ craft.name }}</h3>
              <p class="text-sm text-gray-600 dark:text-gray-300">{{ craft.email }}</p>
            </div>
          </div>
          <span
            :class="[
              'px-2 py-1 rounded-full text-xs font-semibold',
              craft.status === 'banned'
                ? 'bg-red-100 text-red-600'
                : craft.status === 'pending'
                ? 'bg-yellow-100 text-yellow-600'
                : 'bg-green-100 text-green-600'
            ]"
          >
            {{
              craft.status === 'banned'
                ? texts[lang].adminDashboard.providers.banned
                : craft.status === 'pending'
                ? texts[lang].adminDashboard.providers.pending
                : texts[lang].adminDashboard.providers.active
            }}
          </span>
        </div>

        <div class="space-y-2 text-sm">
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">{{ texts[lang].adminDashboard.providers.phone }}:</span>
            <span class="font-medium">{{ craft.phone || '-' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">{{ texts[lang].adminDashboard.providers.address }}:</span>
            <span class="font-medium truncate max-w-[60%]" :title="formatAddressShort(craft)">{{ formatAddressShort(craft) }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">{{ texts[lang].adminDashboard.providers.skill }}:</span>
            <span class="font-medium">{{ craft.skill || '-' }}</span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">{{ texts[lang].adminDashboard.providers.rating }}:</span>
            <span class="font-medium flex items-center gap-1">{{ craft.rating ?? 0 }} <i class="bi bi-star-fill text-yellow-400"></i></span>
          </div>
          <div class="flex justify-between">
            <span class="text-gray-600 dark:text-gray-400">{{ texts[lang].adminDashboard.providers.orders }}:</span>
            <span class="font-medium">{{ craft.orderCount ?? 0 }}</span>
          </div>
        </div>

        <div class="flex justify-end space-x-2 mt-4 pt-3 border-t border-gray-200 dark:border-gray-700">
          <button
            @click="viewProvider(craft)"
            class="p-2 text-blue-500 hover:bg-blue-100 rounded-lg"
          >
            <i class="bi bi-eye"></i>
          </button>
          <button
            @click="openEditModal(craft)"
            class="p-2 text-yellow-500 hover:bg-yellow-100 rounded-lg"
          >
            <i class="bi bi-pencil"></i>
          </button>
          <button
            v-if="craft.status !== 'banned'"
            @click="openSuspendModal(craft)"
            class="p-2 text-red-500 hover:bg-orange-100 rounded-lg"
          >
            <i class="bi bi-slash-circle"></i>
          </button>
          <button
            v-else
            @click="openReactivateModal(craft)"
            class="p-2 text-green-500 hover:bg-green-100 rounded-lg"
          >
            <i class="bi bi-check-circle"></i>
          </button>
          <button
            @click="openDeleteModal(craft)"
            class="p-2 text-red-500 hover:bg-red-100 rounded-lg"
          >
            <i class="bi bi-trash"></i>
          </button>
        </div>
      </div>
    </div>

    <!-- CONFIRMATION MODALS -->
    <div
      v-if="showDeleteModal || showSuspendModal || showReactivateModal"
      class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <!-- Delete Modal -->
      <div
        v-if="showDeleteModal"
        class="bg-white dark:bg-[#111827] dark:text-gray-100 rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-fadeIn"
      >
        <h3 class="text-xl font-semibold text-red-600 mb-4">
          {{ texts[lang].adminDashboard.providers.deleteProvider }}
        </h3>

        <p class="text-gray-600 dark:text-gray-300 mb-6">
          {{ texts[lang].adminDashboard.providers.confirmDelete }}
          "<strong>{{ selectedActionProvider?.name }}</strong>"?
        </p>

        <div class="flex justify-center space-x-4">
          <button
            @click="confirmDelete"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
          >
            {{ texts[lang].adminDashboard.providers.delete }}
          </button>

          <button
            @click="closeModals"
            class="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-gray-100 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            {{ texts[lang].adminDashboard.providers.cancel }}
          </button>
        </div>
      </div>

      <!-- Suspend Modal -->
      <div
        v-if="showSuspendModal"
        class="bg-white dark:bg-[#111827] dark:text-gray-100 rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-fadeIn"
      >
        <h3 class="text-xl font-semibold text-red-600 mb-4">
          {{ texts[lang].adminDashboard.providers.suspendProvider }}
        </h3>

        <p class="text-gray-600 dark:text-gray-300 mb-6">
          {{ texts[lang].adminDashboard.providers.confirmSuspend }}
          "<strong>{{ selectedActionProvider?.name }}</strong>"?
        </p>

        <div class="flex justify-center space-x-4">
          <button
            @click="confirmSuspend"
            class="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-600"
          >
            {{ texts[lang].adminDashboard.providers.suspend }}
          </button>

          <button
            @click="closeModals"
            class="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-gray-100 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            {{ texts[lang].adminDashboard.providers.cancel }}
          </button>
        </div>
      </div>

            <!-- Reactivate Modal -->
      <div
        v-if="showReactivateModal"
        class="bg-white dark:bg-[#111827] dark:text-gray-100 rounded-2xl shadow-xl w-full max-w-sm p-6 text-center animate-fadeIn"
      >
        <h3 class="text-xl font-semibold text-green-600 mb-4">
          {{ texts[lang].adminDashboard.providers.reactivateProvider }}
        </h3>

        <p class="text-gray-600 dark:text-gray-300 mb-6">
          {{ texts[lang].adminDashboard.providers.confirmReactivate }}
          "<strong>{{ selectedActionProvider?.name }}</strong>"?
        </p>

        <div class="flex justify-center space-x-4">
          <button
            @click="confirmReactivate"
            class="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
          >
            {{ texts[lang].adminDashboard.providers.reactivate }}
          </button>

          <button
            @click="closeModals"
            class="px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-gray-100 rounded-md hover:bg-gray-300 dark:hover:bg-gray-600"
          >
            {{ texts[lang].adminDashboard.providers.cancel }}
          </button>
        </div>
      </div>
    </div>

    <!-- VIEW MODAL -->
    <div
      v-if="showViewModal"
      class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div
        class="relative bg-white dark:bg-[#111827] dark:text-gray-100 rounded-2xl shadow-xl w-full max-w-lg max-h-[90vh] overflow-y-auto p-6 animate-fadeIn"
      >
        <button
          @click="closeViewModal"
          class="absolute top-4 right-2 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 z-10"
        >
          ✖
        </button>

        <div class="flex items-center gap-4 mb-4">
          <div
            class="h-16 w-16 rounded-full bg-[#e8f0fe] dark:bg-gray-800 border-2 border-[#5984C6] dark:border-[#8db4ff] overflow-hidden flex items-center justify-center text-[#5984C6] text-xl font-semibold"
          >
            <img
              :src="getProviderImage(selectedProvider) || defaultAvatar"
              alt="avatar"
              :class="selectedProvider?.skill ? 'h-full w-full object-cover' : 'h-full w-full object-contain'"
              @error="onImgError"
            />
          </div>

          <div class="flex-1 min-w-0">
            <h3 class="text-2xl font-semibold text-[#5984C6] truncate">
              {{ selectedProvider?.name || 'Provider' }}
            </h3>

            <div class="mt-1">
              <span
                :class="[
                  'px-2 py-1 rounded-full text-xs font-semibold',
                  selectedProvider?.status === 'banned'
                    ? 'bg-red-100 text-red-600'
                    : selectedProvider?.status === 'pending'
                    ? 'bg-yellow-100 text-yellow-600'
                    : 'bg-green-100 text-green-600'
                ]"
              >
                {{
                  selectedProvider?.status === 'banned'
                    ? texts[lang].adminDashboard.providers.banned
                    : selectedProvider?.status === 'pending'
                    ? texts[lang].adminDashboard.providers.pending
                    : texts[lang].adminDashboard.providers.active
                }}
              </span>
            </div>

            <p
              class="mt-1 text-xs text-gray-500 dark:text-gray-400 truncate"
            >
              <i class="bi bi-geo-alt-fill mr-1"></i>
              {{ formatAddress(selectedProvider) }}
            </p>
          </div>
        </div>

        <div
          class="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-700 dark:text-gray-300 text-sm"
        >
          <div>
            <p class="text-gray-500 dark:text-gray-400">
              {{ texts[lang].adminDashboard.providers.email }}
            </p>
            <p class="font-medium break-all">
              {{ selectedProvider?.email || '-' }}
            </p>
          </div>

          <div>
            <p class="text-gray-500 dark:text-gray-400">
              {{ texts[lang].adminDashboard.providers.phone }}
            </p>
            <p class="font-medium">
              {{ selectedProvider?.phone || '-' }}
            </p>
          </div>

          <div class="sm:col-span-2">
            <p class="text-gray-500 dark:text-gray-400">
              {{ texts[lang].adminDashboard.providers.address }}
            </p>
            <p class="font-medium wrap-break-word">
              {{ formatAddress(selectedProvider) }}
            </p>
          </div>

          <div>
            <p class="text-gray-500 dark:text-gray-400">
              {{ texts[lang].adminDashboard.providers.created }}
            </p>
            <p class="font-medium">
              {{
                selectedProvider?.createdAt
                  ? new Date(selectedProvider.createdAt).toLocaleString()
                  : '-'
              }}
            </p>
          </div>

          <div v-if="selectedProvider?.skill">
            <p class="text-gray-500 dark:text-gray-400">
              {{ texts[lang].adminDashboard.providers.skill }}
            </p>
            <p class="font-medium">
              {{ selectedProvider.skill }}
            </p>
          </div>

          <div v-if="selectedProvider?.rating !== undefined">
            <p class="text-gray-500 dark:text-gray-400">
              {{ texts[lang].adminDashboard.providers.rating }}
            </p>
            <p class="font-medium flex items-center gap-1">
              {{ selectedProvider.rating }}
              <i class="bi bi-star-fill text-yellow-400"></i>
            </p>
          </div>

          <div>
            <p class="text-gray-500 dark:text-gray-400">
              {{ texts[lang].adminDashboard.providers.orders }}
            </p>
            <p class="font-medium">
              {{ selectedProvider.orderCount ?? 0 }}
              {{ texts[lang].adminDashboard.providers.total }}
              ·
              {{ selectedProvider.completedCount ?? 0 }}
              {{ texts[lang].adminDashboard.providers.completed }}
            </p>
          </div>

          <div v-if="selectedProvider?.userType === 'company'">
            <p class="text-gray-500 dark:text-gray-400">
              {{ texts[lang].adminDashboard.providers.viewModal.teamSize }}
            </p>
            <p class="font-medium">{{ selectedProvider.teamSize ?? 0 }}</p>
          </div>
        </div>

        <!-- Craftsman ID Image -->
        <div
          v-if="selectedProvider?.skill && selectedProvider?.idCardImage"
          class="mt-4"
        >
          <h4
            class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2"
          >
            {{ texts[lang].adminDashboard.providers.viewModal.idCardImage }}
          </h4>

          <img
            :src="selectedProvider.idCardImage"
            alt="ID Card"
            class="w-full max-w-sm rounded-lg shadow-md"
          />
        </div>

        <!-- Company CRN Image -->
        <div
          v-if="selectedProvider?.userType === 'company' && selectedProvider?.crnImage"
          class="mt-4"
        >
          <h4
            class="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-2"
          >
            {{ texts[lang].adminDashboard.providers.viewModal.crnImage }}
          </h4>

          <div
            class="max-h-64 overflow-y-auto border border-gray-300 dark:border-gray-600 rounded-lg"
          >
            <img
              :src="selectedProvider.crnImage"
              alt="CRN"
              class="w-full rounded-lg"
            />
          </div>
        </div>
      </div>
    </div>

    <!-- EDIT MODAL -->
    <div
      v-if="showEditModal"
      class="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50"
    >
      <div
        class="relative bg-white dark:bg-[#111827] dark:text-gray-100 rounded-2xl shadow-xl w-full max-w-md p-6 animate-fadeIn"
      >
        <button
          @click="closeEditModal"
          class="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-600 hover:text-gray-800 dark:text-gray-300 dark:hover:text-gray-100 transition-colors duration-200"
          :title="texts[lang].adminDashboard.providers.close || 'Close'"
        >
          <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <h3
          class="text-2xl font-semibold text-[#5984C6] mb-4"
        >
          {{ texts[lang].adminDashboard.providers.editProvider }}
        </h3>

        <form @submit.prevent="saveProviderChanges" class="space-y-4">
          <div>
            <label class="block mb-1 font-medium text-gray-700 dark:text-gray-200">
              {{ texts[lang].adminDashboard.providers.name }}
            </label>
            <input
              v-model="editForm.name"
              type="text"
              class="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#5984C6]"
            />
          </div>

          <div>
            <label class="block mb-1 font-medium text-gray-700 dark:text-gray-200">
              {{ texts[lang].adminDashboard.providers.email }}
            </label>
            <input
              v-model="editForm.email"
              type="email"
              class="border border-gray-300 dark:border-gray-600 bg:white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#5984C6]"
            />
          </div>

          <div>
            <label class="block mb-1 font-medium text-gray-700 dark:text-gray-200">
              {{ texts[lang].adminDashboard.providers.phone }}
            </label>
            <input
              v-model="editForm.phone"
              type="text"
              class="border border-gray-300 dark:border-gray-600 bg:white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#5984C6]"
            />
          </div>

          <div>
            <label class="block mb-1 font-medium text-gray-700 dark:text-gray-200">
              {{ texts[lang].adminDashboard.providers.address }}
            </label>
            <input
              v-model="editForm.address"
              type="text"
              class="border border-gray-300 dark:border-gray-600 bg:white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#5984C6]"
            />
          </div>

          <div>
            <label class="block mb-1 font-medium text-gray-700 dark:text-gray-200">
              {{ texts[lang].adminDashboard.providers.status }}
            </label>

            <select
              v-model="editForm.status"
              class="border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-lg px-3 py-2 w-full focus:outline-none focus:ring-2 focus:ring-[#5984C6]"
            >
              <option value="active" class="text-green-600 dark:text-green-400">
                {{ texts[lang].adminDashboard.providers.active }}
              </option>
              <option value="banned" class="text-red-600 dark:text-red-400">
                {{ texts[lang].adminDashboard.providers.banned }}
              </option>
              <option value="pending" class="text-yellow-600 dark:text-yellow-400">
                {{ texts[lang].adminDashboard.providers.pending }}
              </option>
            </select>
          </div>

          <button
            type="submit"
            class="w-full bg-[#5984C6] text-white py-2 rounded-lg hover:bg-[#4968a0] dark:hover:bg-[#7ba3d6] transition-colors duration-200"
          >
            {{ texts[lang].adminDashboard.providers.saveChanges }}
          </button>
        </form>
      </div>
    </div>
</div>
</template>

<script setup>
import { ref, reactive, computed, onMounted, watch, onUnmounted } from "vue";
import { useRoute } from "vue-router";
import { db } from "../../firebase/firebase";
import { collection, onSnapshot, doc, updateDoc, deleteDoc, getDocs, query, where } from "firebase/firestore";

// ⭐ الترجمة الجديدة
import { useTestLang } from "@/langTest/useTestLang";
const { lang, texts } = useTestLang();

/* STATE */
const route = useRoute();
const searchTerm = ref("");
const activeTab = ref("company");
const loading = ref(true);
const sortKey = ref("createdAt");
const sortOrder = ref("desc");

const companies = ref([]);
const craftsmen = ref([]);
const filteredTechnicians = ref([]);

const showDeleteModal = ref(false);
const showSuspendModal = ref(false);
const showReactivateModal = ref(false);
const selectedActionProvider = ref(null);

const showViewModal = ref(false);
const showEditModal = ref(false);
const selectedProvider = ref(null);
const editForm = reactive({
  name: "",
  email: "",
  phone: "",
  address: "",
  status: "active",
});

/* FETCH PROVIDERS */
const fetchProviders = async () => {
  loading.value = true;
  try {
    const providersRef = collection(db, "technicians");
    const snapshot = await getDocs(providersRef);
    const allProviders = [];

    snapshot.forEach((d) => {
      const data = d.data() || {};
      allProviders.push({
        id: d.id,
        ...data,
        rating: data.ratingAverage !== undefined ? Number(data.ratingAverage) : (data.rating !== undefined ? Number(data.rating) : 0),
        ratingCount: Number(data.ratingCount || 0),
        orderCount: Number(data.orderCount || 0),
        completedCount: Number(data.completedCount || 0),
      });
    });

    const selectedCategory = route.query.category;

    if (selectedCategory) {
      if (selectedCategory.toLowerCase() === "finishing") {
        craftsmen.value = [];
        filteredTechnicians.value = [];
        activeTab.value = "company";
      } else {
        filteredTechnicians.value = allProviders.filter(
          (p) => p.skill && p.skill.toLowerCase() === selectedCategory.toLowerCase()
        );
        companies.value = [];
        activeTab.value = "craftsmen";
      }
    } else {
      filteredTechnicians.value = allProviders;
      activeTab.value = "company";
    }
  } catch (error) {
    console.error("Error fetching providers:", error);
  } finally {
    loading.value = false;
  }
};

/* ORDERS COUNT LOADER */
const fetchOrderCountsForProviderIds = async (ids = []) => {
  if (!ids || ids.length === 0) return {};
  const result = {};

  ids.forEach((id) => {
    result[id] = { orderCount: 0, completedCount: 0 };
  });

  const chunkSize = 10;
  for (let i = 0; i < ids.length; i += chunkSize) {
    const chunk = ids.slice(i, i + chunkSize);
    try {
      const ordersRef = collection(db, "orders");

      const qTotal = query(ordersRef, where("technicianId", "in", chunk));
      const snapTotal = await getDocs(qTotal);

      snapTotal.forEach((d) => {
        const data = d.data() || {};
        const pid = data.technicianId;
        if (pid && result[pid]) result[pid].orderCount++;
      });

      const qCompleted = query(
        ordersRef,
        where("technicianId", "in", chunk),
        where("status", "==", "completed")
      );
      const snapCompleted = await getDocs(qCompleted);

      snapCompleted.forEach((d) => {
        const data = d.data() || {};
        const pid = data.technicianId;
        if (pid && result[pid]) result[pid].completedCount++;
      });
    } catch (e) {
      console.error("Error fetching order counts for provider chunk:", e);
    }
  }

  return result;
};

/* COMPANIES REALTIME LISTENER */
onMounted(() => {
  const unsubCompanies = onSnapshot(
    collection(db, "companies"),
    async (snap) => {
      const list = [];

      snap.forEach((d) => {
        const data = d.data() || {};
        list.push({
          id: d.id,
          userType: "company",
          name: data.name || data.companyName || "",
          email: data.email || data.contact || "",
          phone: data.phone || "",
          address: data.address || "",
          status: data.status || "active",
          createdAt: data.createdAt || "",
          ...data,
          rating: data.ratingAverage !== undefined ? Number(data.ratingAverage) : (data.rating !== undefined ? Number(data.rating) : 0),
          ratingCount: Number(data.ratingCount || 0),
          orderCount: Number(data.orderCount || 0),
          completedCount: Number(data.completedCount || 0),
        });
      });

      companies.value = list;

      const ids = list.map((c) => c.id).filter(Boolean);
      if (ids.length) {
        try {
          const map = await fetchOrderCountsForProviderIds(ids);
          companies.value = companies.value.map((c) => ({
            ...c,
            orderCount: map[c.id]?.orderCount ?? c.orderCount,
            completedCount: map[c.id]?.completedCount ?? c.completedCount,
          }));
        } catch (e) {
          console.error("attach order count error:", e);
        }
      }
    },
    (err) => console.error(err)
  );

  fetchProviders();
});

/* TECHNICIANS REALTIME LISTENER */
onMounted(() => {
  const unsubTechnicians = onSnapshot(
    collection(db, "technicians"),
    async (snap) => {
      const allProviders = [];

      snap.forEach((d) => {
        const data = d.data() || {};
        allProviders.push({
          id: d.id,
          ...data,
          rating: data.ratingAverage !== undefined ? Number(data.ratingAverage) : (data.rating !== undefined ? Number(data.rating) : 0),
          ratingCount: Number(data.ratingCount || 0),
        });
      });

      const selectedCategory = route.query.category;

      if (selectedCategory) {
        if (selectedCategory.toLowerCase() === "finishing") {
          filteredTechnicians.value = [];
          activeTab.value = "company";
        } else {
          filteredTechnicians.value = allProviders
            .filter(
              (p) =>
                p.skill &&
                p.skill.toLowerCase() === selectedCategory.toLowerCase()
            )
            .map((p) => ({
              ...p,
              orderCount: Number(p.orderCount || 0),
              completedCount: Number(p.completedCount || 0),
            }));

          const ids = filteredTechnicians.value.map((p) => p.id);
          const map = await fetchOrderCountsForProviderIds(ids);

          filteredTechnicians.value = filteredTechnicians.value.map((p) => ({
            ...p,
            orderCount: map[p.id]?.orderCount ?? p.orderCount,
            completedCount: map[p.id]?.completedCount ?? p.completedCount,
          }));

          activeTab.value = "craftsmen";
        }
      } else {
        filteredTechnicians.value = allProviders.map((p) => ({
          ...p,
          orderCount: Number(p.orderCount || 0),
          completedCount: Number(p.completedCount || 0),
        }));

        const ids = filteredTechnicians.value.map((p) => p.id);
        const map = await fetchOrderCountsForProviderIds(ids);

        filteredTechnicians.value = filteredTechnicians.value.map((p) => ({
          ...p,
          orderCount: map[p.id]?.orderCount ?? p.orderCount,
          completedCount: map[p.id]?.completedCount ?? p.completedCount,
        }));
      }

      loading.value = false;
    },
    (err) => console.error("Error listening to technicians:", err)
  );

  return () => unsubTechnicians();
});

watch(
  () => route.query.category,
  () => fetchProviders()
);

/* COMPUTED FILTERS */
const filteredCompanies = computed(() => {
  let filtered = companies.value.filter((c) =>
    [c.name, c.email, c.phone, c.address]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.value.toLowerCase())
  );

  return filtered.sort((a, b) => {
    let aVal = a[sortKey.value];
    let bVal = b[sortKey.value];

    if (sortKey.value === "createdAt") {
      aVal = aVal ? new Date(aVal).getTime() : 0;
      bVal = bVal ? new Date(bVal).getTime() : 0;
    } else {
      aVal = (aVal ?? "").toString().toLowerCase();
      bVal = (bVal ?? "").toString().toLowerCase();
    }

    return sortOrder.value === "asc"
      ? aVal > bVal ? 1 : -1
      : aVal < bVal ? 1 : -1;
  });
});

const filteredCraftsmen = computed(() => {
  let filtered = filteredTechnicians.value.filter((c) =>
    [c.name, c.email, c.phone, c.address]
      .join(" ")
      .toLowerCase()
      .includes(searchTerm.value.toLowerCase())
  );

  return filtered.sort((a, b) => {
    let aVal = a[sortKey.value];
    let bVal = b[sortKey.value];

    if (sortKey.value === "createdAt") {
      aVal = aVal ? new Date(aVal).getTime() : 0;
      bVal = bVal ? new Date(bVal).getTime() : 0;
    } else {
      aVal = (aVal ?? "").toString().toLowerCase();
      bVal = (bVal ?? "").toString().toLowerCase();
    }

    return sortOrder.value === "asc"
      ? aVal > bVal ? 1 : -1
      : aVal < bVal ? 1 : -1;
  });
});

/* SORTING */
const toggleSort = (key) => {
  if (sortKey.value === key) {
    sortOrder.value = sortOrder.value === "asc" ? "desc" : "asc";
  } else {
    sortKey.value = key;
    sortOrder.value = "desc";
  }
};

/* ACTIONS */
const getCollectionName = (provider) => {
  if (provider.userType)
    return provider.userType === "company" ? "companies" : "technicians";
  if (provider.skill) return "technicians";
  return "companies";
};

const openDeleteModal = (p) => { selectedActionProvider.value = p; showDeleteModal.value = true; };
const openSuspendModal = (p) => { selectedActionProvider.value = p; showSuspendModal.value = true; };
const openReactivateModal = (p) => { selectedActionProvider.value = p; showReactivateModal.value = true; };
const closeModals = () => {
  showDeleteModal.value = false;
  showSuspendModal.value = false;
  showReactivateModal.value = false;
  selectedActionProvider.value = null;
};

const confirmDelete = async () => {
  if (!selectedActionProvider.value) return;
  try {
    await deleteDoc(doc(db, getCollectionName(selectedActionProvider.value), selectedActionProvider.value.id));
  } catch (err) {
    console.error(err);
  } finally {
    closeModals();
  }
};

const confirmSuspend = async () => {
  if (!selectedActionProvider.value) return;
  try {
    await updateDoc(doc(db, getCollectionName(selectedActionProvider.value), selectedActionProvider.value.id), { status: "banned" });
  } catch (err) {
    console.error(err);
  } finally {
    closeModals();
  }
};

const confirmReactivate = async () => {
  if (!selectedActionProvider.value) return;
  try {
    await updateDoc(doc(db, getCollectionName(selectedActionProvider.value), selectedActionProvider.value.id), { status: "active" });
  } catch (err) {
    console.error(err);
  } finally {
    closeModals();
  }
};

/* VIEW & EDIT */
const viewProvider = (provider) => { selectedProvider.value = provider; showViewModal.value = true; };
const closeViewModal = () => { showViewModal.value = false; selectedProvider.value = null; };

const openEditModal = (provider) => {
  selectedProvider.value = provider;
  editForm.name = provider.name || "";
  editForm.email = provider.email || "";
  editForm.phone = provider.phone || "";
  editForm.address = formatAddress(provider) || "";
  editForm.status = provider.status || "active";
  showEditModal.value = true;
};

const closeEditModal = () => {
  showEditModal.value = false;
  selectedProvider.value = null;
  editForm.name = "";
  editForm.email = "";
  editForm.phone = "";
  editForm.address = "";
  editForm.status = "active";
};

const saveProviderChanges = async () => {
  if (!selectedProvider.value) return;
  try {
    await updateDoc(doc(db, getCollectionName(selectedProvider.value), selectedProvider.value.id), {
      name: editForm.name,
      companyName: editForm.name,
      email: editForm.email,
      phone: editForm.phone,
      address: editForm.address,
      status: editForm.status,
    });
    closeEditModal();
  } catch (err) {
    console.error(err);
  }
};

/* HELPERS */
const getProviderImage = (p) =>
  p?.profileImage || p?.logoImage || p?.photoURL || p?.logo || p?.image || "";

const formatAddress = (p) => {
  if (!p) return "-";
  const addr = p.address;
  const parts = [];

  if (addr && typeof addr === "object") {
    if (addr.street) parts.push(addr.street);
    if (addr.city) parts.push(addr.city);
    if (addr.country) parts.push(addr.country);
  } else if (typeof addr === "string" && addr.trim()) {
    parts.push(addr.trim());
  }

  if (p.city && !parts.includes(p.city)) parts.push(p.city);
  return parts.length ? parts.join(", ") : "-";
};

/* Extract just the city for compact table display */
const formatCity = (p) => {
  if (!p) return "-";
  const addr = p.address;
  
  if (addr && typeof addr === "object") {
    if (addr.city) return addr.city;
  } else if (typeof addr === "string" && addr.trim()) {
    const parts = addr.split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length > 0) return parts[parts.length - 2] || parts[0];
  }
  
  if (p.city) return p.city;
  return "-";
};

/* Short address: prefer city + country for compact display */
const formatAddressShort = (p) => {
  if (!p) return "-";
  const addr = p.address;
  let city = "";
  let country = "";

  if (addr && typeof addr === "object") {
    if (addr.city) city = addr.city;
    if (addr.country) country = addr.country;
  } else if (typeof addr === "string" && addr.trim()) {
    const parts = addr.split(",").map((s) => s.trim()).filter(Boolean);
    if (parts.length >= 2) {
      country = parts[parts.length - 1];
      city = parts[parts.length - 2];
    } else if (parts.length === 1) {
      city = parts[0];
    }
  }

  if (!city && p.city) city = p.city;
  if (!country && p.country) country = p.country;

  const out = [];
  if (city) out.push(city);
  if (country) out.push(country);
  return out.length ? out.join(", ") : "-";
};

const defaultAvatar =
  'data:image/svg+xml;utf8,\
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">\
  <circle cx="32" cy="32" r="32" fill="%23e5e7eb"/>\
  <circle cx="32" cy="24" r="12" fill="%239ca3af"/>\
  <path d="M12 54c4-10 12-16 20-16s16 6 20 16" fill="%239ca3af"/>\
</svg>';

const onImgError = (e) => {
  if (e && e.target) e.target.src = defaultAvatar;
};

/* REALTIME ORDERS LISTENER */
const ordersCountsMap = ref({});
let ordersUnsubscribe = null;

onMounted(() => {
  try {
    ordersUnsubscribe = onSnapshot(
      collection(db, "orders"),
      (snap) => {
        const byTech = {};
        const byComp = {};

        snap.forEach((d) => {
          const data = d.data() || {};
          const tech = data.technicianId || null;
          const comp = data.companyId || data.providerId || data.providerID || null;

          if (tech) {
            if (!byTech[tech]) byTech[tech] = { orderCount: 0, completedCount: 0 };
            byTech[tech].orderCount++;
            if ((data.status || "").toLowerCase() === "completed")
              byTech[tech].completedCount++;
          }

          if (comp) {
            if (!byComp[comp]) byComp[comp] = { orderCount: 0, completedCount: 0 };
            byComp[comp].orderCount++;
            if ((data.status || "").toLowerCase() === "completed")
              byComp[comp].completedCount++;
          }
        });

        ordersCountsMap.value = { byTech, byComp };

        if (filteredTechnicians.value.length) {
          filteredTechnicians.value = filteredTechnicians.value.map((p) => ({
            ...p,
            orderCount: byTech[p.id]?.orderCount ?? p.orderCount,
            completedCount: byTech[p.id]?.completedCount ?? p.completedCount,
          }));
        }

        if (companies.value.length) {
          companies.value = companies.value.map((c) => ({
            ...c,
            orderCount: byComp[c.id]?.orderCount ?? c.orderCount,
            completedCount: byComp[c.id]?.completedCount ?? c.completedCount,
          }));
        }
      },
      (err) => console.error("Orders realtime error:", err)
    );
  } catch (e) {
    console.error("Failed to start orders realtime listener:", e);
  }
});

onUnmounted(() => {
  if (typeof ordersUnsubscribe === "function") ordersUnsubscribe();
});
</script>


<style scoped>
.animate-fadeIn { animation: fadeIn 0.2s ease-in-out; }
@keyframes fadeIn { from { opacity:0 } to { opacity:1 } }
</style>
