import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Landing from './components/landing/Landing';
import FreeBirdNav from './components/freeBirdNav/FreeBirdNav';
import Itinerary from './components/itinerary/Itinerary';
import ProfilePopUp from './components/profile/ProfilePopUp';
import Activities from './components/activities/Activities'

function App() {
    return (
        <>
            <FreeBirdNav />
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<Landing />} />
                    {/* <Route path="/plans" element={<ItineraryList />} /> */}
                    <Route path="/plans" element={<Itinerary apiLink="https://my.api.mockaroo.com/freeBirdIndivItinerary?key=c96cbbb0" />} />
                    <Route path="/friends" element={<Itinerary apiLink="https://my.api.mockaroo.com/freeBirdGroupItinerary?key=c96cbbb0" />} />
                    <Route path="/profile" element={<ProfilePopUp />} />
                    <Route path="/activities" element={<Activities />} />
                </Routes>
            </BrowserRouter>
        </>
    );
}

export default App;
