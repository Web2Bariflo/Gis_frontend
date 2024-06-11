import axios from "axios";
import React, { useEffect, useState } from "react";
import URL from "../../URL";
import { toast } from 'react-toastify';

const generateTimeSlots = () => {
  const times = [];
  const start = 6; // 6:00 AM
  const end = 24; // 12:00 AM next day

  for (let hour = start; hour <= end; hour++) {
    for (let minute = 0; minute < 60; minute += 30) {
      const time = new Date();
      time.setHours(hour);
      time.setMinutes(minute);
      time.setSeconds(0);
      times.push(time.toTimeString().slice(0, 8)); // Extract "HH:mm:ss"
    }
  }

  return times;
};

const TaskassignModel = ({ selectedPond, setShowTaskModel,setSelectedPond }) => {
  const BASEURL = URL();
  const [category, setCategory] = useState([]);
  const [workers, setWorkers] = useState([]); // State for workers
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedStartTime, setSelectedStartTime] = useState('');
  const [selectedEndTime, setSelectedEndTime] = useState('');
  const [selectedWorker, setSelectedWorker] = useState(''); // State for selected worker
  const [quantity, setQuantity] = useState(null);
  const [tasks, setTasks] = useState([]);
  const [fromHour, setFromHour] = useState('');
  const [fromMinute, setFromMinute] = useState('');
  const [toHour, setToHour] = useState('');
  const [toMinute, setToMinute] = useState('');

  const timeSlots = generateTimeSlots();
  const pondIds = selectedPond.map(pond => pond.id);
  const pondId = selectedPond.map(pond => pond.id);

  const fetchCategory = async () => {
    try {
      const res = await axios.get(`${BASEURL}/category/`);
      setCategory(res.data.category);
    } catch (error) {
      console.log(error);
    }
  };

  const fetchWorkers = async () => {
    const authString = localStorage.getItem("auth");
    const auth = JSON.parse(authString);
    const userId = auth.Mob;
    try {
      const res = await axios.get(`${BASEURL}/workerview/${userId}/`);
      setWorkers(res.data.Employee);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    fetchCategory();
    fetchWorkers();
  }, []);

  const addTask = () => {
    if (selectedCategory === 'Feeding' && !quantity) {
      toast.error("Please enter quantity");
      return;
    } else if (selectedCategory && selectedStartTime && selectedEndTime && selectedWorker && selectedPond) {
      const newTasks = selectedPond.map(pond => [
        selectedCategory,
        selectedStartTime,
        selectedEndTime,
        selectedWorker,
        quantity,
        pond.id
      ]);

      setTasks([...tasks, ...newTasks]);
      setSelectedCategory('');
      setSelectedStartTime('');
      setSelectedEndTime('');
      setSelectedWorker('');
      setQuantity(null);
      setFromHour('');
      setFromMinute('');
      setToHour('');
      setToMinute('');
      toast.success("Task Added Successfully");
    }
  };

  const submitTask = async () => {
    try {
      const res = await axios.post(`${BASEURL}/work_assign/`, { tasks });
      if (res.data.message) {
        toast.success(res.data.message);
      }
      setShowTaskModel(false);
      setTasks([]);
      setSelectedPond([])
    } catch (error) {
      console.log(error);
      toast.error("An error occurred while submitting the tasks");
    }
  };

  const handleChange = (e) => {
    let value = Number(e.target.value);
    setQuantity(value);
  };

  const handleBlur = () => {
    if (!isNaN(quantity) && quantity !== '') {
      setQuantity(parseFloat(quantity).toFixed(2));
    }
  };

  const handleHourChange = (event) => {
    const value = event.target.value;
    if (/^\d{0,2}$/.test(value)) {
      setFromHour(value);
    }
  };

  const handleMinuteChange = (event) => {
    const value = event.target.value;
    if (/^\d{0,2}$/.test(value)) {
      setFromMinute(value);
    }
  };

  const handleBlurs = () => {
    if (fromHour.length === 1) setFromHour('0' + fromHour);
    if (fromMinute.length === 1) setFromMinute('0' + fromMinute);
    const formattedTime = `${fromHour}:${fromMinute}`;
    setSelectedStartTime(formattedTime);
  };

  const handleToHourChange = (event) => {
    const value = event.target.value;
    if (/^\d{0,2}$/.test(value)) {
      setToHour(value);
    }
  };

  const handleToMinuteChange = (event) => {
    const value = event.target.value;
    if (/^\d{0,2}$/.test(value)) {
      setToMinute(value);
    }
  };

  const handleBlursto = () => {
    if (toHour.length === 1) setToHour('0' + toHour);
    if (toMinute.length === 1) setToMinute('0' + toMinute);
    const formattedTime = `${toHour}:${toMinute}`;
    setSelectedEndTime(formattedTime);
  };

  const handleDeleteTask = (index) => {
    const newTasks = tasks.filter((_, i) => i !== index);
    setTasks(newTasks);
    toast.success("Task Deleted Successfully");
  };

  return (
    <div className="flex flex-col p-5 pb-2 relative h-full">
      <h1 className="text-2xl mx-auto font-semibold">Taskassign Pond Lists</h1>
      <span className="absolute top-4 right-4" onClick={() => setShowTaskModel(false)}>
        <i className="fa-solid fa-xmark text-2xl hover:text-green-700 cursor-pointer"></i>
      </span>
      <div className="flex m-4 mx-auto flex-wrap">
        {selectedPond.map((pond, index) => (
          <span
            key={index}
            className="flex items-center justify-center p-3 mx-auto bg-blue-100 rounded-md shadow-lg shadow-blue-500/50 mr-3"
          >
            {pond.name}
          </span>
        ))}
      </div>
      <div className="w-full flex justify-center items-center flex-col lg:flex-row lg:space-x-4 md:justify-between lg:justify-around mx-auto mt-4 space-y-4 md:space-y-4 flex-wrap">
        <div className="relative inline-block text-left w-full lg:w-auto mt-4">
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="w-full lg:w-auto text-black bg-blue-100 hover:bg-blue-100 focus:ring-4 focus:outline-none focus:ring-blue-100 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <option value="" disabled>Select Category</option>
            {category.map((item, index) => (
              <option key={index} value={item.name}>{item.name}</option>
            ))}
          </select>
        </div>
        <div className="flex space-x-2 items-center w-full lg:w-auto">
          <div className="relative inline-block text-left p-0">
            <input
              type="text"
              placeholder="HH"
              value={fromHour}
              onChange={handleHourChange}
              onBlur={handleBlurs}
              className="w-14 bg-blue-100 text-black hover:bg-blue-100 focus:ring-4 focus:outline-none focus:ring-blue-100 font-medium rounded-lg text-sm text-center px-1 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            />
          </div>
          <span className="mx-1 font-medium">:</span>
          <div className="relative inline-block text-left">
            <input
              type="text"
              placeholder="MM"
              value={fromMinute}
              onChange={handleMinuteChange}
              onBlur={handleBlurs}
              className="w-14 bg-blue-100 text-black hover:bg-blue-100 focus:ring-4 focus:outline-none focus:ring-blue-100 font-medium rounded-lg text-sm px-1 text-center py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            />
          </div>
          <span className="mx-2 font-medium">to</span>
          <div className="relative inline-block text-left">
            <input
              type="text"
              value={toHour}
              onChange={handleToHourChange}
              onBlur={handleBlursto}
              placeholder="HH"
              className="w-14 bg-blue-100 text-black hover:bg-blue-100 focus:ring-4 focus:outline-none focus:ring-blue-100 font-medium rounded-lg text-sm text-center px-1 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            />
          </div>
          <span className="mx-1 font-medium">:</span>
          <div className="relative inline-block text-left">
            <input
              type="text"
              value={toMinute}
              onChange={handleToMinuteChange}
              onBlur={handleBlursto}
              placeholder="MM"
              className="w-14 bg-blue-100 text-black hover:bg-blue-100 focus:ring-4 focus:outline-none focus:ring-blue-100 font-medium rounded-lg text-sm text-center px-1 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
            />
          </div>
        </div>
        <div className="relative inline-block text-left w-full lg:w-auto">
          <select
            value={selectedWorker}
            onChange={(e) => setSelectedWorker(e.target.value)}
            className="w-full lg:w-auto bg-blue-100 text-black hover:bg-blue-100 focus:ring-4 focus:outline-none focus:ring-blue-100 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            <option value="" disabled>Select Worker</option>
            {workers.map((worker, index) => (
              <option key={index} value={worker.name}>{worker.name}</option>
            ))}
          </select>
        </div>
        {selectedCategory === 'Feeding' && (
          <div className="relative inline-block text-left w-full lg:w-auto">
            <input
              type="text"
              value={quantity}
              onChange={handleChange}
              onBlur={handleBlur}
              placeholder="Quantity"
              className="w-full lg:w-auto bg-blue-100 text-black focus:ring-4 focus:outline-none focus:ring-blue-100 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:focus:ring-blue-800"
            />
          </div>
        )}
        <div className="relative inline-block text-left w-full lg:w-auto">
          <button
            onClick={addTask}
            className="w-full lg:w-auto bg-blue-100 text-black hover:bg-blue-100 focus:ring-4 focus:outline-none focus:ring-blue-100 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          >
            Add Task
          </button>
        </div>
      </div>
      <div className="w-full h-64 flex flex-col mx-auto mt-8 overflow-scroll">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50 text-center">
            <tr>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Start Time
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                End Time
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Worker
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Quantity
              </th>
              <th scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 text-center">
            {tasks.map((task, index) => (
              <tr key={index}>
                <td className="px-6 py-4 whitespace-nowrap">{task[0]}</td>
                <td className="px-6 py-4 whitespace-nowrap">{task[1]}</td>
                <td className="px-6 py-4 whitespace-nowrap">{task[2]}</td>
                <td className="px-6 py-4 whitespace-nowrap">{task[3]}</td>
                <td className="px-6 py-4 whitespace-nowrap">{task[4]}</td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                <button
                  onClick={() => handleDeleteTask(index)}
                  className="text-red-600 hover:text-red-900"
                >
                  <i className="fa-regular fa-trash-can"></i>
                </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {tasks.length > 0 && (
        <div className="flex justify-end">
          <button className="h-max bg-blue-100 text-black p-3 px-5 rounded-lg mt-4 hover:bg-green-500 font-semibold flex justify-end items-end ml-[63%]" onClick={submitTask}>Submit Task</button>
        </div>
      )}
    </div>
  );
};

export default TaskassignModel;
