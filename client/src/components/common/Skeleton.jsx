import React from 'react'
import style from '../../styles/Skeleton.module.scss';

const Skeleton = () => {
    return (
        <div className={style.cards}>
            {[...Array(8)].map((_, index) => (
                <div key={index} className={`${style.card} ${style['is-loading']}`}>
                    <div className={style.image}></div>
                    <div className={style.content}>
                        <div className={style.middle}></div>
                        <div className={style.bottom}>
                            <div className={style.price}></div>
                            <div className={style.botton}></div>
                        </div>
                    </div>
                </div>
            ))}

        </div>
    )
}

export default Skeleton