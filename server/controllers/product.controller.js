import axiosClient from "../axios/axios.client.js";
import axios from 'axios';

const baseUrl = process.env.FAKE_STORE_URL;

const getProducts = async (req, res) => {
  try {   
    const { offset, category, brand, min, max } = req.query;

    let limit = req.query.limit;

    if (     
      (category !== "undefined" && category !== "") ||
      (brand !== "undefined" && brand !== "")
    ) limit = 100;

    const products = await axios.get(
      `${baseUrl}/products?skip=${offset}&limit=${limit}`
    );

    if (!products) {
      return res.status(404).json("products not found");
    }

    // filters
   let filtered = products.data;

    if (category !== "undefined" && category !== "") {
      filtered = {
        ...filtered,
        products: filtered.products.filter(
          (product) => product.category === category
        ),
      };
    }

    if (brand !== "undefined" && brand !== "") {
      filtered = {
        ...filtered,
        products: filtered.products.filter(
          (product) => product.brand === brand
        ),
      };
    }

    if (min !== "null" && max !== "null") {   
      filtered = {
        ...filtered,
        products: filtered.products.filter(
          (product) => product.price >= min && product.price <= max
        ),
      };
    }   
   
    return res.status(200).json(filtered);
  } catch (err) {
    console.log(err);
  }
};

const getProduct = async (req, res) => {
  try {
    const { productId } = req.params;

    const product = await axiosClient.get(`${baseUrl}/products/${productId}`);

    if (!product) {
      return res.status(404).json(`product not found`);
    }

    return res.status(200).json(product);
  } catch (err) {
    console.log(err);
  }
};

const search = async (req, res) => {
  try {
    const {query} = req.params;

    if(!query) {
      res.status(401).json(`products not found`);
    }

    const products = await axiosClient.get(`${baseUrl}/products/search?q=${query}&limit=4`);

    if (!products) {
      res.status(404).json(`products not found`);
    }

    

    return res.status(200).json(products);
  } catch(err) {
    return res.status(500).json("Something went wrong...");
  }
};

export default { getProducts, getProduct, search };
