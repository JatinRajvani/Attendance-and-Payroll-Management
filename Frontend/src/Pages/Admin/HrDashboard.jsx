// import React from "react";
// import Header from "../../Components/Header";
// import Sidebar from "../../Components/HRSidebar";

// const Dashboard = () => {
//   const employees = [
//     {
//       date: "13/01",
//       name: "Aisha Doe",
//       role: "HR Manager",
//       type: "Full-Time",
//       status: "Present",
//       checkIn: "09:00 AM",
//       checkOut: "05:00 PM",
//     },
//     {
//       date: "13/01",
//       name: "Chukwuemeka",
//       role: "Software Engineer",
//       type: "Part-Time",
//       status: "Absent",
//       checkIn: "-",
//       checkOut: "-",
//     },
//     {
//       date: "13/01",
//       name: "Suleiman",
//       role: "Marketing Executive",
//       type: "Full-Time",
//       status: "Late",
//       checkIn: "10:15 AM",
//       checkOut: "05:00 PM",
//     },
//     {
//       date: "13/01",
//       name: "Olamide",
//       role: "Financial Analyst",
//       type: "Full-Time",
//       status: "Present",
//       checkIn: "09:00 AM",
//       checkOut: "06:00 PM",
//     },
//     {
//       date: "13/01",
//       name: "Jide",
//       role: "Project Manager",
//       type: "Full-Time",
//       status: "Present",
//       checkIn: "09:00 AM",
//       checkOut: "05:00 PM",
//     },
//     {
//       date: "13/01",
//       name: "Femi",
//       role: "Sales Manager",
//       type: "Full-Time",
//       status: "Present",
//       checkIn: "09:00 AM",
//       checkOut: "07:00 PM",
//     },
//   ];

//   const getStatusColor = (status) => {
//     switch (status) {
//       case "Present":
//         return "bg-green-100 text-green-600";
//       case "Late":
//         return "bg-yellow-100 text-yellow-600";
//       case "Absent":
//         return "bg-red-100 text-red-600";
//       default:
//         return "bg-gray-100 text-gray-600";
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col bg-gray-100">
//       {/* Header */}
//       <Header />

//       {/* Body */}
//       <div className="flex flex-1">
//         {/* Sidebar */}
//         <Sidebar />

//         {/* Main Content Area */}
//         <main className="flex-1 h-[calc(100vh-64px)] overflow-y-auto p-6 space-y-6 bg-gray-50">
//           {/* Summary Cards */}
//           <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
//             <div className="bg-white shadow rounded p-4">
//               <h3 className="text-sm text-gray-500">Total Employees</h3>
//               <p className="text-2xl font-semibold">100</p>
//             </div>
//             <div className="bg-white shadow rounded p-4">
//               <h3 className="text-sm text-gray-500">Present Employees</h3>
//               <p className="text-2xl font-semibold text-green-600">90</p>
//             </div>
//             <div className="bg-white shadow rounded p-4">
//               <h3 className="text-sm text-gray-500">Employees on Leave</h3>
//               <p className="text-2xl font-semibold text-red-600">10</p>
//             </div>
//           </div>

//           {/* Attendance Table */}
//           <div className="bg-white shadow rounded p-4">
//             <h2 className="text-lg font-semibold mb-4">Employees Status</h2>
//             <div className="overflow-x-auto">
//               <table className="min-w-full text-sm">
//                 <thead>
//                   <tr className="text-left text-gray-500 border-b">
//                     <th className="p-2">Date</th>
//                     <th className="p-2">Employee</th>
//                     <th className="p-2">Role</th>
//                     <th className="p-2">Employment Type</th>
//                     <th className="p-2">Status</th>
//                     <th className="p-2">Check In</th>
//                     <th className="p-2">Check Out</th>
//                   </tr>
//                 </thead>
//                 <tbody>
//                   {employees.map((emp, idx) => (
//                     <tr key={idx} className="border-b hover:bg-gray-50">
//                       <td className="p-2">{emp.date}</td>
//                       <td className="p-2">{emp.name}</td>
//                       <td className="p-2">{emp.role}</td>
//                       <td className="p-2">
//                         <span className="px-2 py-1 text-xs rounded bg-indigo-100 text-indigo-600">
//                           {emp.type}
//                         </span>
//                       </td>
//                       <td className="p-2">
//                         <span
//                           className={`px-2 py-1 text-xs rounded ${getStatusColor(
//                             emp.status
//                           )}`}
//                         >
//                           {emp.status}
//                         </span>
//                       </td>
//                       <td className="p-2">{emp.checkIn}</td>
//                       <td className="p-2">{emp.checkOut}</td>
//                     </tr>
//                   ))}
//                 </tbody>
//               </table>
//             </div>
//           </div>
//         </main>
//       </div>
//     </div>
//   );
// };

