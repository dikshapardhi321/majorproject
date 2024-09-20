   /* yaha hum maptoken show .ejs se access kar paye hai because vaha humne boliierplate ke nichewe usko define kiya hai */
   mapboxgl.accessToken = mapToken;
   const map = new mapboxgl.Map({
       container: 'map', // container ID
       style: 'mapbox://styles/mapbox/streets-v12',
       center: listing.geometry.coordinates, // starting position [lng, lat]. Note that lat must be set between -90 and 90
       zoom: 9 // starting zoom
   });

//    console.log(coordinates);
   // Create a default Marker and add it to the map.
   // isase hamari location k upar red color ka marker aa jayenga
   const marker = new mapboxgl.Marker({color:'red'})
       .setLngLat(listing.geometry.coordinates)//listing.geometry.coordinates
       // popup ye bhi code mapbox se copy kiye hai
       .setPopup ( new mapboxgl.Popup({ offset: 25 }).setHTML( `<h3>${listing.location}</h3><p>Exact location after booking!</p>`))
           // yaha hum listing.location ko bhi print kara sakte hai
           .addTo(map);
       

       // longitude and lagitude ki jarurat nhi hai becaue humne already hamri listing ke liye cordinated save kiye hai
//    .setLngLat(e.lngLat)
    
