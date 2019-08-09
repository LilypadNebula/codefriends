<template>
  <div class="flex flex justify-between py-32 container mx-auto">
    <div class="w-1/3 flex flex-col items-center">
      <div class="text-2xl p-4 border border-black rounded-full flex items-center">
        <input type="text" v-model="searchQuery" />
        <font-awesome-icon icon="search"></font-awesome-icon>
      </div>
      <button class="text-xl p-4 m-4 rounded bg-orange-400" @click="searchUsers">Search!</button>
    </div>
    <div class="w-1/3">
      <div v-if="loading">Loading...</div>
      <div v-else>
        <a
          v-for="person in people"
          :key="person.id"
          class="text-2xl p-8 flex justify-between items-center hover:bg-orange-200"
          :href="person.url"
        >
          <img
            :src="person.avatarUrl"
            class="h-16 w-16 rounded-full"
            :alt="`Avatar for ${person.login}`"
          />
          <span>{{person.login}}</span>
        </a>
      </div>
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
    people: []
  }),
  methods: {
    async searchUsers() {
      this.loading = true;
      // try {
      //   let res = await axios.get(
      //     `http://localhost:9000/query?search=${this.searchQuery}`
      //   );
      //   console.log(res);
      //   this.people = res.data.items;
      // } catch (err) {
      //   console.log(err);
      // } finally {
      //   this.loading = false;
      // }
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
      this.loading = false;
    }
  }
};
</script>

<style lang="postcss">
@tailwind base;

@tailwind components;

@tailwind utilities;
</style>
