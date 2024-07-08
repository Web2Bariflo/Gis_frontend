import React, { useEffect, useState, useRef } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import Layout from '../Layout/Layout';
import AdminSideBar from './AdminSideBar';
import '../../assets/css/Canvas.css'; // Add your CSS file

const DrawMap = ({ color, weight, drawnItemsRef }) => {
  const map = useMap();

  useEffect(() => {
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);
    drawnItemsRef.current = drawnItems;

    const drawControl = new L.Control.Draw({
      edit: {
        featureGroup: drawnItems,
        remove: true, // Enable eraser
      },
      draw: {
        polygon: {
          shapeOptions: {
            color: color,
            weight: weight,
          },
        },
        polyline: {
          shapeOptions: {
            color: color,
            weight: weight,
          },
        },
        rectangle: {
          shapeOptions: {
            color: color,
            weight: weight,
          },
        },
        circle: {
          shapeOptions: {
            color: color,
            weight: weight,
          },
        },
        marker: true,
      },
    });

    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, (event) => {
      const layer = event.layer;
      if (layer.setStyle) {
        layer.setStyle({ color: color, weight: weight }); // Set the color and weight for the new layer
      }
      drawnItems.addLayer(layer);

      const drawnData = layer.toGeoJSON();
      console.log(drawnData); // This is the data you will send to the backend
    });

    return () => {
      map.off(L.Draw.Event.CREATED);
      map.removeControl(drawControl);
    };
  }, [map, color, weight, drawnItemsRef]);

  return null;
};

export const Canvas = () => {
  const [color, setColor] = useState('#3388ff'); // Default color
  const [weight, setWeight] = useState(2); // Default line thickness
  const [mapType, setMapType] = useState('osm'); // State to manage map type
  const drawnItemsRef = useRef(null);

  const saveDrawings = () => {
    const data = [];
    if (drawnItemsRef.current) {
      drawnItemsRef.current.eachLayer((layer) => {
        data.push(layer.toGeoJSON());
      });

      fetch('/api/save-drawings', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ drawings: data }),
      })
        .then((response) => response.json())
        .then((result) => {
          console.log(result);
        });
    }
  };

  const toggleMapType = () => {
    setMapType((prevMapType) => (prevMapType === 'osm' ? 'satellite' : 'osm'));
  };

  return (
    <Layout>
      <div className="flex gap-4">
        <AdminSideBar />
        <div className="tools">
          <div className="tool-group">
            <label htmlFor="colorPicker">Choose color:</label>
            <input
              type="color"
              id="colorPicker"
              value={color}
              onChange={(e) => setColor(e.target.value)}
            />
          </div>
          <div className="tool-group">
            <label htmlFor="lineThickness">Line thickness:</label>
            <input
              type="number"
              id="lineThickness"
              value={weight}
              onChange={(e) => setWeight(Number(e.target.value))}
              min="1"
              max="10"
            />
          </div>
          <div className="button-group">
            <button onClick={saveDrawings}>Save</button>
            <button onClick={toggleMapType}>
              Switch to {mapType === 'osm' ? 'Satellite' : 'OpenStreetMap'} View
            </button>
          </div>
        </div>
        <MapContainer center={[51.505, -0.09]} zoom={20} maxZoom={20} style={{ height: '100vh', width: '100%' }}>
          <TileLayer
            url={
              mapType === 'osm'
                ? 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                : 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}'
            }
            maxZoom={20}
            attribution={
              mapType === 'osm'
                ? '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
                : '&copy; <a href="https://www.arcgis.com/">ArcGIS</a> contributors'
            }
          />
          <DrawMap color={color} weight={weight} drawnItemsRef={drawnItemsRef} />
        </MapContainer>
      </div>
    </Layout>
  );
};
