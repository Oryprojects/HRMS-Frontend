import { useState, useEffect } from "react";
import { createPortal } from "react-dom";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../utils/api";
import AdminSidebar from "../../components/AdminSidebar";
import EmployeeSelectorModal from "../../components/EmployeeSelectorModal";
import AddEmployeeModal from "../../components/AddEmployeeModal";
import HRSelectorModal from "../../components/HRSelectorModal";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend, Label } from 'recharts';
import { Calendar as CalendarIconSVG, Eye, ShieldCheck, Settings2 } from "lucide-react";
import YearlyHolidayCalendar from "../common/YearlyHolidayCalendar";
import LeaveDetailsModal from "../../components/LeaveDetailsModal";
import NotificationComponent from "../../components/NotificationComponent";
import { toast } from 'react-toastify';

function HRTeamDisplay() {
  const [hrUsers, setHrUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchHRTeam = async () => {
      try {
        setLoading(true);
        const usersRes = await api("/api/users");
        const usersData = await usersRes.json();
        const hrUsersList = Array.isArray(usersData) ? usersData.filter(u => u.role === 'HR') : [];

        const empRes = await api("/api/employees");
        const empData = await empRes.json();
        const employeesList = Array.isArray(empData.data) ? empData.data : [];

        const hrTeam = hrUsersList.map(user => {
          const employee = employeesList.find(emp => emp.userId === user.id);
          return {
            ...user,
            officeId: employee?.officeId || 'N/A',
            firstName: employee?.firstName || 'N/A',
            lastName: employee?.lastName || '',
            phoneNumber: employee?.phoneNumber || 'N/A',
            designation: employee?.designation || 'HR',
            corporateEmail: employee?.corporateEmail || user.email,
          };
        });

        setHrUsers(hrTeam);
      } catch (error) {
        console.error("Error fetching HR team:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchHRTeam();
  }, []);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-24 space-y-4 opacity-30">
        <div className="w-10 h-10 border-4 border-brand-blue border-t-transparent rounded-full animate-spin" />
        <p className="text-[9px] font-black uppercase tracking-[0.3em] text-brand-blue">Synchronizing Team Data</p>
      </div>
    );
  }

  if (hrUsers.length === 0) {
    return (
      <div className="bg-white/50 backdrop-blur-md rounded-[32px] p-20 text-center border border-dashed border-brand-blue/20 shadow-xl shadow-brand-blue/5">
        <div className="w-16 h-16 bg-brand-blue/5 rounded-full flex items-center justify-center mx-auto mb-6">
          <svg className="w-8 h-8 text-brand-blue/20" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-black text-brand-blue tracking-tight">Personnel Registry Empty</h3>
        <p className="text-[10px] text-brand-blue/30 mt-2 font-black uppercase tracking-[0.2em]">Administrative provision required</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {hrUsers.map((hr) => (
        <div key={hr.id} className="group relative bg-white rounded-2xl p-5 shadow-xl shadow-brand-blue/5 border border-brand-blue/[0.03] hover:border-brand-blue/10 transition-all duration-300">
          <div className="flex flex-col items-center text-center">
            <div className="w-12 h-12 bg-brand-blue rounded-full flex items-center justify-center text-white font-black text-sm shadow-md shadow-brand-blue/10 mb-3 group-hover:scale-105 transition-transform">
              {hr.firstName?.[0]}{hr.lastName?.[0]}
            </div>
            <h3 className="font-extrabold text-sm text-brand-blue tracking-tight leading-tight truncate w-full">
              {hr.firstName} {hr.lastName}
            </h3>
            <span className="mt-1.5 px-3 py-1 bg-brand-yellow/10 text-brand-blue text-[8px] font-black uppercase tracking-widest rounded-full border border-brand-yellow/20">
              {hr.designation}
            </span>
            <div className="mt-4 w-full space-y-2">
              <div className="flex items-center gap-2.5 p-2 bg-bg-slate/30 rounded-xl group-hover:bg-bg-slate/50 transition-colors">
                <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center text-brand-blue/40 shadow-sm flex-shrink-0">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                </div>
                <p className="text-[10px] font-bold text-brand-blue/60 truncate tracking-tight">{hr.corporateEmail}</p>
              </div>
              <div className="flex items-center gap-2.5 p-2 bg-bg-slate/30 rounded-xl group-hover:bg-bg-slate/50 transition-colors">
                <div className="w-6 h-6 bg-white rounded-lg flex items-center justify-center text-brand-blue/40 shadow-sm flex-shrink-0">
                  <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3">
                    <path d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                  </svg>
                </div>
                <p className="text-[10px] font-black text-brand-blue/20 uppercase tracking-[0.2em]">{hr.officeId}</p>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default function AdminDashboard() {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState(location.state?.tab || "dashboard");
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [leaveRequests, setLeaveRequests] = useState([]);
  const [pendingLeaves, setPendingLeaves] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [rejectingLeaveId, setRejectingLeaveId] = useState(null);
  const [rejectReason, setRejectReason] = useState("");
  const [currentUserId, setCurrentUserId] = useState(null);
  const [isAddEmployeeModalOpen, setIsAddEmployeeModalOpen] = useState(false);
  const [isHRModalOpen, setIsHRModalOpen] = useState(false);
  const [hrTeamMembers, setHrTeamMembers] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [leaveSearch, setLeaveSearch] = useState("");
  const [leaveRoleFilter, setLeaveRoleFilter] = useState("ALL");
  const [selectedLeave, setSelectedLeave] = useState(null);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);

  const [stats, setStats] = useState({
    totalEmployees: 0,
    hrUsers: 0,
    pendingLeaves: 0,
    reportingManagers: 0,
  });

  const [isYearlyCalendarOpen, setIsYearlyCalendarOpen] = useState(false);
  const [currentDate, setCurrentDate] = useState(new Date());
  const [calendarData, setCalendarData] = useState({});
  const [hoveredLeaveData, setHoveredLeaveData] = useState(null);

  const fetchCalendarData = async (date) => {
    try {
      const year = date.getFullYear();
      const month = date.getMonth();
      const formatDateLocal = (d) => {
        const y = d.getFullYear();
        const m = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${y}-${m}-${day}`;
      };
      const start = formatDateLocal(new Date(year, month, 1));
      const end = formatDateLocal(new Date(year, month + 1, 0));
      const res = await api(`/api/attendance/calendar?start=${start}&end=${end}`);
      const data = await res.json();
      if (data.status === "success") {
        setCalendarData(data.data.dailyLeaves || {});
      }
    } catch (error) {
      console.error("Error fetching calendar data:", error);
    }
  };

  useEffect(() => {
    fetchCalendarData(currentDate);
  }, [currentDate]);

  const changeMonth = (offset) => {
    const nextDate = new Date(currentDate.getFullYear(), currentDate.getMonth() + offset, 1);
    setCurrentDate(nextDate);
  };

  const navigate = useNavigate();

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user")) || {};
    setCurrentUserId(userData.id || userData.userId);
  }, []);

  useEffect(() => {
    if (location.state?.tab) {
      setActiveTab(location.state.tab);
    }
  }, [location.state]);

  const fetchLeaveRequests = async () => {
    try {
      setLoading(true);
      const response = await api("/api/leaves");
      if (response.ok) {
        const data = await response.json();
        const allLeaves = data.data || [];
        const sorted = [...allLeaves].sort((a, b) => {
          if (a.status === 'PENDING' && b.status !== 'PENDING') return -1;
          if (a.status !== 'PENDING' && b.status === 'PENDING') return 1;
          const dateA = new Date(a.startDate);
          const dateB = new Date(b.startDate);
          return dateB - dateA;
        });
        setLeaveRequests(sorted);
        const pending = allLeaves.filter(leave => leave.status === 'PENDING');
        setPendingLeaves(pending);
        setStats((prev) => ({ ...prev, pendingLeaves: pending.length }));
      }
    } catch (error) {
      console.error("Error fetching leave requests:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const empRes = await api("/api/employees");
        const empData = empRes.ok ? await empRes.json() : {};
        const employees = Array.isArray(empData.data) ? empData.data : [];
        setEmployees(employees);
        const activeEmployees = employees.filter(emp => {
          const isSystemAdmin = (emp.role === 'ADMIN') || (emp.firstName === 'System' && emp.lastName === 'Admin');
          return !isSystemAdmin;
        });
        const usersRes = await api("/api/users");
        const usersData = usersRes.ok ? await usersRes.json() : {};
        const users = Array.isArray(usersData) ? usersData : [];
        const hrUsers = users.filter((u) => u.role === "HR").length;
        const reportingManagers = users.filter((u) => u.role === "REPORTING_MANAGER").length;
        setStats((prev) => ({
          ...prev,
          totalEmployees: activeEmployees.length,
          hrUsers,
          reportingManagers,
        }));
      } catch (error) {
        console.error("Error fetching stats:", error);
      }
    };
    fetchStats();
    fetchLeaveRequests();
  }, []);

  const refreshData = async () => {
    try {
      const empRes = await api("/api/employees");
      const empData = await empRes.json();
      const employees = Array.isArray(empData.data) ? empData.data : [];
      const activeEmployees = employees.filter(emp => {
        const isSystemAdmin = (emp.role === 'ADMIN') || (emp.firstName === 'System' && emp.lastName === 'Admin');
        return !isSystemAdmin;
      });
      const usersRes = await api("/api/users");
      const usersData = await usersRes.json();
      const users = Array.isArray(usersData) ? usersData : [];
      const hrUsers = users.filter((u) => u.role === "HR").length;
      const reportingManagers = users.filter((u) => u.role === "REPORTING_MANAGER").length;
      setStats({
        totalEmployees: activeEmployees.length,
        hrUsers,
        pendingLeaves: pendingLeaves.length,
        reportingManagers,
      });
    } catch (err) {
      console.error("Refresh failed", err);
    }
  };

  const handleQuickAction = (action) => {
    if (action === "add-employee") setIsAddEmployeeModalOpen(true);
    else if (action === "create-hr") setIsHRModalOpen(true);
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOpenReportingManagerModal = () => setIsModalOpen(true);
  const handleModalClose = () => setIsModalOpen(false);
  const handleAddEmployeeModalClose = () => setIsAddEmployeeModalOpen(false);
  const handleAddReportingManagers = () => setIsModalOpen(false);
  const handleHRModalClose = () => setIsHRModalOpen(false);
  const handleCreateHRUser = async () => {
    setIsHRModalOpen(false);
    await refreshData();
  };

  const handleLogout = () => {
    if (window.confirm("Are you sure you want to logout?")) {
      localStorage.removeItem("user");
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    return new Date(dateString).toLocaleDateString('en-GB');
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB') + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const calculateLeaveDays = (startDate, endDate) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    if (isNaN(start.getTime()) || isNaN(end.getTime())) return 0;
    let days = 0;
    let d = new Date(start);
    while (d <= end) {
      const day = d.getDay();
      if (day !== 0 && day !== 6) days++;
      d.setDate(d.getDate() + 1);
    }
    return days;
  };

  const handleApprove = async (leaveId) => {
    try {
      const response = await api(`/api/leaves/${leaveId}/approve`, {
        method: 'POST',
        body: JSON.stringify({ approverId: currentUserId })
      });
      if (response.ok) {
        toast.success('Leave approved successfully!');
        fetchLeaveRequests();
      }
    } catch (error) { console.error(error); }
  };

  const handleRejectClick = (leaveId) => {
    setRejectingLeaveId(leaveId);
    setRejectReason("");
    setShowRejectModal(true);
  };

  const handleRejectConfirm = async () => {
    if (!rejectReason.trim()) return toast.warning('Please provide a reason');
    try {
      const response = await api(`/api/leaves/${rejectingLeaveId}/reject`, {
        method: 'POST',
        body: JSON.stringify({ approverId: currentUserId, reason: rejectReason })
      });
      if (response.ok) {
        toast.success('Leave rejected successfully!');
        setShowRejectModal(false);
        fetchLeaveRequests();
      }
    } catch (error) { console.error(error); }
  };

  return (
    <>
      <div className="flex h-screen w-screen bg-[#e3edf9] flex-col md:flex-row overflow-hidden relative">
        <AdminSidebar activeTab={activeTab} setActiveTab={setActiveTab} onLogout={handleLogout} />

        <main className="flex-1 flex flex-col h-full overflow-hidden">
          <header className="bg-white px-8 py-4 flex items-center justify-between shadow-sm z-10 border-b border-brand-blue/5">
            <div className="flex items-center gap-6">
              <div className="w-11 h-11 bg-brand-blue/5 rounded-xl flex items-center justify-center border border-brand-blue/10 shadow-sm overflow-hidden text-sm font-black text-brand-blue">
                {JSON.parse(localStorage.getItem("user"))?.firstName?.[0] || "A"}
              </div>
              <div>
                <h1 className="text-xl font-black text-brand-blue tracking-tight">Admin Dashboard</h1>
                <p className="text-[10px] text-brand-blue/40 uppercase font-black tracking-[0.2em] mt-0.5">Enterprise Infrastructure Control</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <NotificationComponent />
              <button
                onClick={() => setIsYearlyCalendarOpen(true)}
                className="group w-11 h-11 bg-white hover:bg-brand-blue rounded-xl flex items-center justify-center transition-all shadow-sm border border-brand-blue/5 hover:border-brand-blue/20"
                title="Yearly Holiday Calendar"
              >
                <CalendarIconSVG size={20} className="text-brand-blue group-hover:text-white group-hover:scale-110 transition-all" />
              </button>
            </div>
          </header>

          <div className="flex-1 p-4 overflow-hidden flex flex-col">
            {activeTab === "dashboard" && (
              <div className="flex flex-col gap-4 h-full overflow-hidden">
                <div className="h-[30%] bg-white/40 backdrop-blur-md rounded-[32px] px-10 py-6 border border-white/50 shadow-xl shadow-brand-blue/5 overflow-hidden flex flex-col justify-center gap-6">
                  <div className="flex flex-col shrink-0">
                    <h3 className="text-brand-blue text-2xl font-black leading-tight tracking-tight">Quick Actions</h3>
                    <p className="text-brand-blue/20 text-[9px] font-bold uppercase tracking-[0.2em] mt-1">Administrative provision tools</p>
                  </div>
                  <div className="grid grid-cols-3 gap-4 w-full">
                    <button onClick={() => handleQuickAction("add-employee")} className="group bg-white/90 hover:bg-brand-blue p-4 rounded-2xl flex items-center gap-4 transition-all duration-300 shadow-sm hover:shadow-xl border border-brand-blue/10 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-brand-blue/5 flex items-center justify-center text-brand-blue group-hover:bg-white/10 group-hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" /></svg>
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-black text-brand-blue uppercase tracking-widest group-hover:text-white leading-none">Add Employee</p>
                        <p className="text-[10px] font-bold text-brand-blue/30 uppercase tracking-widest mt-1.5 group-hover:text-white/40">New Entry</p>
                      </div>
                    </button>
                    <button onClick={() => handleQuickAction("create-hr")} className="group bg-white/90 hover:bg-emerald-500 p-4 rounded-2xl flex items-center gap-4 transition-all duration-300 shadow-sm hover:shadow-xl border border-emerald-500/10 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-emerald-500/5 flex items-center justify-center text-emerald-500 group-hover:bg-white/10 group-hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" /></svg>
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-black text-brand-blue uppercase tracking-widest group-hover:text-white leading-none">Add HR</p>
                        <p className="text-[10px] font-bold text-brand-blue/30 uppercase tracking-widest mt-1.5 group-hover:text-white/40">Access Level</p>
                      </div>
                    </button>
                    <button onClick={handleOpenReportingManagerModal} className="group bg-white/90 hover:bg-indigo-500 p-4 rounded-2xl flex items-center gap-4 transition-all duration-300 shadow-sm hover:shadow-xl border border-indigo-500/10 flex-1">
                      <div className="w-12 h-12 rounded-xl bg-indigo-500/5 flex items-center justify-center text-indigo-500 group-hover:bg-white/10 group-hover:text-white transition-colors">
                        <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2.5"><path d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" /></svg>
                      </div>
                      <div className="text-left">
                        <p className="text-xs font-black text-brand-blue uppercase tracking-widest group-hover:text-white leading-none">Add Reporting Manager</p>
                        <p className="text-[10px] font-bold text-brand-blue/30 uppercase tracking-widest mt-1.5 group-hover:text-white/40">Team Oversight</p>
                      </div>
                    </button>
                  </div>
                </div>
                <div className="h-[70%] grid grid-cols-1 lg:grid-cols-[1.2fr_0.8fr] gap-4 pb-2 overflow-hidden">
                  <div className="bg-white rounded-[32px] p-6 shadow-2xl shadow-brand-blue/5 border border-brand-blue/5 flex flex-col items-center justify-between relative overflow-hidden group">
                    <div className="absolute top-0 right-0 w-64 h-64 bg-brand-blue/[0.01] rounded-bl-full pointer-events-none" />
                    <div className="w-full mb-2">
                      <h2 className="text-xl font-black text-brand-blue tracking-tight">Workforce Pulse</h2>
                      <p className="text-[9px] font-black text-brand-blue/30 uppercase tracking-[0.2em] mt-0.5">Real-time Personnel Distribution</p>
                    </div>
                    <div className="w-full flex-1 flex flex-row items-center gap-4 min-h-0">
                      <div className="flex-1 h-full relative">
                        <ResponsiveContainer width="100%" height="100%">
                          <PieChart>
                            <Pie
                              data={[
                                { name: 'HRs', value: stats.hrUsers, color: '#1E3A8A' },
                                { name: 'Managers', value: stats.reportingManagers, color: '#FACC15' },
                                { name: 'Employees', value: Math.max(0, stats.totalEmployees - stats.hrUsers - stats.reportingManagers), color: '#1F2937' },
                              ]}
                              outerRadius="75%" dataKey="value" stroke="#fff" strokeWidth={3}
                            >
                              {[{ color: '#1E3A8A' }, { color: '#FACC15' }, { color: '#1F2937' }].map((e, i) => <Cell key={i} fill={e.color} />)}
                            </Pie>
                            <Tooltip />
                          </PieChart>
                        </ResponsiveContainer>
                      </div>
                      <div className="flex flex-col gap-3 pr-10 shrink-0 min-w-[120px]">
                        {[{ l: 'HRs', v: stats.hrUsers, c: 'bg-[#1E3A8A]', tc: 'text-[#1E3A8A]' }, { l: 'Managers', v: stats.reportingManagers, c: 'bg-[#FACC15]', tc: 'text-[#FACC15]' }, { l: 'Employees', v: Math.max(0, stats.totalEmployees - stats.hrUsers - stats.reportingManagers), c: 'bg-[#1F2937]', tc: 'text-[#1F2937]' }].map((item, idx) => (
                          <div key={idx} className="bg-bg-slate/30 p-2.5 rounded-2xl flex flex-col items-start border border-brand-blue/[0.03] transition-all hover:bg-white hover:shadow-lg hover:shadow-brand-blue/5">
                            <div className="flex items-center gap-2 mb-1">
                              <div className={`w-2 h-2 rounded-full ${item.c}`} />
                              <span className={`text-[8px] font-black uppercase tracking-widest ${item.tc}`}>{item.l}</span>
                            </div>
                            <span className="text-sm font-black text-brand-blue ml-4">{item.v}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="bg-white rounded-[32px] shadow-2xl shadow-brand-blue/5 border border-brand-blue/5 overflow-hidden flex flex-col h-full">
                    <div className="p-4 border-b border-brand-blue/5 flex items-center justify-between bg-gradient-to-r from-bg-slate/30 to-white">
                      <div>
                        <h2 className="text-lg font-black text-brand-blue tracking-tight">Absence Monitor</h2>
                        <p className="text-[9px] font-black text-brand-blue/30 uppercase tracking-[0.1em] mt-0.5">Leave Flow Management</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="flex items-center gap-1.5 bg-bg-slate/50 p-1 rounded-lg border border-brand-blue/5">
                          <button onClick={() => changeMonth(-1)} className="w-6 h-6 rounded-md bg-white border border-brand-blue/5 flex items-center justify-center text-brand-blue hover:bg-brand-blue hover:text-white transition-all shadow-sm"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M15 19l-7-7 7-7" /></svg></button>
                          <div className="px-2 text-[8px] font-black text-brand-blue uppercase tracking-widest min-w-[80px] text-center">{currentDate.toLocaleDateString('en-US', { month: 'short', year: 'numeric' })}</div>
                          <button onClick={() => changeMonth(1)} className="w-6 h-6 rounded-md bg-white border border-brand-blue/5 flex items-center justify-center text-brand-blue hover:bg-brand-blue hover:text-white transition-all shadow-sm"><svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="3"><path d="M9 5l7 7-7 7" /></svg></button>
                        </div>
                      </div>
                    </div>
                    <div className="p-4 flex-1 overflow-y-auto">
                      <div className="grid grid-cols-5 gap-2 mb-2">
                        {['Mon', 'Tue', 'Wed', 'Thu', 'Fri'].map(day => <div key={day} className="text-center text-[9px] font-black text-brand-blue uppercase tracking-[0.15em]">{day}</div>)}
                      </div>
                      <div className="grid grid-cols-5 gap-2">
                        {(() => {
                          const year = currentDate.getFullYear();
                          const month = currentDate.getMonth();
                          const firstDay = new Date(year, month, 1).getDay();
                          const daysInMonth = new Date(year, month + 1, 0).getDate();
                          const startingPadding = firstDay === 0 ? 6 : firstDay - 1;
                          const cells = [];
                          for (let i = 0; i < startingPadding; i++) {
                            const padDate = new Date(year, month, 1 - (startingPadding - i));
                            if (padDate.getDay() !== 0 && padDate.getDay() !== 6) cells.push(<div key={`pad-${i}`} className="h-12 opacity-10 bg-bg-slate/5 border border-dashed border-brand-blue/5 rounded-xl" />);
                          }
                          for (let day = 1; day <= daysInMonth; day++) {
                            const dateObj = new Date(year, month, day);
                            if (dateObj.getDay() === 0 || dateObj.getDay() === 6) continue;
                            const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                            const isToday = new Date().toISOString().split('T')[0] === dateStr;
                            const onLeave = calendarData[dateStr] || [];
                            cells.push(
                              <div key={day} onMouseEnter={(e) => onLeave.length > 0 && setHoveredLeaveData({ data: onLeave, rect: e.currentTarget.getBoundingClientRect() })} onMouseLeave={() => setHoveredLeaveData(null)}
                                className={`h-12 rounded-xl border transition-all p-1.5 flex flex-col items-center justify-center relative group ${isToday ? "bg-brand-blue/5 border-brand-blue ring-2 ring-brand-blue/10" : ""} ${onLeave.length > 0 ? "bg-white border-brand-yellow/50 shadow-lg cursor-pointer" : "bg-bg-slate/30 border-transparent hover:bg-white hover:border-brand-blue/10"}`}>
                                <span className="text-xs font-black text-brand-blue">{day}</span>
                                {onLeave.length > 0 && <div className="mt-0.5 px-1 py-0 bg-brand-blue/5 rounded"><span className="text-[6px] font-black text-brand-blue">{onLeave.length} LEAVE</span></div>}
                              </div>
                            );
                          }
                          return cells;
                        })()}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "leave-requests" && (
              <div className="flex flex-col gap-6 h-full pr-2 overflow-hidden">
                <div className="bg-white rounded-[24px] p-6 shadow-xl border border-brand-blue/5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div>
                    <h2 className="text-2xl font-black text-brand-blue tracking-tight">Leave Records</h2>
                    <p className="text-[10px] font-black text-brand-blue/30 uppercase tracking-[0.2em] mt-1">Enterprise Personnel Management</p>
                  </div>
                  <div className="flex flex-col sm:flex-row items-center gap-4">
                    <div className="relative group w-full sm:w-64">
                      <input type="text" placeholder="Search member..." value={leaveSearch} onChange={(e) => setLeaveSearch(e.target.value)} className="w-full h-[47px] bg-bg-slate/50 border-2 border-transparent focus:border-brand-yellow rounded-2xl px-5 pl-10 text-sm font-bold text-brand-blue outline-none transition-all" />
                      <svg className="w-5 h-5 absolute left-3 top-1/2 -translate-y-1/2 text-brand-blue/30" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                    </div>
                    <div className="flex bg-bg-slate/50 p-1.5 rounded-2xl">
                      {["ALL", "HR", "OTHERS"].map((role) => (
                        <button key={role} onClick={() => setLeaveRoleFilter(role)} className={`px-6 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${leaveRoleFilter === role ? "bg-brand-blue text-white shadow-lg" : "text-brand-blue/40 hover:text-brand-blue hover:bg-white"}`}>{role}</button>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="bg-white rounded-[32px] shadow-2xl shadow-brand-blue/5 border border-brand-blue/5 overflow-hidden flex-1 flex flex-col min-h-0">
                  <div className="overflow-x-auto flex-1 overflow-y-auto custom-scrollbar relative">
                    <table className="w-full text-left border-collapse">
                      <thead className="sticky top-0 z-20 bg-white">
                        <tr className="bg-brand-blue/[0.02]">
                          <th className="py-3 px-4 text-[11px] font-black uppercase tracking-[0.15em] text-brand-blue/40 border-b border-brand-blue/5 w-20">Record ID</th>
                          <th className="py-3 px-6 text-[11px] font-black uppercase tracking-[0.15em] text-brand-blue/40 border-b border-brand-blue/5">Requester</th>
                          <th className="py-3 px-4 text-[11px] font-black uppercase tracking-[0.15em] text-brand-blue/40 border-b border-brand-blue/5">Category</th>
                          <th className="py-3 px-6 text-[11px] font-black uppercase tracking-[0.15em] text-brand-blue/40 border-b border-brand-blue/5">Reason</th>
                          <th className="py-3 px-6 text-[11px] font-black uppercase tracking-[0.15em] text-brand-blue/40 border-b border-brand-blue/5 text-center min-w-[200px]">Duration</th>
                          <th className="py-3 px-5 text-[11px] font-black uppercase tracking-[0.15em] text-brand-blue/40 border-b border-brand-blue/5 text-center">Status</th>
                          <th className="py-3 px-6 text-[11px] font-black uppercase tracking-[0.15em] text-brand-blue/40 border-b border-brand-blue/5 text-right">Decision Control</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-brand-blue/5">
                        {loading ? (
                          <tr><td colSpan={7} className="py-20 text-center text-brand-blue/30 font-bold uppercase tracking-widest text-xs animate-pulse">Syncing Personnel Records...</td></tr>
                        ) : leaveRequests.filter(lv => !leaveSearch || lv.employeeName.toLowerCase().includes(leaveSearch.toLowerCase())).map((leave) => (
                          <tr key={leave.id} className="group hover:bg-bg-slate/40 transition-all duration-300">
                            <td className="py-3 px-4"><span className="text-[10px] font-black text-brand-blue/40 uppercase tracking-widest">#{leave.id}</span></td>
                            <td className="py-3 px-6"><div className="flex flex-col"><span className="text-sm font-black text-brand-blue tracking-tight uppercase">{leave.employeeName}</span></div></td>
                            <td className="py-3 px-6"><span className="px-3 py-1 bg-brand-blue/5 text-brand-blue text-[8px] font-black uppercase tracking-widest rounded-lg border border-brand-blue/10">{leave.leaveType}</span></td>
                            <td className="py-3 px-6"><div className="flex flex-col bg-bg-slate/50 p-2 rounded-xl border border-brand-blue/[0.03] max-w-[150px]"><span className="text-[9px] font-black text-brand-blue tracking-tight leading-tight">{leave.reason || "-"}</span></div></td>
                            <td className="py-3 px-6 text-center">
                              <div className="flex flex-col items-center">
                                <div className="flex items-center gap-2">
                                  <span className="text-[10px] font-black text-brand-blue">{formatDate(leave.startDate)}</span>
                                  <span className="text-[8px] font-black text-brand-blue/10 font-bold">to</span>
                                  <span className="text-[10px] font-black text-brand-blue">{formatDate(leave.endDate)}</span>
                                </div>
                                <span className="mt-1 px-2 py-0.5 bg-brand-yellow text-brand-blue text-[8px] font-black rounded-md">{leave.daysCount} Days</span>
                              </div>
                            </td>
                            <td className="py-3 px-6 text-center">
                              <span className={`px-4 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border transition-all ${leave.status === 'PENDING' ? 'bg-brand-yellow/10 text-brand-yellow-dark border-brand-yellow/20' : leave.status === 'APPROVED' ? 'bg-emerald-50 text-emerald-600 border-emerald-100' : 'bg-red-50 text-red-600 border-red-100'}`}>
                                {leave.status}
                              </span>
                            </td>
                            <td className="py-3 px-8 text-right">
                              <div className="flex justify-end gap-2">
                                <button onClick={() => { setSelectedLeave(leave); setIsDetailsModalOpen(true); }} className="p-2 bg-brand-blue/5 text-brand-blue rounded-lg hover:bg-brand-blue hover:text-white transition-all"><Eye size={16} /></button>
                                {leave.status === 'PENDING' && (
                                  <>
                                    <button onClick={() => handleApprove(leave.id)} className="px-4 py-2 bg-emerald-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-emerald-600 transition-all shadow-md active:scale-95">Approve</button>
                                    <button onClick={() => handleRejectClick(leave.id)} className="px-4 py-2 bg-red-500 text-white rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-md active:scale-95">Reject</button>
                                  </>
                                )}
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "hr-team" && (
              <div className="flex flex-col gap-8 h-full overflow-y-auto pr-2">
                <div className="bg-white rounded-[32px] p-8 shadow-2xl shadow-brand-blue/5 border border-brand-blue/[0.02]">
                  <h2 className="text-2xl font-black text-brand-blue tracking-tight">HR Operations Registry</h2>
                  <p className="text-[10px] font-black text-brand-blue/20 uppercase tracking-[0.4em] mt-1.5 leading-none">Global Personnel Access Control</p>
                </div>
                <HRTeamDisplay />
              </div>
            )}

            {activeTab === "settings" && (
              <div className="flex flex-col gap-6 h-full overflow-y-auto pr-2 pb-10">
                <div className="bg-white rounded-[32px] p-8 shadow-2xl shadow-brand-blue/5 border border-brand-blue/[0.02]">
                  <h2 className="text-2xl font-black text-brand-blue tracking-tight">System Control Center</h2>
                  <p className="text-[10px] font-black text-brand-blue/20 uppercase tracking-[0.4em] mt-1.5 leading-none">Global Infrastructure & Policy Management</p>
                </div>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="lg:col-span-1 space-y-6">
                    <div className="bg-brand-blue rounded-[32px] p-6 shadow-2xl shadow-brand-blue/20 text-white relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-32 h-32 bg-white/5 rounded-bl-full transition-transform group-hover:scale-150 duration-700" />
                      <h3 className="text-xs font-black uppercase tracking-widest opacity-60 mb-4">Core Integrity</h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between"><span className="text-[11px] font-bold opacity-80">Server Latency</span><span className="text-sm font-black text-brand-yellow">14ms</span></div>
                        <div className="h-1.5 bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-brand-yellow w-[92%] animate-pulse" /></div>
                        <div className="flex items-center justify-between"><span className="text-[11px] font-bold opacity-80">Database Health</span><div className="flex items-center gap-1.5"><div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" /><span className="text-[11px] font-black uppercase">Optimal</span></div></div>
                      </div>
                    </div>
                  </div>
                  <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-[32px] p-8 shadow-xl border border-brand-blue/5">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-6">
                          <h4 className="flex items-center gap-2 text-sm font-black text-brand-blue uppercase tracking-widest">Security Hub</h4>
                          <div className="space-y-4">
                            {[{ l: "Audit Logging", d: "Trace all personnel record changes", e: true }].map((item, i) => (
                              <div key={i} className="flex items-center justify-between group p-3 rounded-2xl hover:bg-bg-slate/50 transition-all border border-transparent hover:border-brand-blue/5">
                                <div><p className="text-[11px] font-black text-brand-blue uppercase tracking-tight">{item.l}</p><p className="text-[9px] font-bold text-brand-blue/30 mt-0.5">{item.d}</p></div>
                                <button className={`w-10 h-5 rounded-full transition-all flex items-center px-1 ${item.e ? 'bg-emerald-500 justify-end' : 'bg-bg-slate justify-start'}`}><div className="w-3.5 h-3.5 bg-white rounded-full shadow-sm" /></button>
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </main>
      </div>

      <YearlyHolidayCalendar isOpen={isYearlyCalendarOpen} onClose={() => setIsYearlyCalendarOpen(false)} />

      {showRejectModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[200]">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-2xl">
            <h3 className="text-lg font-bold mb-4 text-brand-blue uppercase tracking-tight">Reject Leave Request</h3>
            <textarea value={rejectReason} onChange={(e) => setRejectReason(e.target.value)} placeholder="Enter reason..." className="w-full p-3 border border-slate-200 rounded-lg mb-4 focus:ring-2 focus:ring-red-500 outline-none font-bold text-sm" rows="4" />
            <div className="flex gap-3">
              <button onClick={() => { setShowRejectModal(false); setRejectingLeaveId(null); }} className="flex-1 bg-slate-100 text-slate-600 px-4 py-2 rounded-lg font-black uppercase text-[10px] tracking-widest hover:bg-slate-200 transition">Cancel</button>
              <button onClick={handleRejectConfirm} className="flex-1 bg-red-500 text-white px-4 py-2 rounded-lg font-black uppercase text-[10px] tracking-widest hover:bg-red-600 transition shadow-lg">Reject</button>
            </div>
          </div>
        </div>
      )}

      <EmployeeSelectorModal open={isModalOpen} onClose={handleModalClose} onSave={handleAddReportingManagers} />
      <AddEmployeeModal open={isAddEmployeeModalOpen} onClose={handleAddEmployeeModalClose} onEmployeeCreated={refreshData} />
      <HRSelectorModal open={isHRModalOpen} onClose={handleHRModalClose} onSave={handleCreateHRUser} />

      {hoveredLeaveData && createPortal(
        <div className="fixed z-[10000] pointer-events-none" style={{ top: hoveredLeaveData.rect.top - 10, left: hoveredLeaveData.rect.left + hoveredLeaveData.rect.width / 2, transform: "translate(-50%, -100%)" }}>
          <div className="w-48 bg-brand-blue rounded-2xl p-4 shadow-2xl relative">
            <div className="absolute bottom-[-6px] left-1/2 -translate-x-1/2 w-3 h-3 bg-brand-blue rotate-45" />
            <p className="text-[8px] font-black text-white/40 uppercase tracking-widest mb-2 text-center">Personnel Out Today</p>
            <div className="space-y-1.5">
              {hoveredLeaveData.data.map((name, idx) => (
                <div key={idx} className="flex items-center gap-2 px-2 py-1 bg-white/5 rounded-lg">
                  <div className="w-1 h-1 rounded-full bg-brand-yellow" />
                  <span className="text-[9px] font-bold text-white whitespace-nowrap">{name}</span>
                </div>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}

      <LeaveDetailsModal isOpen={isDetailsModalOpen} onClose={() => setIsDetailsModalOpen(false)} leave={selectedLeave} />
    </>
  );
}
