const axios = require('axios');
const cleaner = require('./synopsisCleaner');
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
    const cleanedSynposis = cleaner.cleaner(anime.description)
    if (anime.status === 'RELEASING') {
      // Calculate the time until the next episode airs
      const timeUntilAiring = anime.nextAiringEpisode.timeUntilAiring;
      const daysUntilAiring = Math.floor(timeUntilAiring / 86400);
      const hoursUntilAiring = Math.floor((timeUntilAiring % 86400) / 3600);
      const minutesUntilAiring = Math.floor((timeUntilAiring % 3600) / 60);

      return {
        id: anime.id,
        isAiring: true,
        latestEpisodeNumber: anime.nextAiringEpisode.episode - 1,
        nextEpisodeReleaseDate: `${daysUntilAiring} days, ${hoursUntilAiring} hours, ${minutesUntilAiring} minutes`,
        title: anime.title.romaji,
        animeUrl: anime.siteUrl,
        synopsis: cleanedSynposis,
        status: animeResponse.status
      };
    } else if (anime.status === 'FINISHED') {
      return {
        id: anime.id,
        isAiring: false,
        lastEpisodeNumber: anime.episodes,
        title: anime.title.romaji,
        animeUrl: anime.siteUrl,
        synopsis: cleanedSynposis,
        status: animeResponse.status
      };
    } else {
      return {
        id: anime.id,
        isAiring: false,
        lastEpisodeNumber: anime.episodes,
        title: anime.title.romaji,
        animeUrl: anime.siteUrl,
        synopsis: cleanedSynposis,
        status: animeResponse.status
      };
    }
  } catch (error) {
    console.error(error);
  }
}

module.exports = {
  request: request
};
