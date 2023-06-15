import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';

import { setGlobalLoading } from '../redux/features/globalLoadingSlice';
import { setQueryCategory } from '../redux/features/categoriesSlice';

import Container from '../components/common/Container'
import ProductGrid from '../components/common/ProductGrid';
import productApi from '../api/modules/product.api';
import styles from '../styles/Store.module.scss';

const offset = 0;

const Store = () => {
    const dispatch = useDispatch();
    const { list, queryCategory } = useSelector(({ categories }) => categories);
    const [products, setProducts] = useState([]);
    const [limit, setLimit] = useState(9);
    const [minPrice, setMinPrice] = useState(0);
    const [maxPrice, setMaxPrice] = useState(1749);
    const [filteredPrice, setFilteredPrice] = useState(undefined);
    const [crntBrand, setCrntBrand] = useState('');
    const [isFilerSidebar, setIsFilterSidebar] = useState(false);

    useEffect(() => {
        dispatch(setGlobalLoading(true));
    }, [dispatch])

    useEffect(() => {
        const getProducts = async () => {
            const { response, err } = await productApi.getList({ offset, limit, queryCategory, crntBrand, filteredPrice });

            if (response) setProducts(response.products);
            dispatch(setGlobalLoading(false));

            if (err) console.log(err);
        };
        getProducts();
    }, [dispatch, crntBrand, limit, filteredPrice, queryCategory]);

    const handleReset = () => {
        dispatch(setQueryCategory(''))
        setCrntBrand('');
        setLimit(9);
        setFilteredPrice(undefined);
    }

    return (
        <Container>
            <div className={styles.store}>
                <div className={styles.mobileTop}>
                    <button className={styles.button} onClick={() => setIsFilterSidebar(!isFilerSidebar)}>Filter</button>
                    {(queryCategory || crntBrand || filteredPrice) &&
                        <span className={styles.button} onClick={() => handleReset()}>reset all</span>
                    }
                </div>

                <aside className={`${styles.sidebar} ${isFilerSidebar ? styles.sidebarActive : ''}`}>
                    <Accordion title="Price" active={true}>
                        <div className={styles.filters}>
                            <div className={styles.filtersRangeInput}>
                                <input type='range' min={0} max={900} value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
                                <input type='range' min={900} max={1749} value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
                            </div>
                            <span>Price: <b>${minPrice} - ${maxPrice}</b></span>
                            <button className='button additional small' onClick={() => setFilteredPrice({ min: minPrice, max: maxPrice })}>Filter by price</button>
                        </div>
                    </Accordion>

                    <Accordion title="All Categories" active={false}>
                        <ul className={styles.list}>
                            {list.map((category, index) => (
                                <li key={index} className={`${styles.listItem} ${queryCategory === category && styles.active}`} onClick={() => dispatch(setQueryCategory(category))}>{category}</li>
                            ))}
                        </ul>
                    </Accordion>

                    <Accordion title="Brand" active={false}>
                        <ul className={styles.list}>
                            {brands.map(brand => (
                                <li key={brand.id} className={`${styles.listItem} ${crntBrand === brand.brand && styles.active}`} onClick={() => setCrntBrand(brand.brand)}>{brand.brand}</li>
                            ))}
                        </ul>
                    </Accordion>
                </aside>

                <div className={styles.products}>
                    {(queryCategory || crntBrand || filteredPrice) &&
                        <div className={styles.productsTop}>
                            {queryCategory &&
                                <h3>Category: {queryCategory} <span onClick={() => dispatch(setQueryCategory(''))}>x</span></h3>}
                            {crntBrand &&
                                <h3>Brand: {crntBrand} <span onClick={() => setCrntBrand('')}>x</span></h3>}
                            {filteredPrice &&
                                <h3>Price: ${filteredPrice.min} - ${filteredPrice.max} <span onClick={() => setFilteredPrice(undefined)}>x</span></h3>}
                            <span onClick={() => handleReset()}>reset all</span>
                        </div>}

                    <ProductGrid products={products} />
                    {products.length > 0 &&
                        <button className='button primary small' onClick={() => setLimit(limit + 9)}>Load more</button>}
                </div>
            </div>
        </Container>
    )
}


const Accordion = ({ title, children, active }) => {
    const [isActive, setIsActive] = useState(active);

    useEffect(() => {
        const handleResize = () => {
            window.innerWidth < 900 && setIsActive(false);
        };

        handleResize(); // Установите начальное значение isActive в соответствии с текущей шириной экрана

        window.addEventListener('resize', handleResize); // Отслеживайте изменения ширины экрана

        return () => {
            window.removeEventListener('resize', handleResize); // Удалите обработчик при размонтировании компонента
        };
    }, []);

    const toggleAccordion = () => {
        setIsActive(!isActive);
    };

    return (
        <div className={`accordion ${isActive ? 'active' : ''}`}>
            <div className="accordion__header" onClick={toggleAccordion}>
                <h3>{title}</h3>
            </div>
            {isActive && (
                <div className="accordion__content">
                    {children}
                </div>)}
        </div>
    )
}

