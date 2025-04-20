import { useState } from "react";
import axios from 'axios'
import { domain } from "./helper/domain";

export default function FeedbackModal({ show, onClose }) {
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const submitFeedback = async () => {
    setIsLoading(true);
    try{
   
    const res=await axios.post(`${domain}/feedback`,{rating,comment});
    
    // console.log("feedback",res.data);
   
      setSubmitted(true);
      setTimeout(() => {
        
        // setSubmitted(true);
        setRating(0);
        setComment("");
        onClose();
      }, 3000);
    
}
catch{
    
    alert("Something went wrong! Please try again.");
  }
finally{
    setIsLoading(false);
}
}
  

  if (!show) return null;

  return (
    <div     className={`fixed right-4 z-50 bg-white shadow-lg rounded-lg p-4 w-80 transform transition-all duration-500 ${
      show ? 'bottom-4 opacity-100' : '-bottom-96 opacity-0'
    }`}
    >
      <div className="relative bg-white p-6 rounded-2xl w-full max-w-md shadow-2xl border border-gray-200">
        {/* Cross Button */}
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-400 hover:text-gray-700 hover:cursor-pointer text-2xl"
          aria-label="Close"
        >
          ✕
        </button>

        {submitted ? (
          <div className="text-center py-10">
            <p className="text-green-600 text-lg font-semibold">🎉 Thank you for giving feedback!</p>
          </div>
        ) : (
          <>
            <h2 className="text-2xl font-bold mb-4 text-center text-gray-800">
              How was your experience?
            </h2>

            {/* Stars */}
            <div className="flex justify-center mb-4">
              {[1, 2, 3, 4, 5].map((r) => (
                <button
                  key={r}
                  onClick={() => setRating(r)}
                  className={`text-3xl mx-1 transition-transform transform hover:scale-110 ${
                    rating >= r ? "text-yellow-400" : "text-gray-300"
                  }`}
                >
                  ★
                </button>
              ))}
            </div>

            {/* Textarea */}
            <textarea
              placeholder="Leave a comment (optional)"
              className="w-full border border-gray-300 rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 transition mb-4 resize-none"
              rows={4}
              value={comment}
              onChange={(e) => setComment(e.target.value)}
            />

            {/* Submit Button */}
            <div className="flex justify-end">
              <button
                disabled={rating === 0 || isLoading}
                className={`px-5 py-2 bg-blue-600 text-white rounded-lg font-medium flex items-center gap-2 hover:bg-blue-700 transition disabled:opacity-50`}
                onClick={submitFeedback}
              >
                {isLoading ? (
                  <>
                    <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                        fill="none"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v8H4z"
                      />
                    </svg>
                    Submitting...
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
