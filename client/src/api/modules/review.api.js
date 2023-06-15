import publicClient from "../client/public.client";

const reviewApi = {
  getList: async ({ offset, limit }) => {
    try {
      const response = await publicClient.get(
        `reviews?offset=${offset}&limit=${limit}`
      );

      return { response };
    } catch (err) {
      return { err };
    }
  },  
};

export default reviewApi;
