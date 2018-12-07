require("dotenv").config({ path: ".env" });
const mbxGeocoding = require("@mapbox/mapbox-sdk/services/geocoding");
const geocodingClient = mbxGeocoding({
  accessToken: process.env.map_Box_Token
});

geocodingClient
  .forwardGeocode({
    query: "121 Scoles Ave, Clifton, NJ, 07012",
    limit: 2
  })
  .send()
  .then(response => {
    const match = response.body;
    console.log(match.features[0].geometry.coordinates);
  });
