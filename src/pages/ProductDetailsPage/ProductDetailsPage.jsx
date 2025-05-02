import React, { useEffect, useRef, useState } from 'react';
import { MyContext } from '../../App';
import { useParams } from 'react-router-dom';

import InnerImageZoom from 'react-inner-image-zoom';
import 'react-inner-image-zoom/lib/styles.min.css';

import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation } from 'swiper/modules';

import 'swiper/css';
import 'swiper/css/navigation';
import { MdBrandingWatermark } from 'react-icons/md';
import { BiSolidCategoryAlt } from 'react-icons/bi';
import { MdFilterVintage } from 'react-icons/md';
import { MdRateReview } from 'react-icons/md';
import { BsPatchCheckFill } from 'react-icons/bs';

import './ProductDetailsPage.scss';
import axiosClient from '../../apis/axiosClient';
import { CircularProgress, Rating } from '@mui/material';

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}
const ProductDetailsPage = () => {
    const { id } = useParams();
    const [product, setProduct] = useState();

    const [slideIndex, setSlideIndex] = useState(0);
    const zoomSliderBig = useRef();
    const zoomSliderSml = useRef();

    const goto = (index) => {
        setSlideIndex(index);
        zoomSliderSml.current.swiper.slideTo(index);
        zoomSliderBig.current.swiper.slideTo(index);
    };

    useEffect(() => {
        const fetchProductDetails = async () => {
            const { data } = await axiosClient.get(`/api/product/${id}`);
            if (data?.success) {
                setTimeout(() => {
                    setProduct(data?.product);
                }, 500);
            }
        };
        fetchProductDetails();
    }, []);
    return (
        <>
            <div className="flex items-center justify-between px-2 py-0 mt-3">
                <h2 className="text-[25px] font-[600]">Chi tiết sản phẩm</h2>
            </div>
            <br />
            {product?._id ? (
                <div className="productDetails flex gap-8">
                    <div className="w-[40%]">
                        {product?.images?.length !== 0 && (
                            <div className="flex gap-3">
                                <div className="slider w-[15%]">
                                    <Swiper
                                        ref={zoomSliderSml}
                                        direction={'vertical'}
                                        slidesPerView={5}
                                        spaceBetween={10}
                                        navigation={true}
                                        modules={[Navigation]}
                                        className={`zoomProductSliderThumbs h-[400px] overflow-hidden ${
                                            product?.images?.length > 5 && 'space'
                                        }`}
                                    >
                                        {product?.images?.map((item, index) => (
                                            <SwiperSlide key={index}>
                                                <div
                                                    className={`item rounded-md overflow-hidden cursor-pointer group 
                                    ${slideIndex === index ? 'opacity-1' : 'opacity-30'}`}
                                                    onClick={() => goto(index)}
                                                >
                                                    <img
                                                        src={item}
                                                        alt=""
                                                        className="w-full transition-all group-hover:scale-105"
                                                    />
                                                </div>
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>

                                <div className="zoomContainer w-[85%] h-[400px] overflow-hidden rounded-lg">
                                    <Swiper ref={zoomSliderBig} slidesPerView={1} spaceBetween={0} navigation={false}>
                                        {product?.images?.map((item, index) => (
                                            <SwiperSlide key={index}>
                                                <InnerImageZoom zoomType="hover" zoomScale={1} src={item} />
                                            </SwiperSlide>
                                        ))}
                                    </Swiper>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="w-[60%]">
                        <h2 className="text-[20px] font-[500] mb-4">{product?.name}</h2>
                        <div className="flex items-center py-1">
                            <span className="w-[25%] font-[500] flex items-center gap-2 text-[14px]">
                                <MdBrandingWatermark className="opacity-65" />
                                Thương hiệu :
                            </span>
                            <span className="text-[14px]">{product?.brand}</span>
                        </div>
                        <div className="flex items-center py-1">
                            <span className="w-[25%] font-[500] flex items-center gap-2 text-[14px]">
                                <BiSolidCategoryAlt className="opacity-65" />
                                Danh mục :
                            </span>
                            <span className="text-[14px]">{product?.categoryName}</span>
                        </div>
                        {product?.productRam?.length > 0 && (
                            <div className="flex items-center py-1">
                                <span className="w-[25%] font-[500] flex items-center gap-2 text-[14px]">
                                    <MdFilterVintage className="opacity-65" />
                                    RAM :
                                </span>
                                <div className="flex items-center gap-2">
                                    {product?.productRam?.map((ram, index) => (
                                        <span
                                            key={index}
                                            className="text-[12px] inline-block p-1 shadow-sm bg-[#fff] font-[500]"
                                        >
                                            {ram}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {product?.productSize?.length > 0 && (
                            <div className="flex items-center py-1">
                                <span className="w-[25%] font-[500] flex items-center gap-2 text-[14px]">
                                    <MdFilterVintage className="opacity-65" />
                                    Size :
                                </span>
                                <div className="flex items-center gap-2">
                                    {product?.productSize?.map((size, index) => (
                                        <span
                                            key={index}
                                            className="text-[12px] inline-block p-1 shadow-sm bg-[#fff] font-[500]"
                                        >
                                            {size}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}

                        {product?.productWeight?.length > 0 && (
                            <div className="flex items-center py-1">
                                <span className="w-[25%] font-[500] flex items-center gap-2 text-[14px]">
                                    <MdFilterVintage className="opacity-65" />
                                    Cân nặng :
                                </span>
                                <div className="flex items-center gap-2">
                                    {product?.productWeight?.map((weight, index) => (
                                        <span
                                            key={index}
                                            className="text-[12px] inline-block p-1 shadow-sm bg-[#fff] font-[500]"
                                        >
                                            {weight}
                                        </span>
                                    ))}
                                </div>
                            </div>
                        )}
                        <div className="flex items-center py-1">
                            <span className="w-[25%] font-[500] flex items-center gap-2 text-[14px]">
                                <MdRateReview className="opacity-65" />
                                Đánh giá :
                            </span>
                            <span className="text-[14px]">({product?.reviews?.length || 0}) đánh giá</span>
                        </div>
                        <div className="flex items-center py-1">
                            <span className="w-[25%] font-[500] flex items-center gap-2 text-[14px]">
                                <BsPatchCheckFill className="opacity-65" />
                                Ngày nhập :
                            </span>
                            <span className="text-[14px]">{formatDate(product?.createdAt)}</span>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="flex items-center justify-center h-96">
                    <CircularProgress color="inherit" />
                </div>
            )}
            <br /> <br />
            <h2 className="text-[20px] font-[500] mb-4">Mô tả sản phẩm</h2>
            {product?.description && <p className="text-[14px]">{product?.description}</p>}
            <br /> <br />
            <h2 className="text-[20px] font-[500] mb-4">Đánh giá khách hàng</h2>
            <div className="reviewsWrap mt-3">
                <div className="reviews w-full h-auto p-4 mb-4 bg-white rounded-sm shadow-md flex items-center justify-between">
                    <div className="flex items-center gap-8">
                        <div className="img w-[75px] h-[75px] rounded-full overflow-hidden">
                            <img
                                src="http://res.cloudinary.com/dd4zrjxvc/image/upload/v1746107139/qrbyoowcic9zulybe84x.jpg"
                                className="w-full h-full object-cover"
                                alt=""
                            />
                        </div>

                        <div className="info w-[80%]">
                            <div className="flex items-center justify-between">
                                <h4 className="text-[16px] font-[500]">Võ Vũ Anh Thu</h4>
                                <Rating name="read-only" value={5} readOnly size="small" />
                            </div>
                            <span className="text-[13px]">29/04/2025</span>
                            <p className="text-[13px] mt-2">
                                Lorem ipsum dolor, sit amet consectetur adipisicing elit. Veritatis voluptates fuga hic
                                aperiam aspernatur, sunt tempore necessitatibus corrupti a? Distinctio dicta aperiam
                                aliquam repellendus dolorum consequatur? Error aspernatur accusantium temporibus.
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default ProductDetailsPage;
