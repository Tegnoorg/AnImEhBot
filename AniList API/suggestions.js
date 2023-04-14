const axios = require('axios');

async function request(animeId) {
  try {
    // Get similar anime recommendations by ID
    const recommendationsResponse = await axios.post('https://graphql.anilist.co', {
      query: `
        query ($id: Int) {
          Recommendation(id: $id) {
            mediaId
            mediaRecommendationId
            userId
            rating
            onList
            rating_greater
            rating_lesser
            sort: []
                }
              }
      `,
      variables: {
        id: animeId
      }
    });

    // Get the recommendations from the response
    const recommendations = recommendationsResponse.data.data.Recommendation;
    const result = recommendations.map(rec => ({
      id: rec.node.mediaRecommendation.id,
      title: rec.node.mediaRecommendation.title.romaji,
      animeUrl: rec.node.mediaRecommendation.siteUrl,
      rating: rec.node.rating
    }));

    // Sort recommendations by rating in descending order
    console.log(recommendation);

    return result;
  } catch (error) {
    console.error(error);
  }
}
    request: 21
module.exports = {
  request: request
};
