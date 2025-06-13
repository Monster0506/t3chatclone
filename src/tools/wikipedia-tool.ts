import { tool } from 'ai';
import { z } from 'zod';

export const wikipediaTool = tool({
  description: 'Fetch a summary and full content for a given topic from Wikipedia. You can use a general search query, not just an exact article title.',
  parameters: z.object({
    topic: z.string().describe('The topic to search for on Wikipedia, e.g. "Alan Turing" or any general query.'),
  }),
  execute: async ({ topic }) => {
    try {
      const searchUrl = `https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(topic)}&format=json&origin=*`;
      const searchRes = await fetch(searchUrl);
      if (!searchRes.ok) {
        return { error: `Failed to search Wikipedia for "${topic}".` };
      }
      const searchData = await searchRes.json();
      const searchResults = searchData.query?.search;
      if (!searchResults || searchResults.length === 0) {
        return { error: `No Wikipedia articles found for "${topic}".` };
      }
      const bestTitle = searchResults[0].title;

      const apiUrl = `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(bestTitle)}`;
      const res = await fetch(apiUrl);
      if (!res.ok) {
        return { error: `No Wikipedia article found for "${bestTitle}".` };
      }
      const data = await res.json();

      const contentUrl = `https://en.wikipedia.org/w/api.php?action=query&prop=extracts&explaintext=1&titles=${encodeURIComponent(bestTitle)}&format=json&origin=*`;
      const contentRes = await fetch(contentUrl);
      let fullContent = '';
      if (contentRes.ok) {
        const contentData = await contentRes.json();
        const pages = contentData.query?.pages;
        if (pages) {
          const page = Object.values(pages)[0];
          if (page && typeof page === 'object' && 'extract' in page && typeof page.extract === 'string') {
            fullContent = page.extract.slice(0, 50000);
          }
        }
      }

      return {
        title: data.title,
        summary: data.extract,
        url: data.content_urls?.desktop?.page || `https://en.wikipedia.org/wiki/${encodeURIComponent(bestTitle)}`,
        thumbnail: data.thumbnail?.source || null,
        matchedTitle: bestTitle,
        fullContent,
      };
    } catch (error) {
      return { error: 'Failed to fetch Wikipedia summary, please try again.' + (error as Error).message };
    }
  },
}); 