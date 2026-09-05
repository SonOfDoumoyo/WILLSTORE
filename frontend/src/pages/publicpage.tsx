import { Link } from "react-router-dom";

export default function PublicPage() {
    return (
        <div className="bg-dark-theme">
            <div className="flex justify-between border-b border-white/20 p-7 items-center">
                <div className="text-3xl font-bold"><h1 className="text-white">WillStore<b className="text-peach">NG</b></h1></div>
                <div className="text-peach text-2xl font-semibold bg-peach/20 p-5 rounded-2xl">Marketplace</div>
                <div className="flex gap-3 flex-row">
                    <Link to={"/sign-in"} className="bg-gray-200/20 border border-white/10 text-gray-400 rounded-2xl font-semibold text-2xl px-4 py-3 cursor-pointer">Sign In</Link>
                    <Link to={"/create-account"} className="bg-peach text-white px-4 text-2xl font-semibold rounded-2xl py-3 cursor-pointer">Register</Link>
                </div>
            </div>
            <div className="p-8">
                <div className="w-full flex justify-center pt-11 flex-col">
                    <div className="bg-peach/20 self-center items-center border border-peach/20 rounded-3xl text-peach px-3 py-2 text-2xl font-semibold"><i className="bx bxs-bolt"/>VERIFIED ACCOUNTS • FAST DELIVERY</div>
                    <div className="flex self-center m-11 flex-col items-center">
                        <h1 className="text-8xl font-black text-white">Buy Premium TikTok Acounts</h1>
                        <h1 className="text-8xl font-black text-peach">Instantly & Securely</h1>
                    </div>
                    <h1 className="text-3xl text-gray-600 self-center w-[39%] text-center">Browse verified TikTok accounts across all niches, Messaging guaranteed on selected listings.</h1>
                </div>
            </div>
        </div>
    )
}