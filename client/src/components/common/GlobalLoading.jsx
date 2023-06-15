import { useSelector } from "react-redux";
import { useEffect, useState } from "react";
import Logo from "./Logo";

const GlobalLoading = () => {
  const { globalLoading } = useSelector((state) => state.globalLoading);

  // const globalLoading = false;


  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (globalLoading) {
      setIsLoading(true);
    } else {
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    }
  }, [globalLoading]);


  return (
    <div className="globalLoading" style={{ opacity: `${isLoading ? 1 : 0}` }}>
      <Logo />
    </div>
  );
};

export default GlobalLoading;