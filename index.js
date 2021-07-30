const express = require('express');
const { graphqlHTTP } = require('express-graphql');
const { graphql, buildSchema } = require('graphql');
const axios = require('axios');
const cors = require('cors');


var schema = buildSchema(`
  type Query {
    getContributors(owner:String,repo: String): [Contributors]
  }

  type Mutation{
     
      getContributors(owner:String,repo: String): [Contributors]
  }
  
  type Contributors{
      login: String,
      contributions:Int
  }
`);


// root resolver
var root = {
   

    // getRepo: async ({owner,repo}) =>{
    //   let responce = await axios.get('https://api.github.com/repos/vuejs/vuefire',{
    //     headers: { 'accept' : 'application/vnd.github.v3+json' }
    //   });
    //   const data = {
    //      id:  responce.data.id,
    //      name: responce.data.name
    //     }
    //     console.log(responce.data.id);
    //  return data;
    // },
    getContributors: async ({owner, repo}) =>{
    try{
      let responce  = await axios.get(`https://api.github.com/repos/${owner}/${repo}/contributors?per_page=50`);
     const newdata =responce.data.map((cotributor) =>{
        const login  =cotributor.login;
        const contributions = cotributor.contributions;
        const data = {login,contributions}
        return data
     })
     return newdata;
    } catch(err){
       return err;
    }
    },



};


const app = express();
app.use(cors());

app.use(
  '/graphql',
  graphqlHTTP({
    schema,
    rootValue: root,
    graphiql: true,
  }),
);



app.listen({ port: 4000 }, () =>
console.log('Now browse to http://localhost:4000')
);