// export default Dashboard;



import React, { useEffect, useState } from "react";
import Header from "../../Components/Header";
import Sidebar from "../../Components/HRSidebar";
import dayjs from "dayjs";

const Dashboard = () => {
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        const response = await fetch("https://attendance-and-payroll-management.onrender.com/api/all-attendance");
        const data = await response.json();

        // Get the last two days
        const today = dayjs();
        const yesterday = today.subtract(1, "day");

        const filtered = data.filter((item) => {
          const recordDate = dayjs(item.date);
          return recordDate.isSame(today, 'day') || recordDate.isSame(yesterday, 'day');
        });

        setEmployees(filtered);
      } catch (error) {
        console.error("❌ Error fetching attendance data:", error);
      }
    };

    fetchAttendance();
  }, []);

  const getStatusColor = (status) => {
    if (!status) return "bg-gray-100 text-gray-600";
    if (status.toLowerCase().includes("present")) return "bg-green-100 text-green-600";
    if (status.toLowerCase().includes("late")) return "bg-yellow-100 text-yellow-600";
    if (status.toLowerCase().includes("absent")) return "bg-red-100 text-red-600";
    return "bg-gray-100 text-gray-600";
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-100">
      <Header />
      <div className="flex flex-1">
        <Sidebar />

        <main className="flex-1 h-[calc(100vh-64px)] overflow-y-auto p-6 space-y-6 bg-gray-50">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white shadow rounded p-4">
              <h3 className="text-sm text-gray-500">Last 2 Days Attendance</h3>
              <p className="text-2xl font-semibold">{employees.length}</p>
            </div>
            <div className="bg-white shadow rounded p-4">
              <h3 className="text-sm text-gray-500">Present</h3>
              <p className="text-2xl font-semibold text-green-600">
                {employees.filter((e) => e.status.toLowerCase().includes("present")).length}
              </p>
            </div>
            <div className="bg-white shadow rounded p-4">
              <h3 className="text-sm text-gray-500">Late / Absent</h3>
              <p className="text-2xl font-semibold text-red-600">
                {employees.filter((e) => e.status.toLowerCase().includes("late") || e.status.toLowerCase().includes("absent")).length}
              </p>
            </div>
          </div>

          {/* Attendance Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full border-collapse rounded overflow-hidden shadow-sm">
              <thead className="bg-blue-100 text-blue-800 text-sm uppercase font-semibold">
                <tr>
                  <th className="p-3 text-left">Date</th>
                  <th className="p-3 text-left">Employee</th>
                  <th className="p-3 text-left">User ID</th>
                  <th className="p-3 text-left">Status</th>
                  <th className="p-3 text-left">Time</th>
                </tr>
              </thead>
              <tbody className="text-gray-700 text-sm">
                {employees.map((emp, idx) => (
                  <tr key={idx} className="border-b hover:bg-gray-50 transition">
                    <td className="p-3">{emp.date}</td>
                    <td className="p-3 font-medium">{emp.username}</td>
                    <td className="p-3">{emp.user_id}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 text-xs rounded font-semibold ${getStatusColor(emp.status)}`}>
                        {emp.status}
                      </span>
                    </td>
                    <td className="p-3">
                      {new Date(emp.time).toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </main>
      </div>
    </div>
  );
};

export default Dashboard;
