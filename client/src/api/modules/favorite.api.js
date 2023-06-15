import privateClient from "../client/private.client";

const favoriteApi = {
  add: async (data) => {
    try {
      const response = await privateClient.post("user/favorites", data);

      return { response };
    } catch (err) {
      return { err };
    }
  },
  getList: async () => {
    try {
      const response = await privateClient.get("user/favorites");

      return { response };
    } catch (err) {
      return { err };
    }
  },
  remove: async (favoriteId) => {
    try {
      const response = await privateClient.delete(
        `user/favorites/${favoriteId}`
      );

      return { response };
    } catch (err) {
      return { err };
    }
  },
};

export default favoriteApi;
