import axios, { isAxiosError } from "axios";
import { useEffect, useState } from "react"
import { api } from "../interceptors/api";
import { useSignup } from "../contexts/signupContext";
import { useNavigate } from "react-router-dom";
import { ConfirmationNumber } from "@mui/icons-material";


export default function SignUp () {

    const { signUpData, setSignUpData } = useSignup();

    const [passwordData, setPasswordData] = useState({
        confirmpassword: ""
    })

    const [ formError, setFormError ] = useState({
        fullname: "",
        email: "",
        password: "",
        confirmpassword: "",
    })

    const [ error, setError ] = useState("");
    const [ next, setNext ] = useState("1");
    const [ changeDetails, setChangeDetails ] = useState(true);
    

    const [rememberme, setRememberMe ] = useState(() => {
            const rem = sessionStorage.getItem(`remember_me`)
            return rem ? JSON.parse(rem) : false;
    })

    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        e.preventDefault();
        const {name, value} = e.target;
        setSignUpData((prev) => ({
            ...prev,
            [name] : value,
        }))
        setPasswordData((prev) => ({
            ...prev,
            [name] : value,
        }))
        setFormError((prev) => ({
            ...prev,
            [name] : "",
        }))
    }

    const handleLoginGoogle = () => {
        window.location.href = `http://localhost:8000/api/v1.0/auth/login/google?remember_me=${rememberme}`;
    }

    const handleCreateAccount = async () => {
        try{
            const res = await api.post(
                `/auth/signup/`, signUpData
            )
            console.log(res.data);
        }catch (err: unknown) {
            if (axios.isAxiosError(err)){
                setError(err.response.data || "Sign up failed")
            }else{
                setError("Server Not Reachable")
            }
        }
    }

    const handleSubmit = (e: React.SyntheticEvent<HTMLFormElement>, n: string) => {
        e.preventDefault();
        const errors = {
            fullname: "",
            email: "",
            password: "",
            confirmpassword: "",
        };

        if (!signUpData.fullname.trim()) {
            errors.fullname = "Full name is required.";
        } else if (!/^[A-Za-z\s]+$/.test(signUpData.fullname.trim())) {
            errors.fullname = "Full name can only contain letters and spaces.";
        } else if (signUpData.fullname.trim().length < 2) {
            errors.fullname = "Full name must be at least 2 characters.";
        }

        if (!signUpData.email.trim()) {
            errors.email = "Email is required."
        }else if(!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(signUpData.email.trim())){
            errors.email = "Please enter a valid email address"
        }


        if (next === "2"){
            if (signUpData.password.trim() === "") {
                errors.password = "Input field cannot be empty"
            }

            if (passwordData.confirmpassword.trim() === "") {
                errors.confirmpassword = "Input field cannot be empty"
            }
            if(!passwordsMatch){
                setError("Passwords do not match")
                n = "2";
                return;
            }
        }
        

        setFormError(errors);
        if (Object.values(errors).every((value) => value === "")){
            setNext(n);
            return;
        }
    }

    const handleRememberMe = () => {
        setRememberMe(!rememberme)
        sessionStorage.setItem(
            "remember_me", JSON.stringify(!rememberme)
        )
    }


    // we check the password strength with these
    const checks = {
        length: signUpData.password.length >= 8,
        upperCase: /[A-Z]/.test(signUpData.password),
        lowerCase: /[a-z]/.test(signUpData.password),
        number: /\d/.test(signUpData.password),
        special: /[!@#$%^&*(),.?":{}|<>]/.test(signUpData.password)
    }


    const score = Object.values(checks).filter(Boolean).length;

    const getStrength = () => {
        if (score <= 2) {
            return {
                text: "Weak",
                color: "text-red-500",
                bg: "bg-red-500",
                width: "25%",
            }
        }

        if (score === 3) {
            return {
                text: "Good",
                color: "text-yellow-500",
                bg: "bg-yellow-500",
                width: "50%",
            }
        }

        if (score === 4) {
            return {
                text: "Strong",
                color: "text-blue-500",
                bg: "bg-blue-500",
                width: "75%",
            }
        }

        return {
            text: "Very Strong",
            color: "text-green-500",
            bg: "bg-green-500",
            width: "100%",
        }
    }

    const strength = getStrength();

    const passwordsMatch = passwordData.confirmpassword && signUpData.password === passwordData.confirmpassword

    useEffect(() => {
        if (!error) return;
        
        const timer = setTimeout(() => {
            setError("");
        }, 3000)

        return () => clearTimeout(timer);
    }, [error])

    

    return (
        <div className="relative h-screen">
            {error && (<span className=" text-2xl font-semibold p-3 border border-red-300 absolute top-0 right-0 text-white bg-red-500 flex flex-row gap-2 items-center"><i className='bx bx-error-circle text-red-700 text-3xl'/>{error}</span>)}
            <div className={`flex flex-col justify-center h-screen items-center bg-dark-theme z-0`}>
                <div className="flex flex-row items-start justify-center mb-11 gap-4 w-full absolute top-10">
                        <div className="flex flex-row gap-2 items-center mb-11">
                            <h1 className="lg:w-[40px] sm:w-[30px] lg:h-[40px] sm:h-[30px] flex items-center justify-center rounded-[50px] lg:text-3xl sm:text-2xl font-bold text-white bg-gray-400" style={{
                                backgroundColor: next == "1" || next == "2" || next == "3" ? "#c90c3b":"#9ca3af",
                            }}>{(next == "2" || next == "3") && (
                                <i className="bx bx-check text-white text-3xl"></i>
                            )}{(next == "1") && (
                                1
                            )}</h1>
                            <h1 className={`${next !== "1" ? "text-peach" : "text-gray-300"} lg:text-3xl sm:text-2xl font-bold`}>Details</h1>
                            <span className={`${next !== "1" ? "bg-peach" : "bg-gray-300"} flex-1  h-px lg:w-[70px] sm:w-[40px]`}/>
                        </div>

                        <div className="flex flex-row gap-2 items-center">
                            <h1 className="lg:w-[40px] sm:w-[30px] lg:h-[40px] sm:h-[30px] flex items-center justify-center rounded-[50px] lg:text-3xl sm:text-2xl font-bold text-white bg-gray-400" style={{
                                backgroundColor: next == "2" || next == "3" ? "#c90c3b":"#9ca3af",
                            }}>{(next == "3") && (
                                <i className="bx bx-check text-white text-3xl"></i>
                            )}{(next == "2" || next == "1") && (
                                2
                            )}</h1>
                            <h1 className={`${next !== "2" ? "text-peach" : "text-gray-300"} lg:text-3xl sm:text-2xl font-bold`}>Security</h1>
                            <span className={`${next !== "2" ? "bg-peach" : "bg-gray-300"} flex-1  h-px lg:w-[70px] sm:w-[40px]`}/>
                        </div>

                        <div className="flex flex-row gap-2 items-center">
                            <h1 className="lg:w-[40px] sm:w-[30px] lg:h-[40px] sm:h-[30px] flex items-center justify-center rounded-[50px] lg:text-3xl sm:text-2xl font-bold text-white bg-gray-400" style={{
                                backgroundColor: next == "3" ? "#c90c3b":"#9ca3af",
                            }}>{(next == "done") && (
                                <i className="bx bx-check text-white text-3xl"></i>
                            )}{(next == "1" || next == "2" || next == "3") && (
                                3 
                            )}</h1>
                            <h1 className="lg:text-3xl sm:text-2xl font-bold" style={{
                                color: next == "3" ? "#000" : "#6b7280" 
                            }}>Verification</h1>
                        </div>
                    </div>

                {(next == "1") && (<div className="lg:w-[550px] md:w-[500px] sm:w-[450px] flex flex-col items-center gap-6">
                    
                    <div className="flex flex-col items-start gap-2 w-full">
                        <h1 className="lg:text-5xl md:text-4xl sm:text-4xl font-bold">Create Your Account</h1>
                        <p className="text-3xl sm:text-2xl text-gray-500">Join <b className="text-white font-normal">WillStore</b><b className="text-peach mr-1">NG</b> and start your media journey.</p>
                    </div>
                    <button type="button" className="border text-2xl font-semibold border-gray-200 p-6 bg-white rounded-[23px] w-[100%] my-5 flex gap-4 item-center justify-center" 
                            onClick={handleLoginGoogle}>
                        <img
                            src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg"
                            alt="Google"
                            className="w-8 h-8"
                        />
                        Sign up with Google
                    </button>

                    <div className="w-full flex items-center gap-4 my-4">
                        <div className="flex-1 bg-gray-300/20 h-px"/>
                        <span className="justify-self-center text-2xl text-gray-500">or with email</span>
                        <div className="flex-1 bg-gray-300/20 h-px"/>
                    </div>

                    <form className="text-3xl sm:text-2xl w-full flex flex-col gap-6 text-white" onSubmit={(e) => handleSubmit(e,"2")}>
                        
                        <div className="w-full flex flex-col text-2xl gap-3">
                            <p className={`${formError.fullname !== "" ? "text-red-500" : ""} font-semibold`}>Full Name</p>
                            <input className={`${formError.fullname !== "" ? "border-red-500 placeholder:text-red-100" : "border-gray-600/10 placeholder:text-gray-700"} bg-white p-5 text-black rounded-3xl outline-none border hover:border-gray-300`} type="text" name="fullname" value={signUpData.fullname} placeholder="Kudos Ajao" onChange={handleChange}/>
                            {formError.fullname && (<p className="text-red-500 text-2xl font-bold"><i className='bx bxs-error-circle'></i>{formError.fullname}</p>)}
                        </div>

                        <div className="w-full flex flex-col text-2xl gap-3">
                            <p className={`${formError.email !== "" ? "text-red-500" : ""} font-semibold`}>Email</p>
                            <input className={`${formError.email !== "" ? "border-red-500 placeholder:text-red-100" : "border-gray-600/10 placeholder:text-gray-700"} bg-white p-5 text-black rounded-3xl outline-none border hover:border-gray-300`} type="email" name="email" value={signUpData.email} placeholder="you@gmail.com" onChange={handleChange}/>
                            {formError.email && (<p className="text-red-500 text-2xl font-bold"><i className='bx bxs-error-circle'></i>{formError.email}</p>)}
                        </div>

                        <button className="w-[50%] self-center p-6 bg-peach text-white font-bold rounded-[50px]" type="submit">
                            Continue
                        </button>
                    </form>
                    <div className="w-full flex items-center gap-4 my-4">
                        <div className="flex-1 bg-gray-300 h-px"/>
                    </div>
                    <p className="text-2xl font-semibold text-">Already have a <b className="text-white font-normal">WillStore</b><b className="text-peach mr-1 font-semibold">NG</b>account? <span className="cursor-pointer text-peach font-bold" onClick={() => navigate("/sign-in")}>Log in</span></p>
                </div>)}

                {(next == "2") && (
                    <form className="lg:w-[550px] flex flex-col gap-16" onSubmit={(e) => {handleSubmit(e, "3")}}>
                        <div className="flex flex-col gap-7 text-white">
                            <h1 className="text-5xl font-bold">Secure your account</h1>
                            <h1 className="lg:text-3xl md:text-3xl sm:text-2xl font-normal text-gray-500">Create a strong password to protect your account and personal information.</h1>
                        </div>
                        <div className="space-y-6 mb-16">
                            {/* password */}
                            <div className="w-full flex flex-col text-2xl gap-3 mb-11">
                                <p className={`${formError.password !== "" ? "text-red-500" : ""} font-semibold`}>Password</p>
                                <div className="relative flex flex-row">
                                    <input className={`${formError.password !== "" ? "border-red-500 placeholder:text-red-100 text-red-500" : "border-gray-600/10"} bg-white p-5 rounded-3xl outline-none border w-full hover:border-gray-300`} type={showPassword ? "text" : "password"} name="password" value={signUpData.password} placeholder="create a password" onChange={handleChange}/>
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2">
                                        <i className={`bx ${
                                            showPassword ? "bx-hide" : "bx-show"
                                        } text-2xl text-gray-500`}></i>
                                    </button>
                                </div>
                                {formError.password && (<p className="text-red-500 text-2xl font-bold"><i className='bx bxs-error-circle'></i>{formError.password}</p>)}
                            </div>

                            {/* strength meter */}
                            {signUpData.password && (
                                <div>
                                    <div>
                                        <div className="flex justify-between mb-2">
                                            <span className="text-2xl text-gray-500">
                                                Passwword Strength
                                            </span>

                                            <span className={`font-semibold ${strength.color}`}>
                                                {strength.text}
                                            </span>
                                        </div>

                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div className={`${strength.bg} h-full rounded-full transition-all duration-500`} style={{width: strength.width}}></div>
                                        </div>
                                    </div>

                                    {/* Requirements */}
                                    <div className="bg-gray-100/20 border rounded-2xl p-4 space-y-3">
                                        <Requirement
                                            met={checks.length}
                                            text="At least 8 characters"
                                        />
                                        <Requirement
                                            met={checks.upperCase}
                                            text="One uppercase letter"
                                        />
                                        <Requirement
                                            met={checks.lowerCase}
                                            text="One lowercase letter"
                                        />
                                        <Requirement
                                            met={checks.number}
                                            text="One number"
                                        />
                                        <Requirement
                                            met={checks.special}
                                            text="One special character"
                                        />
                                    </div>
                                </div>
                            )}
                            
                            <div>
                                <p className={`${formError.confirmpassword !== "" ? "text-red-500" : ""} text-2xl font-semibold`}>Confirm Password</p>
                                <div className="relative text-2xl">
                                    <input className={`${formError.confirmpassword !== "" ? "border-red-500 placeholder:text-red-100 text-red-500" : "border-gray-600/10"} bg-white p-5 rounded-3xl w-full outline-none border hover:border-gray-300`} type={showPassword ? "text" : "password"} name="confirmpassword" value={passwordData.confirmpassword} placeholder="Confirm password" onChange={handleChange} />
                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2">
                                        <i className={`bx ${
                                            showPassword ? "bx-hide" : "bx-show"
                                        } text-2xl text-gray-500`}></i>
                                    </button>
                                </div>{formError.confirmpassword && (<p className="text-red-500 text-2xl font-bold"><i className='bx bxs-error-circle'></i>{formError.confirmpassword}</p>)}

                            </div>

                            {passwordData.confirmpassword &&(
                                <div className="mt-3 flex items-center gap-2">
                                    <i
                                        className={`bx ${
                                            passwordsMatch
                                            ? "bxs-check-circle text-green-500"
                                            : "bxs-x-circle text-red-500"
                                        } text-lg`}
                                    />

                                    <span className={
                                        `text-2xl ${passwordsMatch ? "text-green-600" : "text-red-600"}`
                                    }>
                                        {passwordsMatch ? "Passwords match" : "Passwords do not match"}
                                    </span>
                                </div>
                            )}
                        </div>
                        <div className="w-full flex flex-row gap-4">
                            <button className="w-[50%] text-2xl font-bold p-6 bg-gray-200 text-blue-600 border border-blue-600 rounded-[50px]" onClick={() => setNext("1")} type="button">Back</button>
                            <button className="w-[50%] text-2xl font-bold p-6 bg-peach rounded-[50px]" type="submit">Continue</button>
                        </div>
                    </form>
                )}

                {next === "3" && (
                    <div className="relative lg:w-[550px] flex justify-between flex-col gap-16 text-white">
                        <div className="flex flex-col lg:text-3xl gap-10 w-full">
                            <h1 className="text-5xl font-bold">Review your details before continuing</h1>
                            <div className="w-full flex flex-col gap-6">
                                <div className="flex flex-row w-full justify-between items-center align-text-bottom">
                                    <h1 className="text-2xl font-bold text-gray-500">Fullname:</h1>
                                    <input className="bg-transparent p-5 w-[85%] outline-none border-b font-bold border-gray-600/10 hover:border-gray-300" type="text" name="fullname" value={signUpData.fullname} readOnly/>
                                </div>
                                <div className="flex flex-row w-full justify-between items-center align-text-bottom">
                                    <h1 className="text-2xl font-bold text-gray-500">Email:</h1>
                                    <input className="bg-transparent p-5 w-[85%] outline-none border-b font-bold border-gray-600/10 hover:border-gray-300" type="email" name="email" value={signUpData.email} readOnly/>
                                </div>
                            </div>
                            <div>
                                <div className="flex flex-row gap-4 items-start">
                                    <input className="accent-blue-600" type="checkbox" checked={rememberme} onChange={handleRememberMe}/>
                                    <p className="text-gray-500 text-2xl">By clicking "Create Account", you agree to <b className="text-white font-normal">WillStore</b><b className="text-peach mr-1">NG's</b> <u className="text-blue-500 cursor-pointer">Terms of Service</u> and <u className="text-blue-500 cursor-pointer">Privacy Policy.</u></p>
                                </div>
                            </div>
                        </div>
                        <div className="w-full flex flex-row gap-4">
                            <button className="w-[30%] p-6 text-2xl text-blue-600 font-bold bg-gray-200 rounded-[50px] border border-blue-600 outline-none" onClick={() => setNext("2")}>Back</button>
                            <button className="w-[70%] p-6 text-2xl text-white font-bold bg-peach rounded-[50px]" onClick={() => {handleCreateAccount(); navigate("/verify-email")}}>Continue</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

function Requirement({met, text}) {
    return (
        <div className="flex items-center gap-3">
            <i className={`bx ${
                met
                ? "bxs-check-circle text-green-500"
                : "bx-circle text-gray-400"
            } text-lg`}/>

            <span className={`text-xl ${
                met ? "text-green-600" : "text-gray-600"
            }`}>{text}</span>
        </div>
    )
}