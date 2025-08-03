import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useAdminSession } from "../hooks/useAdminSession";
import AdminNavbar from "../components/AdminNavbar";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Footer from "../components/Footer";
import * as XLSX from "xlsx";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const ManageLeaves = () => {
  const { admin, loading } = useAdminSession();
  const navigate = useNavigate();

  const [leaves, setLeaves] = useState([]);
  const [leavesByEmployee, setLeavesByEmployee] = useState({});
  const [approvingLeaveId, setApprovingLeaveId] = useState(null);
  const [rejectingLeaveId, setRejectingLeaveId] = useState(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [rejectingNowId, setRejectingNowId] = useState(null);
  const [showMap, setShowMap] = useState(null);
  const [showInfo, setShowInfo] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  useEffect(() => {
    if (!loading && !admin) {
      toast.warn("Session expired. Please login again.", {
        position: "top-right",
        autoClose: 3000,
        theme: "colored",
      });
      navigate("/admin/login");
    }
  }, [admin, loading, navigate]);

  useEffect(() => {
    if (admin) fetchLeaves();
  }, [admin]);

  const getDatesInRange = (start, end) => {
    const dates = [];
    let current = new Date(start);
    const last = new Date(end);
    while (current <= last) {
      dates.push(current.toISOString().slice(0, 10));
      current.setDate(current.getDate() + 1);
    }
    return dates;
  };

  const fetchLeaves = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/admin/leaves`, {
        withCredentials: true,
      });

      const sortedLeaves = res.data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));


      setLeaves(sortedLeaves);

      const empMap = {};
      sortedLeaves.forEach((leave) => {
        if (!leave.employee?._id) return;
        const empId = leave.employee._id;

        if (!empMap[empId]) {
          empMap[empId] = {
            employee: leave.employee,
            earnedDays: new Set(),
            sickDays: new Set(),
            casualDays: new Set(),
          };
        }

        if (leave.status !== "Approved") return;

        const dates = getDatesInRange(leave.startDate, leave.endDate);
        const type = (leave.leaveType || "").toLowerCase();

        if (type.includes("earned")) {
          dates.forEach((d) => empMap[empId].earnedDays.add(d));
        } else if (type.includes("sick")) {
          dates.forEach((d) => empMap[empId].sickDays.add(d));
        } else if (type.includes("casual")) {
          dates.forEach((d) => empMap[empId].casualDays.add(d));
        }
      });

      setLeavesByEmployee(empMap);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch leave data", {
        position: "top-right",
        theme: "colored",
      });
    }
  };

  const handleApprove = async (id) => {
    setApprovingLeaveId(id);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/leave-decision/${id}`,
        {
          action: "Approved",
          reviewer: { username: admin.username, role: "Admin" },
        },
        { withCredentials: true }
      );
      toast.success(res.data.message || "Leave approved");
      await fetchLeaves();
    } catch (err) {
      toast.error(err.response?.data?.message || "Approval failed");
    } finally {
      setApprovingLeaveId(null);
    }
  };

  const handleReject = async () => {
    if (!rejectionReason.trim()) {
      toast.warn("Please provide a reason for rejection.");
      return;
    }

    setRejectingNowId(rejectingLeaveId);
    try {
      const res = await axios.put(
        `${import.meta.env.VITE_API_BASE_URL}/api/admin/leave-decision/${rejectingLeaveId}`,
        {
          action: "Rejected",
          reason: rejectionReason,
          reviewer: { username: admin.username, role: "Admin" },
        },
        { withCredentials: true }
      );
      toast.success(res.data.message || "Leave rejected");
      setRejectingLeaveId(null);
      setRejectionReason("");
      await fetchLeaves();
    } catch (err) {
      toast.error(err.response?.data?.message || "Rejection failed");
    } finally {
      setRejectingNowId(null);
    }
  };
  const filteredLeaves = leaves.filter((leave) => {
  const search = searchTerm.toLowerCase();
  const empName = leave.employee?.username?.toLowerCase() || "";
  const empId = leave.employee?.employeeId?.toLowerCase() || "";
  const type = leave.leaveType?.toLowerCase() || "";
  const status = leave.status?.toLowerCase() || "";
  return (
    empName.includes(search) ||
    empId.includes(search) ||
    type.includes(search) ||
    status.includes(search)
  );
});
const exportToExcel = () => {
  const data = filteredLeaves.map((l) => ({
    Employee: `${l.employee?.username} (${l.employee?.employeeId})`,
    Type: l.leaveType,
    Status: l.status,
    Reason: l.reason || "N/A",
    From: new Date(l.startDate).toLocaleDateString(),
    To: new Date(l.endDate).toLocaleDateString(),
  }));
  const worksheet = XLSX.utils.json_to_sheet(data);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Leaves");
  XLSX.writeFile(workbook, "leaves.xlsx");
};

