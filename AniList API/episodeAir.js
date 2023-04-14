const axios = require('axios');

async function request(animeId) {
  try {
    // Get information about the anime by ID
    const animeResponse = await axios.post('https://graphql.anilist.co', {
      query: `
        query ($id: Int) {
          Media(id: $id, type: ANIME) {
            id
            title {
              romaji
            }
            status
            episodes
            nextAiringEpisode {
              episode
              timeUntilAiring
            }
            siteUrl
            description
          }
        }
      `,
      variables: {
        id: animeId
      }
    });

    // Get the anime information from the response
    const anime = animeResponse.data.data.Media;
    //console.log(anime);

    if (anime.status === 'RELEASING') {
      // Calculate the time until the next episode airs
      const timeUntilAiring = anime.nextAiringEpisode.timeUntilAiring;
      const daysUntilAiring = Math.floor(timeUntilAiring / 86400);
      const hoursUntilAiring = Math.floor((timeUntilAiring % 86400) / 3600);
      const minutesUntilAiring = Math.floor((timeUntilAiring % 3600) / 60);

      return {
        isAiring: true,
        latestEpisodeNumber: anime.nextAiringEpisode.episode - 1,
        nextEpisodeReleaseDate: `${daysUntilAiring} days, ${hoursUntilAiring} hours, ${minutesUntilAiring} minutes`,
        title: anime.title.romaji,
        animeUrl: anime.siteUrl,
        synopsis: anime.description
      };
    } else if (anime.status === 'FINISHED') {
      return {
        isAiring: false,
        lastEpisodeNumber: anime.episodes,
        title: anime.title.romaji,
        animeUrl: anime.siteUrl
      };
    } else {
      return {
        isAiring: false,
        lastEpisodeNumber: anime.episodes,
        title: anime.title.romaji,
        animeUrl: anime.siteUrl
      };
    }
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  request: request
};
