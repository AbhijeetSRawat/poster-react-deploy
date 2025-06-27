import React, { useState } from 'react';
import Navbar from './components/core/Navbar';
import { Route, Routes } from 'react-router-dom';
import Homepage from './pages/Homepage';
import BusinessSpecific from './pages/BusinessSpecific';
import HomeDecor from './pages/HomeDecor';
import EventsAndCelebrations from './pages/EventsAndCelebrations';
import InspirationalAndQuotes from './pages/InspirationalAndQuotes';
import CoustomDesign from './pages/CoustomDesign';
import SeasonalThemes from './pages/SeasonalThemes';
import HobbiesAndInterests from './pages/HobbiesAndInterests';
import OutdoorAndCommercial from './pages/OutdoorAndCommercial';
import ArtisticAndAbstract from './pages/ArtisticAndAbstract';
import ReligiousAndCultural from './pages/ReligiousAndCultural';
import TodaysSpecial from './pages/TodaysSpecial';
import SearchPage from './pages/SearchPage';
import SignUp from './pages/SignUp';
import Login from './pages/Login';
import SubscriptionPage from './pages/subscription';
import ProfilePage from './pages/Profile';
import Custom from './pages/custom';
import AboutUs from './pages/AboutUs';
import AdminDashboard from './pages/Admin_Dashboard';
import AdminUsers from './pages/AdminUsers';
import AdminProducts from './pages/AdminProducts';
import ForgetPassword from './pages/ForgetPassword';
import EnterOtp from './pages/EnterOtp';
import AddReferral from './pages/AdminAddReferal';


const App = () => {
  const [mode, setMode] = useState(false); // true = light, false = dark
  const [searchValue, setSearchValue] = useState('');
  const [tagvalue, setTagvalue] = useState('');

 

  return (
    <div className="pb-12"> {/* padding for fixed navbar */}
      
       <Navbar mode={mode} setMode={setMode} />

      <Routes>
        <Route path='/' element={<Homepage mode={mode} setTagvalue={setTagvalue} setMode={setMode} searchValue={searchValue} setSearchValue={setSearchValue} />} />
        <Route path='/profile' element={<ProfilePage mode={mode} setMode={setMode} />} />
        <Route path='/todaysspecial' element={<TodaysSpecial mode={mode} setMode={setMode} />} />
        <Route path='/businessspecific' element={<BusinessSpecific mode={mode} setMode={setMode} />} />
        <Route path='/homedecor' element={<HomeDecor mode={mode} setMode={setMode} />} />
        <Route path='/eventandcelebrations' element={<EventsAndCelebrations mode={mode} setMode={setMode} />} />
        <Route path='/inspirationalandquotes' element={<InspirationalAndQuotes mode={mode} setMode={setMode} />} />
        <Route path='/customdesign' element={<CoustomDesign mode={mode} setMode={setMode} />} />
        <Route path='/seasonalthemes' element={<SeasonalThemes mode={mode} setMode={setMode} />} />
        <Route path='/hobbiesandinterests' element={<HobbiesAndInterests mode={mode} setMode={setMode} />} />
        <Route path='/outdoorandcommercial' element={<OutdoorAndCommercial mode={mode} setMode={setMode} />} />
        <Route path='/artisticandabstract' element={<ArtisticAndAbstract mode={mode} setMode={setMode} />} />
        <Route path='/religiousandcultural' element={<ReligiousAndCultural mode={mode} setMode={setMode} />} />
        <Route path='/signup' element={<SignUp mode={mode} setMode={setMode} />} />
        <Route path='/login' element={<Login mode={mode} setMode={setMode} />} />
        <Route path='/searchpage' element={<SearchPage mode={mode} tagvalue={tagvalue} setTagvalue={setTagvalue} searchValue={searchValue} setSearchValue={setSearchValue} setMode={setMode} />} />
        <Route path='/subscribe' element={<SubscriptionPage mode={mode} setMode={setMode} />} />
        <Route path='/custom' element={<Custom mode={mode} setMode={setMode}/>}/>
         <Route path='/about' element={<AboutUs mode={mode} setMode={setMode}/>}/>
         <Route path='/admindashboard' element = {<AdminDashboard/>}/>
         <Route path='/adminusers' element={<AdminUsers/>}/>
         <Route path='/addreferal' element={<AddReferral/>}/>
         <Route path='/adminproducts' element={<AdminProducts />}/>
         <Route path="/forget-password" element={<ForgetPassword mode={mode} setMode={setMode} />} />
          <Route path="/enter-otp" element={<EnterOtp mode={mode} setMode={setMode} />} />
        <Route path="*" element={<>Not Found</>} />
      </Routes>
    </div>
  );
};

export default App;
