import { useEffect, useRef, useState } from 'react';

const useWebSocket = (url) => {
  const [data, setData] = useState(() => {
    // Initialize data from local storage if available
    const storedData = localStorage.getItem('data');
    return storedData ? JSON.parse(storedData) : [];
  });
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const reconnectTimeout = useRef(null);

  useEffect(() => {
    const connectWebSocket = () => {
      if (socketRef.current) {
        socketRef.current.close();
      }

      socketRef.current = new WebSocket(url);

      socketRef.current.onopen = () => {
        console.log("WebSocket connection established");
        setIsConnected(true);
        socketRef.current.send("Connection established");
      };

      socketRef.current.onmessage = (event) => {
        console.log("Message received from WebSocket:", event.data);
        try {
          const parsedData = JSON.parse(event.data);
          setData((prevData) => {
            const newData = [...prevData, parsedData];
            localStorage.setItem('data', JSON.stringify(newData));
            return newData;
          });
        } catch (error) {
          console.error("Error parsing WebSocket message:", error);
        }
      };

      socketRef.current.onclose = () => {
        console.log("WebSocket connection closed, attempting to reconnect...");
        setIsConnected(false);
        // scheduleReconnect();
      };

      socketRef.current.onerror = (error) => {
        console.error("WebSocket error", error);
        socketRef.current.close();
      };
    };

    // const scheduleReconnect = () => {
    //   clearTimeout(reconnectTimeout.current);
    //   reconnectTimeout.current = setTimeout(() => {
    //     connectWebSocket();
    //   }, 5000); // Attempt to reconnect every 5 seconds
    // };

    connectWebSocket();

    // Clean up WebSocket connection and reconnection attempts on component unmount
    return () => {
      clearTimeout(reconnectTimeout.current);
      if (socketRef.current) {
        socketRef.current.close();
      }
    };
  }, [url]); // Removed data from dependency array

  return { data, isConnected };
};

export default useWebSocket;
