import ApolloClient from 'apollo-boost'
import gql from 'graphql-tag'

const client = new ApolloClient({
  uri: 'https://api.github.com/graphql',
  headers: { Authorization: `bearer ${process.env.GITHUB_TOKEN}` }
})

require('dotenv').config()

exports.handler = async (event) => {
  let searchTerm = event.queryStringParameters.search;
  const githubQuery = gql`query($searchTerm:String!){ 
    search(type:USER,query:$searchTerm,first:20){
      nodes{
        ...on User{
          name
          email
          followers{totalCount}
          avatarUrl
          bio
          url
        }
      }
    }
  }`
  console.log(githubQuery)
  let res = await client.query({ query: githubQuery, variables: { searchTerm } })
  console.log(res)
  const statusCode = 200;
  const headers = {
    "Access-Control-Allow-Origin": "*"
  }
  return {
    statusCode,
    headers,
    body: JSON.stringify(res)
  }
}