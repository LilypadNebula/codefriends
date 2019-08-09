<template>
  <div class="flex flex-col items-center md:items-start md:flex-row justify-between py-8 px-6">
    <div class="w-1/4 flex flex-col items-center">
      <div class="text-2xl p-4 border border-black rounded-full flex items-center">
        <input type="text" v-model="searchQuery" />
        <font-awesome-icon icon="search"></font-awesome-icon>
      </div>
      <button class="text-xl p-4 m-4 rounded bg-orange-400" @click="searchUsers">Search!</button>
      <p class="text-2xl text-center" v-if="peopleCount > 0">Results: {{peopleCount}}</p>
    </div>
    <div class="w-full md:w-2/3">
      <div v-if="loading" class="text-center">Loading...</div>
      <div v-else-if="!changing && people.length > 0" class="flex flex-wrap justify-between">
        <a
          v-for="person in shownPeople"
          :key="person.id"
          class="border border-gray-600 rounded-lg m-4 w-full md:w-2/5 text-lg md:text-xl shadow-md flex"
          :href="person.url"
        >
          <img
            class="w-2/5 rounded-l-lg"
            :src="person.avatarUrl"
            :alt="`Avatar for ${person.login}`"
          />
          <div class="flex flex-col items-center justify-between text-center w-3/5">
            <p>{{person.login}}</p>
            <p
              class="w-full break-words border-t border-b border-gray-400"
            >{{person.bio || "No bio"}}</p>
            <p>
              {{person.followers.totalCount}}
              <font-awesome-icon icon="user-friends"></font-awesome-icon>
            </p>
          </div>
        </a>
        <div class="flex w-full justify-center items-center">
          <button
            :class="page > 1 ? 'enabledButton' : 'disabledButton'"
            @click="page--"
            :disabled="page <= 1"
          >Prev</button>
          <p class="mx-8 text-xl">{{page}}</p>
          <button
            :class="page < people.length/10 ? 'enabledButton' : 'disabledButton'"
            @click="page++"
            :disabled="page >= people.length/10"
          >Next</button>
        </div>
      </div>
      <p v-else class="text-2xl text-center">Search for some users and they'll show up here!</p>
    </div>
  </div>
</template>

<script>
import ApolloClient from "apollo-boost";
import gql from "graphql-tag";

const client = new ApolloClient({
  uri: "https://api.github.com/graphql",
  request: operation => {
    operation.setContext({
      headers: {
        authorization: `Bearer ${process.env.VUE_APP_GITHUB_TOKEN}`
      }
    });
  }
});

export default {
  name: "app",
  data: () => ({
    searchQuery: "",
    loading: false,
    page: 1,
    changing: false,
    people: []
  }),
  computed: {
    peopleCount() {
      return this.people.length;
    },
    shownPeople() {
      let start = (this.page - 1) * 10;
      let end = start + 10;
      return this.people.slice(start, end);
    }
  },
  methods: {
    async searchUsers() {
      this.loading = true;
      try {
        const githubQuery = gql`
          query($searchTerm: String!) {
            search(type: USER, query: $searchTerm, first: 20) {
              nodes {
                ... on User {
                  login
                  email
                  followers {
                    totalCount
                  }
                  avatarUrl
                  bio
                  url
                }
              }
            }
          }
        `;
        let res = await client.query({
          query: githubQuery,
          variables: { searchTerm: this.searchQuery }
        });
        this.people = res.data.search.nodes;
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

.enabledButton {
  @apply p-2 rounded text-xl text-white bg-orange-600;
}

.disabledButton {
  @apply p-2 rounded text-xl text-gray-200 bg-gray-500;
}
</style>
