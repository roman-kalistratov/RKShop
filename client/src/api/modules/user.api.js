import privateClient from "../client/private.client";
import publicClient from "../client/public.client";

const userApi = {
  signup: async (data) => {
    try {
      const response = await publicClient.post("user/signup", data);

      return { response };
    } catch (err) {
      return { err };
    }
  },
  login: async (data) => {
    try {
      const response = await publicClient.post("user/login", data);

      return { response };
    } catch (err) {
      return { err };
    }
  },
  auth: async (user) => {
    try {
      const response = await privateClient.get("user/auth", user);

      return { response };
    } catch (err) {
      return { err };
    }
  },
  getCart: async (userId) => {
    try {
      const response = await privateClient.get(`user/cart/${userId}`);

      return { response };
    } catch (err) {
      return { err };
    }
  },
  remove: async (productId) => {
    try {
      const response = await privateClient.delete(`user/cart/${productId}`);

      return response;
    } catch (err) {
      return { err };
    }
  },
  updateCart: async (productId) => {
    try {
      const response = await privateClient.put(`user/cart/${productId}`);
      return response;
    } catch (err) {
      return { err };
    }
  },
  applyCoupon: async (coupon) => {
    try {
      const response = await privateClient.post(
        `user/cart/applycoupon`,
        coupon
      );
      return { response };
    } catch (err) {
      return { err };
    }
  },
  forgotPassword: async (data) => {
    try {
      const response = await publicClient.post(`user/forgot-password`, data);

      return { response };
    } catch (err) {
      return { err };
    }
  },
  resetPassword: async (data, token) => {
    try {
      const response = await publicClient.post(
        `user/reset-password/${token}`,
        data
      );

      return { response };
    } catch (err) {
      return { err };
    }
  },
  createOrder: async (data) => {
    try {
      const { response } = await privateClient.post(`user/cart/order`, {
        data,
      });

      return response;
    } catch (err) {
      return { err };
    }
  },
  logout: async () => {
    try {
      const response = await privateClient.post(`user/logout`);

      return response;
    } catch (err) {
      return { err };
    }
  },
};

export default userApi;