export default Store


const brands = [
    { id: 1, brand: 'Apple' },
    { id: 2, brand: 'Samsung' },
    { id: 3, brand: 'OPPO' },
    { id: 4, brand: 'Huawei' },
    { id: 5, brand: 'Microsoft Surface' },
    { id: 6, brand: 'Infinix' },
    { id: 7, brand: 'HP Pavilion' },
    { id: 8, brand: 'Impression of Acqua Di Gio' },
    { id: 9, brand: 'Royal_Mirage' },
    { id: 10, brand: 'Fog Scent Xpressio' },
    { id: 11, brand: 'Al Munakh' },
    { id: 12, brand: 'Lord - Al-Rehab' },
    { id: 13, brand: "L'Oreal Paris" },
    { id: 14, brand: 'Hemani Tea' },
    { id: 15, brand: 'Dermive' },
    { id: 16, brand: 'ROREC White Rice' },
    { id: 17, brand: 'Fair & Clear' },
    { id: 18, brand: 'Saaf & Khaas' },
    { id: 19, brand: 'Bake Parlor Big' },
    { id: 20, brand: 'Baking Food Items' },
    { id: 21, brand: 'fauji' },
    { id: 22, brand: 'Dry Rose' },
    { id: 23, brand: 'Boho Decor' },
    { id: 24, brand: 'Flying Wooden' },
    { id: 25, brand: 'LED Lights' },
    { id: 26, brand: 'luxury palace' },
    { id: 27, brand: 'Golden' },
    { id: 28, brand: 'Furniture Bed Set' },
    { id: 29, brand: 'Ratttan Outdoor' },
    { id: 30, brand: 'Kitchen Shelf' },
    { id: 31, brand: 'Multi Purpose' },
    { id: 32, brand: 'AmnaMart' },
    { id: 33, brand: 'Professional Wear' },
    { id: 34, brand: 'Soft Cotton' },
    { id: 35, brand: 'Top Sweater' },
    { id: 36, brand: 'RED MICKY MOUSE..' },
    { id: 37, brand: 'Digital Printed' },
    { id: 38, brand: 'Ghazi Fabric' },
    { id: 39, brand: 'IELGY' },
    { id: 40, brand: 'IELGY fashion' },
    { id: 41, brand: 'Synthetic Leather' },
    { id: 42, brand: 'Sandals Flip Flops' },
    { id: 43, brand: 'Maasai Sandals' },
    { id: 44, brand: 'Arrivals Genuine' },
    { id: 45, brand: 'Vintage Apparel' },
    { id: 46, brand: 'FREE FIRE' },
    { id: 47, brand: 'The Warehouse' },
    { id: 48, brand: 'Sneakers' },
    { id: 49, brand: 'Rubber' },
    { id: 50, brand: 'Naviforce' },
    { id: 51, brand: 'SKMEI 9117' },
    { id: 52, brand: 'Strap Skeleton' },
    { id: 53, brand: 'Stainless' },
    { id: 54, brand: 'Eastern Watches' },
    { id: 55, brand: 'Luxury Digital' },
    { id: 56, brand: 'Watch Pearls' },
    { id: 57, brand: 'Bracelet' },
    { id: 58, brand: 'LouisWill' },
    { id: 59, brand: 'Copenhagen Luxe' },
    { id: 60, brand: 'Steal Frame' },
    { id: 61, brand: 'Darojay' },
    { id: 62, brand: 'Fashion Jewellery' },
    { id: 63, brand: 'Cuff Butterfly' },
    { id: 64, brand: 'Designer Sun Glasses' },
    { id: 65, brand: 'mastar watch' },
    { id: 66, brand: 'Car Aux' },
    { id: 67, brand: 'W1209 DC12V' },
    { id: 68, brand: 'TC Reusable' },
    { id: 69, brand: 'Neon LED Light' },
    { id: 70, brand: 'METRO 70cc Motorcycle - MR70' },
    { id: 71, brand: 'BRAVE BULL' },
    { id: 72, brand: 'shock absorber' },
    { id: 73, brand: 'JIEPOLLY' },
    { id: 74, brand: 'Xiangle' },
    { id: 75, brand: 'lightingbrilliance' },
    { id: 76, brand: 'Ifei Home' },
    { id: 77, brand: 'DADAWU' },
    { id: 78, brand: 'YIOSI' }
]