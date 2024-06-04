import React, { useEffect, useRef, useState } from "react";
import Layout from "../Layout/Layout";
import { Sidebar } from "../Sidebar";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { useTranslation } from "react-i18next";
import URL from "../../URL";
import Livefeed from "../Livefeed";
import energy from "../../assets/img/energy.png";
import feed from "../../assets/img/food.png";
import L from "leaflet";
import { ResponsNav } from "../ResponsNav";
import smileFish from "../../assets/img/smile_fish.jpg";
import machineImg from "../../assets/img/device.png"; // Import the machine image

export const Analytics = () => {
  const mapRef = useRef(null);
  const navigate = useNavigate();
  const drawnItemsRef = useRef(null);
  const [map, setMap] = useState(null);
  const [isSatelliteView, setIsSatelliteView] = useState(false);
  const [pondsData, setPondsData] = useState([]);
  const { t } = useTranslation();
  const [socketData, setSocketData] = useState([]);
  const BASEURL = URL();

  useEffect(() => {
    if (mapRef.current) return; // Ensure map is not re-initialized

    const mapInstance = L.map("map").setView([20.593683, 78.962883], 5);

    const defaultTileLayer = L.tileLayer(
      "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
      {
        attribution: "© Esri",
      }
    );

    mapInstance.addLayer(defaultTileLayer);
    mapRef.current = mapInstance;

    const drawnItems = new L.FeatureGroup();
    mapInstance.addLayer(drawnItems);
    drawnItemsRef.current = drawnItems;

    setMap(mapInstance);

    return () => {
      if (mapRef.current) {
        mapRef.current.remove();
        mapRef.current = null;
      }
    };
  }, []);

  const fetchPonds = async (userId) => {
    try {
      const response = await axios.get(`${BASEURL}/pondanalytic/${userId}/`);
      setPondsData(response.data);
      // console.log(response.data);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    const authString = localStorage.getItem("auth");
    if (authString) {
      const auth = JSON.parse(authString);
      fetchPonds(auth.Mob);
    }
  }, []);

  useEffect(() => {
    if (map && pondsData.length > 0) {
      const drawnItems = drawnItemsRef.current;
      drawnItems.clearLayers();
      const bounds = [];
      let lastMatchedPond = null;

      pondsData.forEach((pond) => {
        // Determine the color based on socketData match
        const matchedSocket = socketData.flat().find(socket => socket.POND_ID === pond.name && socket.STATUS === "Yes");
        const color = matchedSocket ? "green" : "red";

        // Add pond location polygon
        const polygon = L.polygon(pond.pond_location, { color, fillOpacity: 0 }).addTo(map);
        drawnItems.addLayer(polygon);
        bounds.push(polygon.getBounds());

        // Update lastMatchedPond if matchedSocket exists
        if (matchedSocket) {
          lastMatchedPond = { pond, matchedSocket, polygon };
        }

        // Add round yellow dot marker for the pond location, if location exists
        if (pond.location) {
          const [lat, lng] = pond.location.split(",").map(Number);
          if (!isNaN(lat) && !isNaN(lng)) {
            const circleMarker = L.circleMarker([lat, lng], {
              radius: 5,
              fillColor: "yellow",
              color: "yellow",
              weight: 1,
              opacity: 1,
              fillOpacity: 0.5
            }).addTo(map);
            drawnItems.addLayer(circleMarker);
          }
        }
      });

      // Show popup only for the last matched pond
      if (lastMatchedPond) {
        const { pond, matchedSocket, polygon } = lastMatchedPond;
        let popupContent;

        // Check the NAME field and create appropriate popup content
        if (matchedSocket.NAME === "Aeration Device On") {
          popupContent = `
            <div>
            <img src=${machineImg} alt="fish" style="width:50px;margin:0 auto;"/>
              <p><strong>Task:</strong> ${matchedSocket.TASK_ID}</p>
              <p><strong>Time:</strong> ${matchedSocket.TIME}</p>
              <p><strong>Status:</strong> ${matchedSocket.STATUS}</p>
              <p><strong>Username:</strong> ${matchedSocket.USERNAME}</p>
            </div>
          `;
        } else if (matchedSocket.NAME === "Feeding") {
          popupContent = `
            <div>
              <img src=${smileFish} alt="fish" style="width:30px"/>
              <p><strong>Task:</strong> ${matchedSocket.TASK_ID}</p>
              <p><strong>Time:</strong> ${matchedSocket.TIME}</p>
              <p><strong>Status:</strong> ${matchedSocket.STATUS}</p>
              <p><strong>Username:</strong> ${matchedSocket.USERNAME}</p>
            </div>
          `;
        }

        if (popupContent) {
          polygon.bindPopup(popupContent).openPopup();

          // Close the popup after 30 seconds (30000 milliseconds)
          setTimeout(() => {
            map.closePopup();
          }, 30000);
        }
      }

      if (bounds.length > 0) {
        map.fitBounds(L.latLngBounds(bounds));
      }
    }
  }, [map, pondsData, socketData]);

  const toggleSatelliteView = () => {
    setIsSatelliteView((prevState) => !prevState);
    if (!isSatelliteView) {
      const satelliteTileLayer = L.tileLayer(
        "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
        {
          attribution: "© OpenStreetMap contributors",
        }
      );
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) {
          mapRef.current.removeLayer(layer);
        }
      });
      mapRef.current.addLayer(satelliteTileLayer);
    } else {
      const defaultTileLayer = L.tileLayer(
        "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
        {
          attribution: "© Esri",
        }
      );
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.TileLayer) {
          mapRef.current.removeLayer(layer);
        }
      });
      mapRef.current.addLayer(defaultTileLayer);
    }
  };

  useEffect(() => {
    // console.log(socketData);
  }, [socketData]);

  // console.log(pondsData);

  return (
    <Layout>
      <section className="flex gap-1">
        <Sidebar />
        <ResponsNav />
        <div className="w-full flex flex-col gap-5 mt-16 md:mt-2">
          <div className="w-full flex flex-col md:flex-row gap-2 m-2">
            <div className="md:w-8/12 flex flex-col relative h-[97vh]">
              <div id="map" className="w-full h-80 md:h-[100vh] z-0"></div>
              <button
                className="absolute bg-white p-2 text-black rounded-sm border border-black z-1 right-0 md:right-2 top-2"
                onClick={toggleSatelliteView}
              >
                Map Views
              </button>
              <div className="w-full flex flex-col md:flex-row mx-auto align-middle justify-center gap-8 my-6 p-6">
                <div className="w-full flex gap-6 p-6 shadow-lg" style={{ backgroundColor: "rgb(238, 255, 239)" }}>
                  <img src={energy} alt="..." />
                  <h2 className="text-lg font-medium">Total Energy Cost</h2>
                </div>
                <div className="w-full flex gap-6 p-6 shadow-lg" style={{ backgroundColor: "rgb(238, 255, 239)" }}>
                  <img src={feed} alt="..." />
                  <h2 className="text-lg font-medium">Total Feed Cost</h2>
                </div>
              </div>
            </div>
            <Livefeed setSocketData={setSocketData}/>
          </div>
        </div>
      </section>
    </Layout>
  );
};
