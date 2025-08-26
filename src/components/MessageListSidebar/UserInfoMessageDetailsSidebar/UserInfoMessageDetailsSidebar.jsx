import { IoIosMore } from 'react-icons/io';
import { IoVideocamOutline } from 'react-icons/io5';
import { CiEdit } from 'react-icons/ci';
import { Button } from '@mui/material';
import { useContext } from 'react';
import { MyContext } from '../../../App';

const UserInfoMessageDetailsSidebar = () => {
    const { userInfo } = useContext(MyContext);
    return (
        <div className="userInfo  p-[20px] flex items-center justify-between ">
            <div className="user flex items-center gap-4 ">
                <img className="w-[50px] h-[50px] object-cover rounded-full " src={userInfo?.avatar} alt="" />
                <h2 className="text-[16px] font-[500] ">{userInfo?.name}</h2>
            </div>
            {/* <div className="icons cursor-pointer flex items-center">
                <Button className="!w-[40px] !min-w-[40px] h-[40px] !rounded-full bg-gray-100 hover:bg-gray-200">
                    <CiEdit className="text-[20px] text-gray-800" />
                </Button>
            </div> */}
        </div>
    );
};

export default UserInfoMessageDetailsSidebar;
