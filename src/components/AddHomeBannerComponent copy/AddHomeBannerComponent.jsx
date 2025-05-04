import React from 'react';

import Box from '@mui/material/Box';
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';

import './AddHomeBannerComponent.scss';
import UploadImagesComponent from '../UploadImagesComponent/UploadImagesComponent';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import 'react-lazy-load-image-component/src/effects/blur.css';

import { IoMdClose } from 'react-icons/io';
import { FaCloudUploadAlt } from 'react-icons/fa';
import { Button } from '@mui/material';

const AddHomeBannerComponent = () => {
    return (
        <section className="p-5 bg-gray-50">
            <form className="form p-8 py-3 max-h-[800px] ">
                <div className="scroll overflow-y-scroll pt-4">
                    <div className="grid grid-cols-7 gap-4">
                        <div className="uploadBoxWrapper relative">
                            <span className="absolute w-[25px] h-[25px] rounded-full overflow-hidden bg-red-700 -top-[10px] -right-[10px] z-50 flex items-center justify-center cursor-pointer">
                                <IoMdClose className="text-white text-[20px]" />
                            </span>
                            <div
                                className="uploadBox p-0 rounded-md overflow-hidden border border-dashed border-[rgba(0,0,0,0.3)] h-[150px] w-[100%] 
                                    bg-gray-100 cursor-pointer hover:bg-gray-200 flex items-center justify-center flex-col relative"
                            >
                                <LazyLoadImage
                                    alt={'Image add product'}
                                    className="w-full h-full object-cover"
                                    effect="blur"
                                    wrapperProps={{
                                        // If you need to, you can tweak the effect transition using the wrapper style.
                                        style: { transitionDelay: '0.3s' },
                                    }}
                                    src={
                                        'https://image.tienphong.vn/w1000/Uploaded/2025/neg-sleclyr/2023_03_23/cd1617e3ac74acc9dac4766027234fd8-2045.jpeg'
                                    }
                                />
                            </div>
                        </div>
                        <UploadImageComponent multiple={true} />
                    </div>

                    <br />
                    <Button type="submit" className="btn-blue w-full !normal-case flex gap-2">
                        <FaCloudUploadAlt className="text-[25px] text-white" />
                        <span className="text-[16px]">Thêm banner</span>
                    </Button>
                </div>
            </form>
        </section>
    );
};

export default AddHomeBannerComponent;
