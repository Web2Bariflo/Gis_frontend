import React, { useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import 'leaflet-draw/dist/leaflet.draw.css';
import Layout from '../Layout/Layout';
import AdminSideBar from './AdminSideBar';

const DrawMap = () => {
  const map = useMap();

  useEffect(() => {
    const drawnItems = new L.FeatureGroup();
    map.addLayer(drawnItems);

    const drawControl = new L.Control.Draw({
      edit: {
        featureGroup: drawnItems,
      },
      draw: {
        polygon: true,
        polyline: true,
        rectangle: true,
        circle: true,
        marker: true,
      },
    });

    map.addControl(drawControl);

    map.on(L.Draw.Event.CREATED, (event) => {
      const layer = event.layer;
      drawnItems.addLayer(layer);

      const drawnData = layer.toGeoJSON();
      console.log(drawnData); // This is the data you will send to the backend
    });

    return () => {
      map.off(L.Draw.Event.CREATED);
      map.removeControl(drawControl);
    };
  }, [map]);

  return null;
};


export const Canvas = () => {
 
  return (
    <Layout>
      <div className='flex gap-4'>
      <AdminSideBar />
      <MapContainer center={[51.505, -0.09]} zoom={13} style={{ height: '100vh', width: '100%' }}>
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
      />
      <DrawMap />
    </MapContainer>
      {/* <button >Save</button> */}
      </div>
    </Layout>
  )
}