const exportToPDF = () => {
  const input = document.getElementById("leaveCards");
  html2canvas(input).then((canvas) => {
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
    pdf.save("leaves.pdf");
  });
};



  return (
    <div>
      <AdminNavbar />
      <ToastContainer />
      <div className="p-6 max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold mb-6 text-center text-indigo-700">
          Manage Leave Requests
        </h2>
<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3">
  <input
    type="text"
    placeholder="Search by name, ID, type or status..."
    value={searchTerm}
    onChange={(e) => setSearchTerm(e.target.value)}
    className="border rounded px-3 py-2 w-full sm:max-w-md"
  />
  <div className="flex gap-2">
    <button
      onClick={exportToExcel}
      className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded"
    >
      Export Excel
    </button>
    <button
      onClick={exportToPDF}
      className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded"
    >
      Export PDF
    </button>
  </div>
</div>

        {leaves.length === 0 ? (
          <p className="text-center text-gray-600">No leave requests available.</p>
        ) : (
          <div id="leaveCards" className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">

            {filteredLeaves.map((leave) => {

              const empLeaves = leavesByEmployee[leave.employee?._id] || {
                earnedDays: new Set(),
                sickDays: new Set(),
                casualDays: new Set(),
              };

              return (
                <div
                  key={leave._id}
                  className="bg-white rounded-lg shadow-lg p-5 space-y-3 border hover:shadow-2xl transition"
                >
                  <div className="text-lg font-semibold text-gray-800">
                    {leave.employee?.username} ({leave.employee?.employeeId})
                  </div>
                  <div className="text-sm text-gray-600">
                    {new Date(leave.startDate).toLocaleDateString()} -{" "}
                    {new Date(leave.endDate).toLocaleDateString()}
                  </div>
                  <p className="text-sm">
                    <strong>Type:</strong> {leave.leaveType}
                  </p>
                  <p className="text-sm">
                    <strong>Reason:</strong> {leave.reason || "N/A"}
                  </p>
                  <p className="text-sm">
                    <strong>Status:</strong> {leave.status}
                  </p>
                  <p className="text-sm">
                    <strong>Reviewed By:</strong>{" "}
                    {leave.reviewedBy?.username
                      ? `${leave.reviewedBy.username} (${leave.reviewedBy.role})`
                      : "Pending"}
                  </p>
                  <p className="text-sm">
                    <strong>Reviewed At:</strong>{" "}
                    {leave.reviewedAt
                      ? new Date(leave.reviewedAt).toLocaleString()
                      : "Not reviewed yet"}
                  </p>
                  <p className="text-sm">
                    <strong>Leave Taken:</strong>
                    <br />
                    Earned: {empLeaves.earnedDays.size} days | Sick:{" "}
                    {empLeaves.sickDays.size} days | Casual:{" "}
                    {empLeaves.casualDays.size} days
                  </p>

                  <div className="flex gap-2 mt-2">
                    <button
                      disabled={
                        leave.status !== "Pending" ||
                        approvingLeaveId === leave._id
                      }
                      onClick={() => handleApprove(leave._id)}
                      className={`flex-1 px-3 py-1 text-white rounded ${
                        leave.status !== "Pending"
                          ? "bg-gray-400"
                          : "bg-green-600 hover:bg-green-700"
                      } flex items-center justify-center`}
                    >
                      {approvingLeaveId === leave._id ? (
                        <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                      ) : (
                        "Approve"
                      )}
                    </button>

                    <button
                      disabled={
                        leave.status !== "Pending" ||
                        rejectingNowId === leave._id
                      }
                      onClick={() => setRejectingLeaveId(leave._id)}
                      className={`flex-1 px-3 py-1 text-white rounded ${
                        leave.status !== "Pending"
                          ? "bg-gray-400"
                          : "bg-red-600 hover:bg-red-700"
                      } flex items-center justify-center`}
                    >
                      {rejectingNowId === leave._id ? (
                        <span className="animate-spin h-5 w-5 border-2 border-white border-t-transparent rounded-full"></span>
                      ) : (
                        "Reject"
                      )}
                    </button>
                  </div>

                  <div className="flex gap-2 mt-2">
                    <button
                      onClick={() => setShowMap(leave)}
                      className="flex-1 px-3 py-1 bg-blue-600 hover:bg-blue-700 text-white rounded"
                    >
                      View Location
                    </button>
                    <button
                      onClick={() => setShowInfo(leave)}
                      className="flex-1 px-3 py-1 bg-indigo-600 hover:bg-indigo-700 text-white rounded"
                    >
                      More Info
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {rejectingLeaveId && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
              <h3 className="text-lg font-bold mb-3 text-red-600">
                Enter Rejection Reason
              </h3>
              <textarea
                rows="4"
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                className="w-full border p-2 rounded mb-4"
                placeholder="Reason for rejecting leave..."
              />
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => {
                    setRejectingLeaveId(null);
                    setRejectionReason("");
                  }}
                  className="px-4 py-1 bg-gray-400 text-white rounded"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  className="px-4 py-1 bg-red-600 text-white rounded"
                >
                  Submit
                </button>
              </div>
            </div>
          </div>
        )}

        {showMap && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-4 rounded-lg shadow-lg w-full max-w-md relative">
              <h3 className="text-lg font-bold mb-2 text-blue-700">Location Map</h3>
              <iframe
                title="Google Maps"
                width="100%"
                height="300"
                style={{ border: 0 }}
                loading="lazy"
                allowFullScreen
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://maps.google.com/maps?q=${showMap.latitude},${showMap.longitude}&z=15&output=embed`}
              ></iframe>
              <div className="flex justify-end mt-4">
                <button
                  onClick={() => setShowMap(null)}
                  className="px-4 py-1 bg-gray-500 text-white rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}

        {showInfo && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-sm">
              <h3 className="text-lg font-bold mb-3 text-indigo-700">More Info</h3>
              <p className="text-sm mb-2">
                <strong>IP Address:</strong> {showInfo.ipAddress || "Not Available"}
              </p>
              <p className="text-sm mb-4">
                <strong>Location Name:</strong> {showInfo.locationName || "Not Available"}
              </p>
              <div className="flex justify-end">
                <button
                  onClick={() => setShowInfo(null)}
                  className="px-4 py-1 bg-gray-500 text-white rounded"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
      <Footer />
    </div>
  );
};

export default ManageLeaves;
