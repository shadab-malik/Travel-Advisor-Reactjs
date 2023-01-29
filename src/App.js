import React, { useState, useEffect } from 'react';
import { CssBaseline, Grid } from '@material-ui/core';

import { getPlacesData } from './api/index';
import Header from './components/Header/Header';
import List from './components/List/List';
import Map from './components/Map/Map';

const App = () => {
  const [type, setType] = useState('restaurants');
  const [rating, setRating] = useState('');

  const [coords, setCoords] = useState({}); 
  const [bounds, setBounds] = useState({});

  const [filteredPlaces, setFilteredPlaces] = useState([]);
  const [places, setPlaces] = useState([]);

  const [autocomplete, setAutocomplete] = useState(null);
  const [childClicked, setChildClicked] = useState(null); 
  const [isLoading, setIsLoading] = useState(false);

  /* This useEffect has no dependency array which means it will only run at the start. We use it to get user coordinates by using built-in browser geolocation API. This gives user's geolocation immediately and positions map around users location.  */
  useEffect(() => {
    navigator.geolocation.getCurrentPosition(({ coords: { latitude, longitude } }) => {
      setCoords({ lat: latitude, lng: longitude });
    });
  }, []);
  /* This useEffect runs anytime the rating changes. We use it to filter places by rating. */
  useEffect(() => {
    const filtered = places.filter((place) => Number(place.rating) > rating);

    setFilteredPlaces(filtered);
  }, [places, rating]);

  /* This useEffect runs anytime type, coords, or bounds changes. */
  useEffect(() => {
    if (bounds.sw && bounds.ne) {
      setIsLoading(true); //if we dont have data yet, set state to true or we get an error

      getPlacesData(type, bounds.sw, bounds.ne)
        .then((data) => {
          setPlaces(data.filter((place) => place.name && place.num_reviews > 0));
          setFilteredPlaces([]); // once we get filtered places, set it back to an empty array
          setRating('');
          setIsLoading(false); // once we get data, set this state back to false
        });
    }
  }, [type, bounds, coords.lat, coords.lng]);

  // For our search, get and set autocomplete here - then pass to Header component.
  const onLoad = (autoC) => setAutocomplete(autoC);

  // Find latitude and longitude of new place then set coordinates to these values -  then pass to Header component.
  const onPlaceChanged = () => {
    const lat = autocomplete.getPlace().geometry.location.lat();
    const lng = autocomplete.getPlace().geometry.location.lng();

    setCoords({ lat, lng });
  };

  return (
    <>
      <CssBaseline />
      <Header onPlaceChanged={onPlaceChanged} onLoad={onLoad} />
      <Grid container spacing={3} style={{ width: '100%' }}>
      {/* This responsive grid holds our List component. Will take 12 spaces on extra small devices and 4 spaces on medium devices and larger. We pass the states created above to the List component as props. */}
        <Grid item xs={12} md={4}>
          <List
            isLoading={isLoading}
            childClicked={childClicked}
            places={filteredPlaces.length ? filteredPlaces : places}
            type={type}
            setType={setType}
            rating={rating}
            setRating={setRating}
          />
        </Grid>
         {/* This responsive grid holds our Map component. Will take 12 spaces on extra small devices and 8 spaces on medium devices and large. We pass the states created above to the Map component as props. */}
        <Grid item xs={12} md={8} style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          <Map
            setChildClicked={setChildClicked}
            setBounds={setBounds}
            setCoords={setCoords}
            coords={coords}
            places={filteredPlaces.length ? filteredPlaces : places}
          />
        </Grid>
      </Grid>
    </>
  );
};

export default App;