const axios = require('axios');

// Function to recommend anime based on a given anime ID
async function request(animeId) {
  try {
    // Query for the anime details
    const query = `
      query ($id: Int) {
        Media (id: $id, type: ANIME) {
          recommendations {
            edges {
              node {
                mediaRecommendation {
                  id
                }
              }
            }
          }
        }
      }
    `;

    // Make the API request
    const response = await axios.post('https://graphql.anilist.co', {
      query: query,
      variables: {
        id: animeId
      }
    });

    // Extract the recommended anime IDs from the response
    const recommendations = response.data.data.Media.recommendations.edges;
    const recommendedAnimeIds = recommendations.map(
      edge => edge.node.mediaRecommendation.id
    );

    return recommendedAnimeIds;
  } catch (error) {
    console.error('Error fetching anime recommendations:', error);
    return [];
  }
}



module.exports = {
    request: request
  };
  