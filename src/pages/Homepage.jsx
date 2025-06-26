import React, { useEffect, useState } from "react";

import { FaSearch } from "react-icons/fa";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import Heading from "../components/core/heading";



const Homepage = ({ mode, setTagvalue, setMode, searchValue, setSearchValue}) => {

const navigate = useNavigate();

  // const changeTheme = () => {
  //   setMode(!mode);
  // };

  const formattedDate = new Date().toLocaleDateString("en-GB", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  const [dateLoading, setDateLoading] = useState(false);
  const [dateData, setDateData] = useState([]);
  const [allLoading, setAllLoading] = useState(false);
  const [allData, setAllData] = useState([]);

  const callShowByDate = async () => {
    try {
      setDateLoading(true);
      const dateResult = await fetch("http://localhost:11000/displayByDate");
      const dateResponse = await dateResult.json();

      console.log("show By Date response is", dateResponse.data);
      setDateData(dateResponse.data);
    } catch (error) {
      console.log("error in fetching today's post", error);
      toast.error("Unable to fetch today's posts!");
    } finally {
      setDateLoading(false);
    }
  };

  const callAllData = async () => {
    try {
      setAllLoading(true);
      const allDataResult = await fetch(
        "http://localhost:11000/api/get/product"
      );
      const allDataResponse = await allDataResult.json();

      console.log("show allData response is", allDataResponse.allProduct);
      setAllData(allDataResponse.allProduct);
    } catch (error) {
      console.log("error in fetching all post", error);
    } finally {
      setAllLoading(false);
    }
  };
  
  
  const searchClick= (e)=>{
    e.preventDefault();
    setTagvalue(searchValue);
    navigate("/searchpage");
  }

  useEffect(() => {
    callShowByDate();
    callAllData();
  }, []);

  return (
    <div
      className={`${
        mode ? "bg-blue-300 text-gray-700" : "bg-slate-900 text-gray-400"
      } min-h-screen pt-16`}
    >
      {/* Top Heading */}
      {/* <div className="w-full h-[10vh] p-3 flex justify-between items-center">
        <div>
          <div className="flex gap-2 text-xs items-center font-bold">
            Your Business
            <div className="bg-yellow-500 w-[17vw] h-[3vh] flex justify-center text-white items-center rounded">
              Subscribe
            </div>
          </div>
          <div className="font-bold">Business {">"}</div>
        </div>
        <div className="flex items-center gap-1.5">
          <div onClick={changeTheme}>
            {mode ? (
              <MdDarkMode
                size={40}
                className="rounded-full bg-white p-2 text-blue-600 shadow-md hover:bg-blue-100 cursor-pointer transition-all duration-300"
              />
            ) : (
              <MdLightMode
                size={40}
                className="rounded-full bg-white p-2 text-blue-600 shadow-md hover:bg-blue-100 cursor-pointer transition-all duration-300"
              />
            )}
          </div>
          <RiVideoFill
            size={40}
            className="rounded-full bg-white p-2 text-blue-600 shadow-md hover:bg-blue-100 cursor-pointer transition-all duration-300"
          />
          <RiNotificationLine
            size={40}
            className="rounded-full bg-white p-2 text-blue-600 shadow-md hover:bg-blue-100 cursor-pointer transition-all duration-300"
          />
        </div>
      </div> */}
      <Heading mode={mode} setMode={setMode}/>

      {/* Searchbar */}
      <div className="mt-3 flex justify-center">
        
        <input
          type="text"
          
          placeholder="Search Category or Media"
          onChange={(e)=>(setSearchValue(e.target.value))}
          className={`w-[75vw] h-[7vh] rounded-l-md px-3 ${
            mode ? "bg-blue-400" : "bg-slate-800"
          }`}
        />
        <button
        onClick={searchClick}
          className={`w-[15vw] h-[7vh] flex justify-center items-center rounded-r-md ${
            mode ? "bg-blue-400" : "bg-slate-800"
          }`}
        >
          <FaSearch size={20} />
        </button>
      </div>

      {/* Today's Posts */}
      <div className="mt-5 px-4">
        <h2 className="text-xl font-semibold mb-3 flex items-center justify-between">
          {formattedDate}'s Specials <div onClick={()=>navigate("/todaysspecial")} className="text-xs pt-1">View All{'>'}</div>
        </h2>
        {dateLoading ? (
          <div className="spinner"></div>
        ) : (
          <div className="flex overflow-x-auto gap-4 scroll-smooth snap-x snap-mandatory pb-4">
            {dateData.map((pic, index) => (
              <div
                key={pic._id || index}
className="w-[100px] h-[100px] overflow flex-shrink-0 snap-center rounded shadow "              >
                <img
                  src={pic.path}
                  alt={pic.productImage || "Today's Post"}
                  className="w-full h-full  object-cover rounded"
                />
                {/* <div className="mt-2 text-sm font-medium text-gray-700">{pic.category}</div> */}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* rest posts */}
      {/* Business Specific */}

      <div className="mt-5 px-4">
        <h2 className="text-xl font-semibold mb-3 flex items-center justify-between">Business Specific <div onClick={()=>navigate("/businessspecific")} className="text-xs pt-1">View All{'>'}</div></h2>
        {allLoading ? (
          <div className="spinner"> </div>
        ) : (
          <div className="flex overflow-x-auto gap-4 scroll-smooth snap-x snap-mandatory pb-4">
            {allData
              .filter((pic) => pic.category === "Business Specific")
              .map((pic, index) => (
                <div
                  key={pic._id || index}
                  className="w-[100px] h-[100px] overflow flex-shrink-0 snap-center rounded shadow "
                >
                  <img
                    src={pic.path}
                    alt={pic.productImage || "Today's Post"}
                    className="w-full h-full  object-cover rounded"
                  />
                  {/* <div className="mt-2 text-sm font-medium text-gray-700">{pic.category}</div> */}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Home Decor */}
      <div className="mt-5 px-4">
        <h2 className="text-xl font-semibold mb-3 flex items-center justify-between">Home Decorations <div onClick={()=>navigate("/homedecor")} className="text-xs pt-1">View All{'>'}</div></h2>
        {allLoading ? (
          <div className="spinner"> </div>
        ) : (
          <div className="flex overflow-x-auto gap-4 scroll-smooth snap-x snap-mandatory pb-4">
            {allData
              .filter((pic) => pic.category === "Home Decor")
              .map((pic, index) => (
                <div
                  key={pic._id || index}
  className="w-[100px] h-[100px] overflow flex-shrink-0 snap-center rounded shadow "                >
                  <img
                    src={pic.path}
                    alt={pic.productImage || "Today's Post"}
                    className="w-full h-full  object-cover rounded"
                  />
                  {/* <div className="mt-2 text-sm font-medium text-gray-700">{pic.category}</div> */}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Event & Celebrations */}
      <div className="mt-5 px-4">
        <h2 className="text-xl font-semibold mb-3 flex items-center justify-between">Event & Celebrations <div onClick={()=>navigate("/eventandcelebrations")} className="text-xs pt-1">View All{'>'}</div></h2>
        {allLoading ? (
          <div className="spinner"> </div>
        ) : (
          <div className="flex overflow-x-auto gap-4 scroll-smooth snap-x snap-mandatory pb-4">
            {allData
              .filter((pic) => pic.category === "Event & Celebrations")
              .map((pic, index) => (
                <div
                  key={pic._id || index}
  className="w-[100px] h-[100px] overflow flex-shrink-0 snap-center rounded shadow "                >
                  <img
                    src={pic.path}
                    alt={pic.productImage || "Today's Post"}
                    className="w-full h-full  object-cover rounded"
                  />
                  {/* <div className="mt-2 text-sm font-medium text-gray-700">{pic.category}</div> */}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Inspirational & Quotes */}
      <div className="mt-5 px-4">
        <h2 className="text-xl font-semibold mb-3 flex items-center justify-between">Inspirational & Quotes <div onClick={()=>navigate("/inspirationalandquotes")} className="text-xs pt-1">View All{'>'}</div></h2>
        {allLoading ? (
          <div className="spinner"> </div>
        ) : (
          <div className="flex overflow-x-auto gap-4 scroll-smooth snap-x snap-mandatory pb-4">
            {allData
              .filter((pic) => pic.category === "Inspirational & Quotes")
              .map((pic, index) => (
                <div
                  key={pic._id || index}
  className="w-[100px] h-[100px] overflow flex-shrink-0 snap-center rounded shadow "                >
                  <img
                    src={pic.path}
                    alt={pic.productImage || "Today's Post"}
                    className="w-full h-full  object-cover rounded"
                  />
                  {/* <div className="mt-2 text-sm font-medium text-gray-700">{pic.category}</div> */}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Custom Design */}
      <div className="mt-5 px-4">
        <h2 className="text-xl font-semibold mb-3 flex items-center justify-between">Custom Design <div onClick={()=>navigate("/customdesign")} className="text-xs pt-1">View All{'>'}</div></h2>
        {allLoading ? (
          <div className="spinner"> </div>
        ) : (
          <div className="flex overflow-x-auto gap-4 scroll-smooth snap-x snap-mandatory pb-4">
            {allData
              .filter((pic) => pic.category === "Custom Design")
              .map((pic, index) => (
                <div
                  key={pic._id || index}
  className="w-[100px] h-[100px] overflow flex-shrink-0 snap-center rounded shadow "                >
                  <img
                    src={pic.path}
                    alt={pic.productImage || "Today's Post"}
                    className="w-full h-full  object-cover rounded"
                  />
                  {/* <div className="mt-2 text-sm font-medium text-gray-700">{pic.category}</div> */}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Seasonal Themes */}
      <div className="mt-5 px-4">
        <h2 className="text-xl font-semibold mb-3 flex items-center justify-between">Seasonal Themes <div onClick={()=>navigate("/seasonalthemes")} className="text-xs pt-1">View All{'>'}</div></h2>
        {allLoading ? (
          <div className="spinner"> </div>
        ) : (
          <div className="flex overflow-x-auto gap-4 scroll-smooth snap-x snap-mandatory pb-4">
            {allData
              .filter((pic) => pic.category === "Seasonal Themes")
              .map((pic, index) => (
                <div
                  key={pic._id || index}
  className="w-[100px] h-[100px] overflow flex-shrink-0 snap-center rounded shadow "                >
                  <img
                    src={pic.path}
                    alt={pic.productImage || "Today's Post"}
                    className="w-full h-full  object-cover rounded"
                  />
                  {/* <div className="mt-2 text-sm font-medium text-gray-700">{pic.category}</div> */}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Hobbies & Interests */}
      <div className="mt-5 px-4">
        <h2 className="text-xl font-semibold mb-3 flex items-center justify-between">Hobbies & Interests <div onClick={()=>navigate("/hobbiesandinterests")} className="text-xs pt-1">View All{'>'}</div></h2>
        {allLoading ? (
          <div className="spinner"> </div>
        ) : (
          <div className="flex overflow-x-auto gap-4 scroll-smooth snap-x snap-mandatory pb-4">
            {allData
              .filter((pic) => pic.category === "Hobbies & Interests")
              .map((pic, index) => (
                <div
                  key={pic._id || index}
  className="w-[100px] h-[100px] overflow flex-shrink-0 snap-center rounded shadow "                >
                  <img
                    src={pic.path}
                    alt={pic.productImage || "Today's Post"}
                    className="w-full h-full  object-cover rounded"
                  />
                  {/* <div className="mt-2 text-sm font-medium text-gray-700">{pic.category}</div> */}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Outdoor & Commercial */}
      <div className="mt-5 px-4">
        <h2 className="text-xl font-semibold mb-3 flex items-center justify-between">Outdoor & Commercial <div onClick={()=>navigate("/outdoorandcommercial")} className="text-xs pt-1">View All{'>'}</div></h2>
        {allLoading ? (
          <div className="spinner"> </div>
        ) : (
          <div className="flex overflow-x-auto gap-4 scroll-smooth snap-x snap-mandatory pb-4">
            {allData
              .filter((pic) => pic.category === "Outdoor & Commercial")
              .map((pic, index) => (
                <div
                  key={pic._id || index}
  className="w-[100px] h-[100px] overflow flex-shrink-0 snap-center rounded shadow "                >
                  <img
                    src={pic.path}
                    alt={pic.productImage || "Today's Post"}
                    className="w-full h-full  object-cover rounded"
                  />
                  {/* <div className="mt-2 text-sm font-medium text-gray-700">{pic.category}</div> */}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Artistic & Abstract */}
      <div className="mt-5 px-4">
        <h2 className="text-xl font-semibold mb-3 flex items-center justify-between">Artistic & Abstract <div onClick={()=>navigate("/artisticandabstract")} className="text-xs pt-1">View All{'>'}</div></h2>
        {allLoading ? (
          <div className="spinner"> </div>
        ) : (
          <div className="flex overflow-x-auto gap-4 scroll-smooth snap-x snap-mandatory pb-4">
            {allData
              .filter((pic) => pic.category === "Artistic & Abstract")
              .map((pic, index) => (
                <div
                  key={pic._id || index}
  className="w-[100px] h-[100px] overflow flex-shrink-0 snap-center rounded shadow "                >
                  <img
                    src={pic.path}
                    alt={pic.productImage || "Today's Post"}
                    className="w-full h-full  object-cover rounded"
                  />
                  {/* <div className="mt-2 text-sm font-medium text-gray-700">{pic.category}</div> */}
                </div>
              ))}
          </div>
        )}
      </div>

      {/* Religious & Cultural */}
      <div className="mt-5 px-4">
        <h2 className="text-xl font-semibold mb-3 flex items-center justify-between">Religious & Cultural <div onClick={()=>navigate("/religiousandcultural")} className="text-xs pt-1">View All{'>'}</div></h2>
        {allLoading ? (
          <div className="spinner"> </div>
        ) : (
          <div className="flex overflow-x-auto gap-4 scroll-smooth snap-x snap-mandatory pb-4">
            {allData
              .filter((pic) => pic.category === "Religious & Cultural")
              .map((pic, index) => (
                <div
                  key={pic._id || index}
  className="w-[100px] h-[100px] overflow flex-shrink-0 snap-center rounded shadow "                >
                  <img
                    src={pic.path}
                    alt={pic.productImage || "Today's Post"}
                    className="w-full h-full  object-cover rounded"
                  />
                  {/* <div className="mt-2 text-sm font-medium text-gray-700">{pic.category}</div> */}
                </div>
              ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Homepage;
