import React, { useState, useEffect, createRef } from 'react';
import { CircularProgress, Grid, Typography, InputLabel, MenuItem, FormControl, Select } from '@material-ui/core';

import PlaceDetails from '../PlaceDetails/PlaceDetails';
import useStyles from './styles.js';

// List component receives states as props from App.js
const List = ({ places, type, setType, rating, setRating, childClicked, isLoading }) => {
  const [elRefs, setElRefs] = useState([]);
  const classes = useStyles();

/* Once we get places, we want to set them to the state. We do this by using array constructor to create as many elements as there are places. Then, we call .fill which fills the new array. Then, we map over the new array - we don't need first parameter so we use an underscore. Then return refs[i] so we access refs and return that index or if ref doesn't exist yet, we createRef. Once we have refs, we set them and they can be used in PlaceDetails below. */
  useEffect(() => {
    setElRefs((refs) => Array(places.length).fill().map((_, i) => refs[i] || createRef()));
  }, [places]);

  return (
    <div className={classes.container}>
      <Typography variant="h4">Food & Attractions near you</Typography>
      {/* If is loading, render a div which contains the circular progess. We will get an error if we don't use loading state - recieved as prop from App.js Otherwise, render the entire formControl */}
      {isLoading ? (
        <div className={classes.loading}>
          <CircularProgress size="5rem" />
        </div>
      ) : (
        <>
          <FormControl className={classes.formControl}>
            <InputLabel id="type">Type</InputLabel>
            {/* type state is set when user clicks on a MenuItem - e.target.value */}
            <Select id="type" value={type} onChange={(e) => setType(e.target.value)}>
              <MenuItem value="restaurants">Restaurants</MenuItem>
              <MenuItem value="attractions">Attractions</MenuItem>
            </Select>
          </FormControl>
          <FormControl className={classes.formControl}>
            <InputLabel id="rating">Rating</InputLabel>
            {/* rating state is set when user clicks on a MenuItem - e.target.value */}
            <Select id="rating" value={rating} onChange={(e) => setRating(e.target.value)}>
              <MenuItem value="">All</MenuItem>
              <MenuItem value="3">Above 3.0</MenuItem>
              <MenuItem value="4">Above 4.0</MenuItem>
              <MenuItem value="4.5">Above 4.5</MenuItem>
            </Select>
          </FormControl>
          {/* This grid contains our place cards. Only if we have places, map over them. In each iteration of the map callback function, it has one new place. We instantly return a grid with our PlaceDetails component. We then pass a place to the component, place={place}.  */}
          <Grid container spacing={3} className={classes.list}>
            {places?.map((place, i) => (
              <Grid ref={elRefs[i]} key={i} item xs={12}>
              {/* If childClicked equals index, this place was selected - converted to number. */}
                <PlaceDetails selected={Number(childClicked) === i} refProp={elRefs[i]} place={place} />
              </Grid>
            ))}
          </Grid>
        </>
      )}
    </div>
  );
};

export default List;