import Marquee from "react-fast-marquee";

const Marque = () => {
  return (
    <Marquee
      style={{ padding: "1rem 0" }}
      speed={30}
      autoFill={true}
      gradient={true}
      gradientColor={[245, 245, 247]}
      gradientWidth={40}
    >
      <img src="/img/brand-02.png" alt="brand" />
      <img src="/img/brand-03.png" alt="brand" />
      <img src="/img/brand-04.png" alt="brand" />
      <img src="/img/brand-05.png" alt="brand" />
      <img src="/img/brand-06.png" alt="brand" />
    </Marquee>
  )
}

export default Marque