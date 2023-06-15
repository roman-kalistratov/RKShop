import React from 'react'
import ProductCard from './ProductCard';
import styles from '../../styles/ProductGrid.module.scss';
import { Link } from 'react-router-dom';

const ProductGrid = ({ products, title, subtitle, children, button }) => {
    return (
        <>
            <div className={styles.productGrid}>
                {(subtitle || title) &&
                    (<div className={styles.header}>
                        {subtitle && <span>{subtitle}</span>}
                        {title && <h2>{title}</h2>}
                    </div>)}

                {products.length === 0 && <h2>Products Not found </h2>}
                <div className={styles.gridItems}>
                    {products.map((product, index) => (
                        <ProductCard key={index} product={product}>
                            {children}
                        </ProductCard>))}
                </div>

                {button &&
                    <Link to="/store" className='button primary small'>View All Products</Link>}
            </div>
        </>
    )
}

export default ProductGrid