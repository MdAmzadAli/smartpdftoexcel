import { useState } from "react";
import axios from "axios";
import { domain } from "./helper/domain";
export default function AdminLogin() {
const [isAdmin,setIsAdmin]=useState(false);
const [password,setPassword]=useState("");

const [feedbacks,setFeedbacks]=useState([]);
const [isLoading,setIsLoading]=useState(false);


const handleLogin=async(e)=>{
    e.preventDefault();
    setIsLoading(true);
    try{
        const res = await axios.get(`${domain}/admin`, {
            headers: {
                Authorization: "Basic " + btoa("admin:" + password)
            }
        });
        // console.log("admin",res.data);
        setFeedbacks(res.data.feedbacks);
        setIsAdmin(true);
    }
    catch(error){
        if(error.response.status>=500){
            alert("Server error! Please try again later.");
        }
        else{
            alert("Invalid password! Please try again.");
        }

    }
    finally{
        setIsLoading(false);
    }
}


return (
    <div>
    {!isAdmin?(
        
        <form onSubmit={(e)=>handleLogin(e)} className="p-4 space-y-4">
        <h2 className="text-xl font-bold">Admin Login</h2>
        <input
          type="password"
          placeholder="Enter admin password"
          className="border p-2"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <button
  className={`bg-blue-500 text-white px-4 py-2 rounded flex items-center justify-center ${isLoading ? 'opacity-50 cursor-not-allowed' : 'hover:cursor-pointer'}`}
  type="submit"
  disabled={isLoading}
>
  {isLoading ? (
    <span className="flex items-center gap-2">
      <svg
        className="animate-spin h-5 w-5 text-white"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle
          className="opacity-25"
          cx="12"
          cy="12"
          r="10"
          stroke="currentColor"
          strokeWidth="4"
        />
        <path
          className="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8v8H4z"
        />
      </svg>
      Loading...
    </span>
  ) : (
    "Login"
  )}
</button>

      </form>
    
    )
        :(
        <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Admin Dashboard</h1>
        {feedbacks.length === 0 ? (
          <p>No feedbacks found</p>
        ) : (
          <table className="border w-full">
            <thead>
              <tr>
                <th className="border p-2">ID</th>
                <th className="border p-2">Rating</th>
                <th className="border p-2">Message</th>
              </tr>
            </thead>
            <tbody>
              {feedbacks.map((f) => (
                <tr key={f.id}>
                  <td className="border p-2">{f.id}</td>
                  <td className="border p-2">{f.rating}</td>
                  <td className="border p-2">{f.comment}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    
    )}
    </div>
)
}