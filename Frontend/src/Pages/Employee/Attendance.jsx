// import React from 'react';

// import Header from '../../Components/Header'; // Adjust path if needed
// import Sidebar from '../../Components/Sidebar'; // Adjust path if needed
// import {
//     BarChart,
//     Bar,
//     XAxis,
//     YAxis,
//     Tooltip,
//     ResponsiveContainer
// } from 'recharts';
// import { Fingerprint } from 'lucide-react';

// const data = [
//     { name: 'Jan', Attendance: 24 },
//     { name: 'Feb', Attendance: 27 },
//     { name: 'Mar', Attendance: 17 },
//     { name: 'Apr', Attendance: 20 },
//     { name: 'May', Attendance: 23 },
//     { name: 'Jun', Attendance: 0 },
//     { name: 'Jul', Attendance: 0 },
//     { name: 'Aug', Attendance: 0 },
//     { name: 'Sep', Attendance: 0 },
//     { name: 'Oct', Attendance: 0 },
//     { name: 'Nov', Attendance: 0 },
//     { name: 'Dec', Attendance: 0 },
// ];

// const MainContent = () => {
//     return (
//         <div className="min-h-screen bg-gray-100 flex flex-col">
//             {/* Header at the top */}
//             <Header />

//             {/* Content below header */}
//             <div className="flex flex-1">
//                 {/* Sidebar */}
//                 <Sidebar />


//                 {/* Page Content */}
//                 <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
//                     {/* Page Title */}
//                     <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-4 sm:mb-6">
//                         Attendance
//                     </h1>

//                     {/* Biometric Card */}
//                     <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6 flex flex-col sm:flex-row justify-around sm:items-center gap-6 sm:gap-0 mb-6 sm:mb-8">
//                         <div className="flex justify-center">
//                             <Fingerprint size={120} className="text-purple-600 sm:size-[180px]" />
//                         </div>
//                         <div className="flex flex-col items-start sm:items-start text-center sm:text-left">
//                             <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
//                                 Give me your Biometric for today's attendance
//                             </h2>
//                             <button className="px-4 py-2 bg-white border border-gray-200 shadow-sm rounded-md text-purple-600 font-medium hover:shadow-md transition">
//                                 Let's do it &rarr;
//                             </button>
//                         </div>
//                     </div>

//                     {/* Attendance Statistics */}
//                     <div className="bg-white rounded-2xl shadow-md p-4 sm:p-6">
//                         <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
//                             <h2 className="text-md sm:text-lg font-semibold text-gray-800">
//                                 Attendance Statistics
//                             </h2>
//                             <div className="flex items-center gap-2">
//                                 <span className="text-sm text-purple-600 font-semibold">Attendance</span>
//                                 <select className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none">
//                                     <option>This Year</option>
//                                     <option>This Month</option>
//                                 </select>
//                             </div>
//                         </div>
//                         <ResponsiveContainer width="100%" height={250}>
//                             <BarChart data={data}>
//                                 <XAxis dataKey="name" />
//                                 <YAxis />
//                                 <Tooltip />
//                                 <Bar dataKey="Attendance" fill="#7c3aed" radius={[6, 6, 0, 0]} />
//                             </BarChart>
//                         </ResponsiveContainer>
//                     </div>
//                 </main>

//             </div>
//         </div>
//     );
// };

// export default MainContent;

import React, { use, useState } from 'react';
import Header from '../../Components/Header';
import Sidebar from '../../Components/Sidebar';
import { useSelector } from 'react-redux';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import { Fingerprint } from 'lucide-react';

