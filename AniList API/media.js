const axios = require('axios');

function request(searchQuery, type) {
    const query = `
      query ($search: String, $type: MediaType) {
        Media(search: $search, type: $type) {
          id
          siteUrl
        }
      }
    `;
    const variables = {
        search: searchQuery,
        type: type,
    };
    const url = 'https://graphql.anilist.co/';
    return axios.post(url, {
            query: query,
            variables: variables,
        }, {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
            },
        })
        .then(response => response.data.data.Media.id)
        .catch(error => {
            console.error(error);
            throw new Error('An error occurred while fetching the anime ID');
        });
}

module.exports = {
  request: request
};