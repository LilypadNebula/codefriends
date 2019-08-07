<template>
  <div class="flex flex-col items-center p-32">
    <input type="text" class="text-2xl p-4 border border-black rounded-lg" v-model="searchQuery" />
    <button class="text-xl p-4 rounded bg-orange-400" @click="searchUsers">Search!</button>
    <div v-if="loading">Loading...</div>
    <div class="h-64 overflow-auto" v-else>
      <p
        class="text-xl p-2 border-b border-black"
        v-for="person in people"
        :key="person.id"
      >{{person.login}}</p>
    </div>
  </div>
</template>

<script>
import axios from "axios";

export default {
  name: "app",
  data: () => ({
    searchQuery: "",
    loading: false,
    people: []
  }),
  methods: {
    async searchUsers() {
      this.loading = true;
      try {
        let { data } = await axios.get(
          `https://api.github.com/search/users?q=${this.searchQuery}`
        );
        this.people = data.items;
      } catch (err) {
        console.log(err);
      } finally {
        this.loading = false;
      }
    }
  }
};
</script>

<style lang="postcss">
@tailwind base;

@tailwind components;

@tailwind utilities;
</style>
