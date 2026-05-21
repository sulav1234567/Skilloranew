import { useEffect, useRef } from "react";
import { setOptions, importLibrary } from "@googlemaps/js-api-loader";

let isGoogleMapsConfigured = false;

const GoogleMap = ({
  lat,
  lng,
  width = "100%",
  height = "400px",
  zoom = 16,
  title = "Location",
}) => {
  const mapRef = useRef(null);

  useEffect(() => {
    const loadMap = async () => {
      try {
        const latitude = Number(lat);
        const longitude = Number(lng);

        if (!Number.isFinite(latitude) || !Number.isFinite(longitude)) {
          return;
        }

        if (!isGoogleMapsConfigured) {
          setOptions({
            key: import.meta.env.VITE_GOOGLE_MAPS_API_KEY,
            v: "weekly",
          });

          isGoogleMapsConfigured = true;
        }

        const position = {
          lat: latitude,
          lng: longitude,
        };

        const { Map } = await importLibrary("maps");
        const { AdvancedMarkerElement } = await importLibrary("marker");

        const map = new Map(mapRef.current, {
          center: position,
          zoom,
          mapId: "DEMO_MAP_ID",

          // Satellite view
          mapTypeId: "satellite",

          // Make map static
          draggable: false,
          scrollwheel: false,
          disableDoubleClickZoom: true,
          keyboardShortcuts: false,
          gestureHandling: "none",

          // Hide controls
          disableDefaultUI: true,
          zoomControl: false,
          mapTypeControl: false,
          streetViewControl: false,
          fullscreenControl: false,
        });

        new AdvancedMarkerElement({
          map,
          position,
          title,
        });

        map.addListener("click", () => {
          const googleMapUrl = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;

          window.open(googleMapUrl, "_blank", "noopener,noreferrer");
        });
      } catch (error) {
        console.error("Google Maps loading error:", error);
      }
    };

    loadMap();
  }, [lat, lng, zoom, title]);

  return (
    <div
      ref={mapRef}
      style={{
        width,
        height,
        overflow: "hidden",
        cursor: "pointer",
      }}
    />
  );
};

export default GoogleMap;