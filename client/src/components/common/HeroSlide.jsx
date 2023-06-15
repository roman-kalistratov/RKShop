import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay } from "swiper";
import style from '../../styles/HeroSlider.module.scss';

const HeroSlide = () => {
  return (
    <section className={`${style.hero} container`}>
      <Swiper
        spaceBetween={10}
        slidesPerView={1}
        loop={true}
        grabCursor={true}
        pagination={{
          clickable: true
        }}
        autoplay={{
          delay: 5500,
          disableOnInteraction: false,
        }}
        modules={[Pagination, Autoplay]}
        className={style.heroSlider}
      >
        {mainBannerData.map((banner, index) => (
          <SwiperSlide key={index} className={style.main__banner}>
            <img src={banner.img} alt="banner" />

          </SwiperSlide>))}
      </Swiper>

      <div className={style.banners}>
        {bannersData.map((banner, index) => (
          <div key={index} className={style.banner}>
            <img src={banner.img} alt="banner" />
            <div className={style.banner__content}>
              <h4>{banner.subtitle}</h4>
              <h5>{banner.title}</h5>
              <p>From ${banner.price} <br /> or ${Math.round(banner.price / 12)}/mo.</p>
            </div>
          </div>))}
      </div>
    </section>
  );
};

export default HeroSlide;

const mainBannerData = [
  {
    img: "/img/main-banner-01.webp"
  },
  {
    img: "/img/main-banner-02.webp"
  },
  {
    img: "/img/main-banner-03.jpg"
  }
]

const bannersData = [
  {
    img: "/img/catbanner-01.jpg",
    subtitle: "NEW ARRIVAL",
    title: "MacBook Pro",
    price: 1599.00
  },
  {
    img: "/img/catbanner-02.jpg",
    subtitle: "NEW ARRIVAL",
    title: "Sport Band",
    price: 249.00
  },
  {
    img: "/img/catbanner-03.jpg",
    subtitle: "NEW ARRIVAL",
    title: "iPad Air",
    price: 599.00
  },
  {
    img: "/img/catbanner-04.jpg",
    subtitle: "NEW ARRIVAL",
    title: "AirPods Max",
    price: 549.00
  },
]