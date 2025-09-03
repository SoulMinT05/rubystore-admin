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
import DOMPurify from 'dompurify';

function formatDate(dateString) {
    const date = new Date(dateString);
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Tháng bắt đầu từ 0
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}
const ProductDetailsPage = () => {
    const { id } = useParams();
    const [productDetails, setProductDetails] = useState();
    const sanitizedDescription = DOMPurify.sanitize(productDetails?.description, {
        ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li', 'span', 'img'],
        ALLOWED_ATTR: ['src', 'alt', 'title', 'width', 'height', 'style'],
    });

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
            try {
                const { data } = await axiosClient.get(`/api/product/getDetailsProductFromAdmin/${id}`);
                if (data?.success) {
                    setTimeout(() => {
                        setProductDetails(data?.product);
                    }, 500);
                }
            } catch (error) {
                console.log('error: ', error);
                // context.openAlertBox('error', error.response.data.message);
            }
        };
        fetchProductDetails();
    }, []);

    console.log('product-detail: ', productDetails);

    return (
        <>
            <div className="flex items-center justify-between px-2 py-0 mt-3">
                <h2 className="text-[25px] font-[600]">Chi tiết sản phẩm</h2>
            </div>
            <br />

            {productDetails?._id ? (
                <>
                    {/* Product Details */}
                    <div className="productDetails flex gap-8">
                        <div className="w-[40%]">
                            {productDetails?.images?.length !== 0 && (
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
                                                productDetails?.images?.length > 5 && 'space'
                                            }`}
                                        >
                                            {productDetails?.images?.map((item, index) => (
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
                                        <Swiper
                                            ref={zoomSliderBig}
                                            slidesPerView={1}
                                            spaceBetween={0}
                                            navigation={false}
                                        >
                                            {productDetails?.images?.map((item, index) => (
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
                            <h2 className="text-[18px] sm:text-[20px] lg:text-[22px] font-[600] mb-4">
                                {productDetails?.name}
                            </h2>
                            <div className="flex items-center py-1">
                                <span className="w-[25%] font-[500] flex items-center gap-2 text-[14px] lg:text-[15px]">
                                    Thương hiệu :
                                </span>
                                <span className="text-[14px] lg:text-[15px]">{productDetails?.brand}</span>
                            </div>
                            <div className="flex items-center py-1">
                                <span className="w-[25%] font-[500] flex items-center gap-2 text-[14px] lg:text-[15px]">
                                    Danh mục :
                                </span>
                                <span className="text-[14px] lg:text-[15px]">{productDetails?.categoryName}</span>
                            </div>

                            {productDetails?.productSize?.length > 0 && (
                                <div className="flex items-center py-1">
                                    <span className="w-[25%] font-[500] flex items-center gap-2 text-[14px] lg:text-[15px]">
                                        Size :
                                    </span>
                                    <div className="flex items-center gap-2">
                                        {productDetails?.productSize?.map((size, index) => (
                                            <span
                                                key={index}
                                                className="text-[12px] inline-block p-2 shadow-sm bg-[#fff] font-[500]"
                                            >
                                                {size}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {productDetails?.productWeight?.length > 0 && (
                                <div className="flex items-center py-1">
                                    <span className="w-[25%] font-[500] flex items-center gap-2 text-[14px] lg:text-[15px]">
                                        Cân nặng :
                                    </span>
                                    <div className="flex items-center gap-2">
                                        {productDetails?.productWeight?.map((weight, index) => (
                                            <span
                                                key={index}
                                                className="text-[12px] inline-block p-2 shadow-sm bg-[#fff] font-[500]"
                                            >
                                                {weight}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                            )}
                            <div className="flex items-center py-1">
                                <span className="w-[25%] font-[500] flex items-center gap-2 text-[14px] lg:text-[15px]">
                                    Đánh giá :
                                </span>
                                <span className="text-[14px] lg:text-[15px]">
                                    ({productDetails?.review?.length || 0}) đánh giá
                                </span>
                            </div>
                            <div className="flex items-center py-1">
                                <span className="w-[25%] font-[500] flex items-center gap-2 text-[14px] lg:text-[15px]">
                                    Ngày tạo sản phẩm :
                                </span>
                                <span className="text-[14px] lg:text-[15px]">
                                    {formatDate(productDetails?.createdAt)}
                                </span>
                            </div>
                        </div>
                    </div>
                    <br /> <br />
                    {/* Product Description */}
                    <h2 className="text-[22px] font-[500] mb-6">Mô tả sản phẩm</h2>
                    <div
                        className="w-full description-content"
                        style={{
                            maxWidth: '100%',
                            wordWrap: 'break-word',
                        }}
                        dangerouslySetInnerHTML={{ __html: sanitizedDescription }}
                    />
                    <br /> <br />
                    <h2 className="text-[22px] font-[500] mb-4">Đánh giá khách hàng</h2>
                    <div className="reviewsWrap mt-3">
                        {productDetails?.review?.length > 0 &&
                            productDetails?.review?.map((review) => {
                                return (
                                    <div
                                        key={review?._id}
                                        className="reviews w-full h-auto p-4 mb-4 bg-white rounded-sm shadow-md flex items-center justify-between"
                                    >
                                        <div className="flex items-center gap-8 w-full ">
                                            <div className="img w-[75px] h-[75px] rounded-full overflow-hidden">
                                                <img
                                                    src={review?.userId?.avatar}
                                                    className="w-full h-full object-cover"
                                                    alt=""
                                                />
                                            </div>

                                            <div className="info w-[100%]">
                                                <div className="flex items-center justify-between">
                                                    <h4 className="text-[16px] font-[500]">{review?.userId?.name}</h4>
                                                    <Rating name="read-only" value={5} readOnly size="small" />
                                                </div>
                                                <span className="text-[13px]">{formatDate(review?.createdAt)}</span>
                                                <p className="text-[13px] mt-2">{review?.comment}</p>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                    </div>
                </>
            ) : (
                <div className="flex items-center justify-center h-96">
                    <CircularProgress color="inherit" />
                </div>
            )}
        </>
    );
};

export default ProductDetailsPage;
