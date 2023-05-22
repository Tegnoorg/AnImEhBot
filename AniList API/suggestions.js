const axios = require('axios');

async function request(searchQuery, type) {
  try {
    // Get similar anime recommendations by ID
    const recommendationsResponse = await axios.post('https://graphql.anilist.co', {
      query: `
      query ($search: String) {
        Page {
          media(search: $search, type: ANIME) {
            recommendations {
              edges {
                node {
                  mediaRecommendation {
                    title {
                      romaji
                    }
                  }
                }
              }
            }
          }
        }
      }
      `,
      variables : {
        search: searchQuery,
        type: type
    }
    });

    // Get the recommendations from the response
    const recommendations = recommendationsResponse.data.data.Recommendation;
    const result = recommendations.map(rec => ({
      recommendations: rec.node.mediaRecommendation.page,
    }));

    // Sort recommendations by rating in descending order
    console.log(recommendations);

    return result;
  } catch (error) {
    console.error(error);
  }
}
  request("one piece", 'ANIME');
module.exports = {
  request: request
};