const MainContent = () => {
  const [showModal, setShowModal] = useState(false);
  const [username, setUsername] = useState('');
  const [id, setid] = useState('');
  const [toast, setToast] = useState({ message: '', type: '' }); // success | error | loading
    const [selectedMonth, setSelectedMonth] = useState('2025-06');
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(false);

  const attendanceStatus = useSelector((state) => state.auth.status);

  const user = useSelector((state) => state.auth.user);

  const showToast = (message, type) => {
  setToast({ message, type });
  setTimeout(() => setToast({ message: '', type: '' }), 4000);
  };

  const handleAttendance = () => {
    if (!username.trim()) {
      showToast("❗ Please enter your username.", "error");
      return;
    }else if(!id.trim()) {
             showToast("❗ Please enter your id.", "error");
      return;
    }else if(username !== user.username || id !== user.id) {
      showToast("❗ User ID or Username does not match to the logged in user.", "error");
      return;
    }

    showToast("📍 Getting your location...", "loading");

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        };
        console.log("Location:", location);

        try {
          const res = await fetch("https://attendance-and-payroll-management.onrender.com/api/mark-attendance", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, location, id}),
          });
          
          const data = await res.json();

          if (res.ok) {
            showToast(data.message || "✅ Attendance marked successfully.", "success");
            setUsername("");
            setShowModal(false);
          } else {
            showToast(data.message || "❌ Failed to mark attendance.", "error");
          }
        } catch (err) {
          console.error(err);
          showToast("❌ Server error. Please try again later.", "error");
        }
      },
      (err) => {
        console.error(err);
        showToast("❌ Location access denied. Please allow location access.", "error");
      }
    );
  };

  useEffect(() => {
    const fetchAttendanceData = async () => {
      setLoading(true);
      try {
        const res = await fetch(`https://attendance-and-payroll-management.onrender.com/api/getAllAttendanceByMonthofuser/${user.id}/${selectedMonth}`);
        const attendanceRecords = await res.json();

        const presentDates = new Set(attendanceRecords.map(att => att.date));
        console.log("Present Dates:", presentDates);
        const [year, month] = selectedMonth.split("-");
        const daysInMonth = new Date(Number(year), Number(month), 0).getDate();

        const data = Array.from({ length: daysInMonth }, (_, i) => {
          const day = String(i + 1).padStart(2, '0');
          const dateKey = `${selectedMonth}-${day}`;
          return {
            name: `Day ${i + 1}`,
            Attendance: presentDates.has(dateKey) ? 1 : 0,
          };
        });

        setChartData(data);
      } catch (error) {
        console.error("Error loading chart data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (user?.id) fetchAttendanceData();
  }, [selectedMonth, user?.id]);


  

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col relative">
      <Header />
      <div className="flex flex-1">
        <Sidebar />
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto">
          <h1 className="text-xl sm:text-2xl font-semibold text-gray-800 mb-6">
            Attendance
          </h1>

          {/* Biometric Card */}
          <div className="bg-white rounded-2xl shadow-md p-6 flex flex-col sm:flex-row justify-around sm:items-center gap-6 mb-8">
            <div className="flex justify-center">
              <Fingerprint size={120} className="text-purple-600 sm:size-[180px]" />
            </div>
            <div className="flex flex-col items-center sm:items-start text-center sm:text-left">
              <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-2">
                Give me your Biometric for today's attendance
              </h2>
              <button
                onClick={() => setShowModal(true)}
                className="px-4 py-2 bg-white border border-gray-200 shadow-sm rounded-md text-purple-600 font-medium hover:shadow-md transition"
              >
                Let's do it &rarr;
              </button>
            </div>
          </div>

          {/* Attendance Statistics */}
          <div className="bg-white rounded-2xl shadow-md p-6">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-4">
              <h2 className="text-md sm:text-lg font-semibold text-gray-800">Attendance Statistics</h2>
              <div className="flex items-center gap-2">
                <span className="text-sm text-purple-600 font-semibold">Month</span>
                <select
                  className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none"
                  value={selectedMonth}
                  onChange={(e) => setSelectedMonth(e.target.value)}
                >
                  <option value="2025-06">June 2025</option>
                  <option value="2025-05">May 2025</option>
                  <option value="2025-04">April 2025</option>
                </select>
              </div>
            </div>
            {loading ? (
              <p className="text-center text-gray-500">Loading chart...</p>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <BarChart data={chartData}>
                  <XAxis dataKey="name" />
                  <YAxis ticks={[0, 1]} domain={[0, 1]} />
                  <Tooltip formatter={(value) => value === 1 ? 'Present' : 'Absent'} />
                  <Bar dataKey="Attendance" fill="#7c3aed" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            )}
          </div>
        </main>
      </div>

      {/* Modal */}
   {showModal && (
  <div className="fixed inset-0  bg-opacity-20 backdrop-blur-sm flex items-center justify-center z-50">
    <div className="bg-white p-6 w-96 rounded-xl shadow-lg text-center space-y-4 relative transition-transform duration-300 transform scale-100">
      <h2 className="text-xl font-semibold text-gray-800">📅 Mark Your Attendance</h2>
           <input
        type="text"
        placeholder="Enter your id"
        value={id}
        onChange={(e) => setid(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md"
      />
      {/* {console.log("id:",id)} */}
      <input
        type="text"
        placeholder="Enter your username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full px-4 py-2 border border-gray-300 rounded-md"
      />
      <button
        onClick={handleAttendance}
        className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        ✅ Mark Attendance
      </button>
      <button
        onClick={() => setShowModal(false)}
        className="absolute top-2 right-3 text-gray-500 hover:text-red-500 text-xl"
      >
        ✕
      </button>
    </div>
  </div>
)}

      {/* Toast Notification */}
      {toast.message && (
        <div className={`fixed top-6 right-3 px-4 py-3 rounded-md shadow-lg text-white z-50
          ${toast.type === 'success' ? 'bg-green-500' :
            toast.type === 'error' ? 'bg-red-500' : 'bg-yellow-500'}
        `}>
          {toast.message}
        </div>
      )}
    </div>
  );
};

export default MainContent; 
