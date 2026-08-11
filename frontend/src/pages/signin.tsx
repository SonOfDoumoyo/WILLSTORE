import React, { useContext, useEffect, useState } from "react"
import { api } from "../interceptors/api";
import { Link } from "react-router-dom";
import GoogleIcon from '@mui/icons-material/Google';
import axios, { isAxiosError } from "axios";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../contexts/userContext";

export default function SignIn () {

    const { setCurrentUser, fetchUser } = useContext(UserContext);
    const navigate = useNavigate();
    const [loginData, setLoginData] = useState({
        email: "",
        password: "",
    })
    const [rememberme, setRememberMe ] = useState(() => {
        const rem = sessionStorage.getItem(`remember_me`)
        return rem ? JSON.parse(rem) : false;
    });
    const [error, setError ] = useState('');

    const [ loginError, setLoginError ] = useState({
        email: "",
        password: "",
    })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();

        const {name, value} = e.target;
        setLoginData((prev) => ({
            ...prev,
            [name] : value
        }))
        if (name == "password"){
            if (value.length >= 8){
                setLoginError((prev) => ({
                    ...prev,
                    password: ""
                }))
            }else{
                setLoginError((prev) => ({
                    ...prev,
                    [name] : ""
                }))
            }
        }else {
            setLoginError((prev) => ({
                ...prev,
                [name] : ""
            }))
        }
    }

    const handleLogin = async (e: React.SyntheticEvent<HTMLFormElement>) => {
        e.preventDefault();

        const errors = {
            email: "",
            password: "",
        }

        if (!loginData.email.trim()){
            errors.email = "Email cannot be empty."
        } else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(loginData.email.trim())){
            errors.email = "Please enter a valid email address."
        }

        if (!loginData.password.trim()){
            errors.password = "Input field cannot be empty."
        } else if (loginData.password.trim().length < 8){
            errors.password = "Must contain atleast 8 characters."
        }

        setLoginError(errors);
        if (Object.values(errors).every((value) => value === "")){

            try {
                const res = await api.post(
                    `/auth/sign_in/${rememberme}`, loginData
                );
                console.log(res)
                if (res.status === 200){
                    fetchUser();
                    navigate("/dashboard")
                }
            } catch (err:  unknown) {
                if (axios.isAxiosError(err)){
                    setError(err.response?.data?.detail || "Login Failed");
                }else{
                    setError("Server Not Reachable");
                }
            }
        }
        
    }

    const [ resetEmail, setResetEmail ] = useState("");
    const [ clickedReset, setClickedReset ] = useState(false);
    const [ resetSent, setResetSent ] = useState(false);

    const handlePasswordReset = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        try {
            if (resetEmail !== ""){
                const res = await api.post(
                    `/auth/reset_password?email=${encodeURIComponent(resetEmail)}`
                )
                setResetSent(true);
            }else{
                setError("Sometimes have common sense.");
                return
            }
        } catch (err:  unknown) {
            if (axios.isAxiosError(err)){
                console.log(err.response?.data?.detail)
                setError(err.response?.data?.detail || "Reset email not sent");
            }else{
                setError("Server Not Reachable");
            }
        }
    }

    useEffect(() => {
        if (!error) return;
        
        const timer = setTimeout(() => {
            setError("");
        }, 3000)

        return () => clearTimeout(timer);
    }, [error])

    const handleRememberMe = () => {
        setRememberMe(!rememberme)
        sessionStorage.setItem(
            "remember_me", JSON.stringify(!rememberme)
        )
    }

    const handleLoginGoogle = () => {
        window.location.href = `http://localhost:8000/api/v1.0/auth/login/google?remember_me=${rememberme}`;
    }
    // useEffect(() => {
    //     api.get("/user/current_user")
    // }, [])


    return (
        <div className="flex flex-col justify-center h-screen items-center bg-blue-100">
            {error && (<span className=" text-2xl font-semibold p-3 border border-red-300 absolute top-0 right-0 text-white bg-red-500 flex flex-row gap-2 items-center"><i className='bx bx-error-circle text-red-700 text-3xl'/>{error}</span>)}
            {clickedReset === true && (<div className="absolute z-20 bg-white/10 border border-white/20 shadow-xl p-11 flex flex-col gap-3 rounded-[13px] m-5">
                {!resetSent && (<div className="flex flex-col gap-[60vh]">
                    <div className="flex flex-col gap-3">
                        <h1 className="text-5xl font-bold w-fit">Password Reset</h1>
                        <p className="text-3xl text-gray-500">Please enter your registered email address. An email address with a password reset link will be sent to you.</p>
                        <input className="text-2xl p-6 w-full border outline-none mb-11 rounded-lg" placeholder="kudosajoa@gmail.com" type="email" value={resetEmail} onChange={(e) => setResetEmail(e.target.value)}/>
                    </div>
                    <div className="w-full flex flex-row gap-4">
                        <button className="w-full p-6 bg-blue-600 rounded-[8px] text-2xl font-extrabold text-white" type="button" onClick={(e) => handlePasswordReset(e)}>Reset Password</button>
                        <button className="w-full p-6 bg-white/30 border border-black/30 rounded-[8px] text-2xl font-extrabold text-black" type="button" onClick={() => {setClickedReset(false); setResetSent(false); setResetEmail("")}}>Back to Login</button>
                    </div>
                </div>)}
                {resetSent && (
                    <div className="flex flex-col gap-4">
                        <h1 className="text-5xl font-bold w-fit">Check your email</h1>
                        <p className="text-3xl text-gray-500">An email has been sent to {resetEmail} containing your password reset link.</p>
                        <p className="text-3xl text-black">Didn't receive it?</p>
                        <div className="w-full flex flex-row gap-4">
                            <button className="w-full p-6 bg-blue-600 rounded-[8px] text-2xl font-extrabold text-white" type="button" onClick={(e) => handlePasswordReset(e)}>Resend Email</button>
                            <button className="w-full p-6 bg-white/30 border border-black/30 rounded-[8px] text-2xl font-extrabold text-black" type="button" onClick={() => {setClickedReset(false); setResetSent(false); setResetEmail("")}}>Back to Login</button>
                        </div>
                    </div>
                )}
            </div>)}
            <div className={`${clickedReset === true ? "blur-lg" : ""} lg:w-[25%] sm:w-[70%]`}>
                <div className={`w-full`}>
                    <div className="w-full my-5">
                        <h1 className="text-5xl font-bold w-fit my-5">Welcome back</h1>
                        <p className="text-2xl text-gray-500">Sign in to your Housify account.</p>
                    </div>
                    
                    <button type="button" className="border text-2xl outline-none font-semibold border-gray-300 p-6 bg-white rounded-[16px] w-[100%] my-5 flex gap-4 item-center justify-center" 
                            onClick={handleLoginGoogle}>
                        <img
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                            alt="Google"
                            className="w-8 h-8"
                        />
                        Continue with Google
                    </button>
                </div>
                <form onSubmit={handleLogin} className="w-full">
                    <div className="w-full flex items-center gap-4 my-4">
                        <div className="flex-1 bg-gray-300 h-px"/>
                        <span className="justify-self-center text-2xl text-gray-500">or</span>
                        <div className="flex-1 bg-gray-300 h-px"/>
                    </div>
                    <div className="w-[100%]">
                        <div className="w-full mb-8">
                            <h4 className={`${loginError.email !== "" ? "text-red-500" : ""} font-semibold text-2xl`}>Email</h4>
                            <input className={`${loginError.email !== "" ? "border-red-500 placeholder:text-red-100" : "border-gray-600/10"} bg-white p-6 w-full rounded-3xl outline-none border text-2xl hover:border-gray-300`} type="text" value={loginData.email} name="email" onChange={handleChange} placeholder="you@gmail.com"/>
                            {loginError.email && (<p className="text-red-500 text-2xl font-bold"><i className='bx bxs-error-circle'></i>{loginError.email}</p>)}
                        </div>
                        <div>
                            <span className="flex flex-row justify-between font-semibold text-2xl"><h4 className={`${loginError.password !== "" ? "text-red-500" : ""} font-semibold text-2xl`}>Password</h4><p className="text-blue-600 cursor-pointer" onClick={() => setClickedReset(true)}>Forgot password?</p></span>
                            <input className={`${loginError.password !== "" ? "border-red-500 placeholder:text-red-100" : "border-gray-600/10"} bg-white p-6 w-full rounded-3xl outline-none border text-2xl hover:border-gray-300`} type="text" name="password" value={loginData.password} onChange={handleChange} placeholder="Enter your password"/>
                            {loginError.password && (<p className="text-red-500 text-2xl font-bold"><i className='bx bxs-error-circle'></i>{loginError.password}</p>)}
                        </div>
                        <div className="mb-5">
                            <label className="flex items-center gap-2">
                                <input className="accent-blue-600" type="checkbox" checked={rememberme} onChange={handleRememberMe}/>
                                <span className="text-gray-500 text-xl">Remember me</span>
                            </label>
                        </div>
                    </div>
                    <button className="w-full p-6 bg-blue-600 my-6 rounded-[16px] text-2xl font-extrabold text-white" type="submit">Sign in</button>
                </form>
                <div className="text-2xl text-gray-500 flex flex-col text-center w-full">
                    <p className="my-8">Don't have an account? <Link className="text-blue-600 font-bold" to={"/create-account"}>Create one free</Link></p>
                    <p className="">By continuing you agree to Housify's <u className="cursor-pointer">Terms of Service</u> and <u className="cursor-pointer">Privacy Policy</u></p>
                </div>
            </div>
        </div>
    )
}