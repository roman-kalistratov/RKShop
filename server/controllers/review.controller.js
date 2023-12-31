import axiosClient from "../axios/axios.client.js";

const baseUrl = process.env.FAKE_STORE_URL;

const getReviews = async (req, res) => {
  try {
    const { offset, limit } = req.query;

    const reviews = await axiosClient.get(
      `${baseUrl}/comments?skip=${offset}&limit=${limit}`
    );

    if (!reviews) {
      res.status(404).json("reviews not found");
    }

    return res.status(200).json(reviews);
  } catch (err) {
    console.log(err.message);
  }
};

export default { getReviews };
