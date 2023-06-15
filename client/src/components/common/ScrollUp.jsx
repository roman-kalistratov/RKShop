import React, { useState, useEffect } from "react";
import { MdKeyboardArrowUp } from "react-icons/md";

const ScrollUp = () => {
    const [isShow, setIsShow] = useState(false);

    useEffect(() => {
        window.addEventListener("scroll", () => {
            if (window.scrollY > 50) {
                setIsShow(true);
            } else {
                setIsShow(false);
            }
        });
    }, []);

    const scrollTop = () => {
        window.scrollTo({
            top: 0,
            behavior: "smooth",
        });
    };


    return (
        <>
            {isShow && (
                <MdKeyboardArrowUp
                    className="scrollUp"
                    onClick={scrollTop}
                />
            )}
        </>
    )
}

export default ScrollUp