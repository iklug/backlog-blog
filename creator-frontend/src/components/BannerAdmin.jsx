import { Route, Link } from "react-router-dom";
import { getSessionAdmin } from "../utils/checkAdmin";


const BannerAdmin = ()=>{

    const getUsername = () => {
        return sessionStorage.getItem('username');
    }

    const isAdmin = getSessionAdmin();

    return (
        <div className="w-full h-16 bg-slate-50 flex justify-between pl-4 pr-8 items-end drop-shadow-lg fixed top-0">
            <Link to='/'>
                <div className="mb-2">

                <div className=" h-12 w-12 rounded-full bg-cyan-400 mt-6">
                    
                </div>
                <div className=" bg-purple-400 h-8 w-8 -mt-8 ml-6 rounded-full"></div>
            </div>
            </Link>
            <div className="flex h-14 gap-6 items-end mb-1 ">
                <div>{getUsername()}</div>
                {isAdmin && 
                <Link to='/new-post'>
                    <div className="h-6 w-6 bg-gray-200 border-gray-500 border-2 mb-1 rounded-full"></div>
                </Link>}
                <Link to='/profile'>
                    <div className="h-12 w-12 rounded-full bg-gray-800"></div>
                </Link>
            </div>
        </div>
    )
}

export default BannerAdmin;