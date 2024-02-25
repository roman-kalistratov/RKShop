import React, { useEffect, useState } from 'react'
import HeroSlide from '../components/common/HeroSlide'
import Container from "../components/common/Container"
import Marque from '../components/common/Marque'
import ProductGrid from '../components/common/ProductGrid'
import { useDispatch } from "react-redux"
import { setGlobalLoading } from '../redux/features/globalLoadingSlice'
import productApi from '../api/modules/product.api'
import Skeleton from '../components/common/Skeleton'

const offset = 0;
const limit = 25;

const Home = () => {
  const dispatch = useDispatch();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const getProducts = async () => {     
        dispatch(setGlobalLoading(true));
        const {response, err} = await productApi.getList({ offset, limit });

        dispatch(setGlobalLoading(false));

        if (response) setProducts(response.products);
        if (err) console.log(err);
    };
    getProducts();
  }, [dispatch]);

  const filteredByRating = (products) => {
    return products.filter(({ rating }) => rating > 4.5) || null;
  }

  return (
    <>
      <Container>
        <HeroSlide />      
        <ProductGrid
          products={filteredByRating(products)}
          title="Bestseller Products"
          subtitle="A wide selection of items"
          button={true}
        />
        <Marque />
      </Container>
    </>
  )
}

export default Home