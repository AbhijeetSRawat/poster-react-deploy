import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

const SubscriptionPage = ({ mode }) => {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [referalCode, setReferalCode] = useState('');
  const navigate = useNavigate();

  const token = JSON.parse(localStorage.getItem("token"));

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch("http://localhost:11000/getUserDetails", {
          headers: {
            Authorization: token,
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        });

        const result = await res.json();
        setUserData(result.data);
      } catch (err) {
        console.error("User fetch error:", err);
        toast.error("Failed to load user details");
      }
    };

    fetchUser();
  }, [token]);

  const loadRazorpay = () => {
  return new Promise((resolve) => {
    if (window.Razorpay) {
      resolve(true);
    } else {
      const script = document.createElement("script");
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    }
  });
};

  const handleSubscribe = async () => {
    if (!userData || !userData._id) {
      toast.error("User data missing. Please reload the page.");
      return;
    }

    setLoading(true);
    try {
      const referalRes = await fetch("http://localhost:11000/findReferal", {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ referalcode: referalCode.trim() }),
      });

      const referalData = await referalRes.json();

      if (referalData.success) {
        const subRes = await fetch("http://localhost:11000/subscription", {
          method: "POST",
          headers: {
            Authorization: token,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ userId: userData._id }),
        });

        const subData = await subRes.json();
        if (subData.success) {
          toast.success("Subscribed successfully using referral!");
          window.location.reload();
        } else {
          toast.error("Subscription failed: " + subData.message);
        }
        return;
      }

      // Proceed with Razorpay
      const orderRes = await fetch("http://localhost:11000/createPayment", {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

      const { data: order } = await orderRes.json();

      if (!order || !order.id) {
        toast.error("Failed to initiate payment");
        return;
      }

      const options = {
        key: "rzp_test_Wi9jyOMjPgokkD",
        amount: order.amount,
        currency: "INR",
        name: "TechBro24",
        description: "Subscription Plan",
        order_id: order.id,
        handler: async function (response) {
          try {
            const verifyRes = await fetch("http://localhost:11000/verifyPayment", {
              method: "POST",
              headers: {
                Authorization: token,
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });

            const verifyData = await verifyRes.json();

            if (verifyData.success) {
              const finalRes = await fetch("http://localhost:11000/subscription", {
                method: "POST",
                headers: {
                  Authorization: token,
                  "Content-Type": "application/json",
                },
                body: JSON.stringify({ userId: userData._id }),
              });

              const finalData = await finalRes.json();
              if (finalData.success) {
                toast.success("Subscription successful!");
                localStorage.setItem('subscribed', JSON.stringify(true));
                window.location.reload();
              } else {
                toast.error("Final step failed: " + finalData.message);
              }
            } else {
              toast.error("Payment verification failed");
            }
          } catch (err) {
            console.error("Payment handler error:", err);
            toast.error("Something went wrong after payment.");
          }
        },
        prefill: {
          name: `${userData.firstName} ${userData.lastName}`,
          email: userData.email,
          contact: userData.number,
        },
        theme: {
          color: "#7873f5",
        },
      };

      const isRazorpayReady = await loadRazorpay();
if (!isRazorpayReady) {
  toast.error("Failed to load Razorpay SDK.");
  return;
}

const rzp = new window.Razorpay(options);
rzp.open();


    } catch (err) {
      console.error("Subscription error:", err);
      toast.error("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={`min-h-screen pt-16 flex items-center justify-center px-4 ${mode ? 'bg-gradient-to-br from-pink-300 to-purple-400 text-black' : 'bg-slate-950 text-white'}`}>
      <div className={`w-full max-w-md rounded-2xl p-6 shadow-lg ${mode ? 'bg-white' : 'bg-slate-800'}`}>
        <h1 className={`text-2xl font-bold text-center ${mode ? 'text-purple-700' : 'text-white'}`}>
          {userData?.subscribed ? "You're Subscribed!" : "Subscribe"}
        </h1>

        <div className="flex justify-center mt-4">
          <div className="bg-pink-400 text-white w-24 h-24 rounded-full text-2xl font-bold flex items-center justify-center shadow-md">
            ₹500
          </div>
        </div>

        {!userData?.subscribed && (
          <>
            <input
              type="text"
              className="mt-5 w-full p-2 border border-gray-400 rounded placeholder-gray-400 text-black"
              placeholder="Enter referral code..."
              value={referalCode}
              onChange={(e) => setReferalCode(e.target.value)}
            />

            <ul className="mt-5 text-sm space-y-2">
              {[
                "Access high-quality visuals",
                "Design custom logos",
                "Create banners & event content",
                "Explore seasonal themes & offers",
                "Inspirational quotes & graphics",
                "Upload & edit visuals easily",
              ].map((item, idx) => (
                <li key={idx} className="pl-6 relative before:content-['✔'] before:absolute before:left-0 before:text-green-600">
                  {item}
                </li>
              ))}
            </ul>

            <button
              disabled={loading}
              onClick={handleSubscribe}
              className={`w-full mt-6 py-2 text-white rounded-full font-semibold ${
                loading
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-purple-600 hover:bg-purple-700 transition-all'
              }`}
            >
              {loading ? "Processing..." : "Order Now"}
            </button>
          </>
        )}

        <button
          className="w-full mt-4 text-sm text-blue-400 hover:underline"
          onClick={() => navigate('/')}
        >
          ← Back to Homepage
        </button>
      </div>
    </div>
  );
};

export default SubscriptionPage;
