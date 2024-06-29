import React, { useRef } from 'react'
import Layout from '../Layout/Layout'
import AdminSideBar from './AdminSideBar'
import CanvasDraw from 'react-canvas-draw';

export const Canvas = () => {
  const canvasRef = useRef(null);

  const saveDrawing = () => {
    const drawingData = canvasRef.current.getSaveData();
    onSave(drawingData);
  };
  return (
    <Layout>
      <AdminSideBar />
      <div>
      <CanvasDraw  />
      <button onClick={saveDrawing}>Save</button>
      </div>
    </Layout>
  )
}
