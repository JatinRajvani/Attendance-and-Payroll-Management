import React, { useState,useEffect } from "react";
import Header from "../../Components/Header";
import Sidebar from "../../Components/HRSidebar";

const AddEmployee = () => {
  const [formData, setFormData] = useState({
    name: "",
    id:"",
    address: "",
    bankAccount: "",
    mobile: "",
    email: "",
    password: "",
    role: "",
    salary: "",
    employmentType: "",
    attendanceType: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

 const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch(
        "https://attendance-and-payroll-management.onrender.com/api/add",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      console.log("Request Payload:", formData);
      console.log("Response Status:", response.status);
      if (response.ok) {
        alert("✅ Employee added successfully!");
        console.log("Server Response:", data);
        setFormData({
          name: "",
          id: "",
          address: "",
          bankAccount: "",
          mobile: "",
          email: "",
          password: "",
          role: "",
          salary: "",
          employmentType: "",
          attendanceType: "",
        });
      } else {
        alert(`❌ Error: ${data.message || "Failed to add employee."}`);
      }
    } catch (error) {
      console.error("❌ Network error:", error);
      alert("❌ Network error while adding employee.");
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
        <div className="flex-1 p-6 bg-gray-50">
          <h2 className="text-2xl font-semibold mb-6">Add Employee</h2>

          <form
            onSubmit={handleSubmit}
            className="bg-white p-8 rounded-xl shadow-md max-w-7xl grid grid-cols-1 md:grid-cols-2 gap-6 w-full"
          >
            <div>
              <label className="block text-sm font-medium mb-1">
                Employee Name:
              </label>
              <input
                type="text"
                name="name"
                placeholder="ex. John Doe"
                value={formData.name}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
                required
              />
            </div>
              <div>
              <label className="block text-sm font-medium mb-1">
                Employee id:
              </label>
              <input
                type="text"
                name="id"
                placeholder="ex. CS001"
                value={formData.id}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Employee Address:
              </label>
              <input
                type="text"
                name="address"
                placeholder="ex. House no, Society name, District, State"
                value={formData.address}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Employee Bank Account No.:
              </label>
              <input
                type="text"
                name="bankAccount"
                placeholder="ex. ************"
                value={formData.bankAccount}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Employee Mobile No.:
              </label>
              <input
                type="text"
                name="mobile"
                placeholder="ex. 9876543273"
                value={formData.mobile}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Employee Mail ID:
              </label>
              <input
                type="email"
                name="email"
                placeholder="ex. abc@mail.com"
                value={formData.email}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Employee Password:
              </label>
              <input
                type="password"
                name="password"
                placeholder="ex. 123"
                value={formData.password}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Employee Role:
              </label>
              <input
                type="text"
                name="role"
                placeholder="ex. Software Engineer"
                value={formData.role}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Employee Salary:
              </label>
              <input
                type="text"
                name="salary"
                placeholder="ex. 20,000"
                value={formData.salary}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Employment Type:
              </label>
              <select
                name="employmentType"
                value={formData.employmentType}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
                required
              >
                <option value="">Please Select</option>
                <option value="Full Time">Full Time</option>
                <option value="Part Time">Part Time</option>
                <option value="Contract">Contract</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">
                Employee Attendance Type:
              </label>
              <select
                name="attendanceType"
                value={formData.attendanceType}
                onChange={handleChange}
                className="w-full border px-4 py-2 rounded"
                required
              >
                <option value="">Please Select</option>
                <option value="Daily">Daily</option>
                <option value="Hourly">Hourly</option>
              </select>
            </div>

            <div className="col-span-1 md:col-span-2 mt-4">
              <button
                type="submit"
                className="bg-purple-600 text-white font-semibold px-6 py-2 rounded hover:bg-purple-700 shadow"
              >
                Add Employee
              </button>
            </div>
          </form>
        </div>
    </div>
  );
};

export default AddEmployee;
