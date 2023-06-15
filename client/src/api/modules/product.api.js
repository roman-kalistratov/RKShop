import privateClient from "../client/private.client";
import publicClient from "../client/public.client";

const productApi = {
  getList: async ({
    offset,
    limit,
    queryCategory,
    crntBrand,
    filteredPrice,
  }) => {
    try {
      let min, max;

      if (filteredPrice) {
        min = filteredPrice.min;
        max = filteredPrice.max;
      } else {
        min = null;
        max = null;
      }

      const response = await publicClient.get(
        `products?offset=${offset}&limit=${limit}&category=${queryCategory}&brand=${crntBrand}&min=${min}&max=${max}`
      );

      return { response };
    } catch (err) {
      return { err };
    }
  },
  getProduct: async (productId) => {
    try {
      const response = await publicClient.get(`products/${productId}`);

      return { response };
    } catch (err) {
      return { err };
    }
  },
  addToCart: async (product, quantity) => {
    const data = {
      product: product,
      qty: quantity || 1,
    };

    try {
      const response = await privateClient.post(`user/cart`, data);
      return response;
    } catch (err) {
      return { err };
    }
  },
  updateCart: async (productId, state) => {
    try {
      const response = await privateClient.put(`user/cart`, {
        productId,
        state,
      });
      return { response };
    } catch (err) {
      return { err };
    }
  },
  search: async ({ query }) => {
    try {
      const response = await publicClient.get(`products/search/${query}`);
      return { response };
    } catch (err) {
      console.log(err);
      return { err };
    }
  },
};

export default productApi;
