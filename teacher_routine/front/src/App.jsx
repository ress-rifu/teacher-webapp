import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import RoutineTable from "./components/RoutineTable";
import axios from "axios";
import { Calendar, BookOpen, User, Home, Filter, X, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import { DatePicker } from "./components/ui/date-picker";
import { Button } from "./components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./components/ui/select";
import { Label } from "./components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import { ToastProvider } from "./components/ui/toast";

const App = () => {
  const [routines, setRoutines] = useState([]);
  const [selectedTeacher, setSelectedTeacher] = useState("all_teachers");
  const [selectedClass, setSelectedClass] = useState("all_classes");
  const [selectedSubject, setSelectedSubject] = useState("all_subjects");
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [uniqueTeachers, setUniqueTeachers] = useState([]);
  const [uniqueClasses, setUniqueClasses] = useState([]);
  const [uniqueSubjects, setUniqueSubjects] = useState([]);
  const API_URL = import.meta.env.VITE_API_URL || "https://teacher-webapp.onrender.com";

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/routines`);
        const routinesData = response.data;

        const filteredRoutines = routinesData.slice(1);

        filteredRoutines.sort((a, b) => {
          const dateA = new Date(a[0]);
          const dateB = new Date(b[0]);
          return dateA - dateB || a[1].localeCompare(b[1]);
        });

        setRoutines(filteredRoutines);

        setUniqueTeachers([...new Set(filteredRoutines.map((r) => r[10]).filter(Boolean))]);
        setUniqueClasses([...new Set(filteredRoutines.map((r) => r[36]).filter(Boolean))]);
        setUniqueSubjects([...new Set(filteredRoutines.map((r) => r[5]).filter(Boolean))]);

        setLoading(false);
      } catch (error) {
        setError("Failed to load data. Please try again later.");
        setLoading(false);
      }
    };

    fetchRoutines();
  }, []);
  const filteredRoutines = routines.filter((routine) => {
    if (!routine[0]) return false;
    const routineDate = new Date(routine[0]);

    return (
      (selectedTeacher === "all_teachers" || !selectedTeacher || routine[10]?.toLowerCase().includes(selectedTeacher.toLowerCase())) &&
      (selectedClass === "all_classes" || !selectedClass || routine[36]?.toLowerCase().includes(selectedClass.toLowerCase())) &&
      (selectedSubject === "all_subjects" || !selectedSubject || routine[5]?.toLowerCase().includes(selectedSubject.toLowerCase())) &&
      (!startDate || routineDate >= startDate) &&
      (!endDate || routineDate <= endDate)
    );
  });

  const sortedRoutines = [...filteredRoutines].sort((a, b) => {
    const dateA = new Date(a[0]);
    const dateB = new Date(b[0]);
    return dateA - dateB || a[1].localeCompare(b[1]);
  });
  const handleRemoveFilters = () => {
    setSelectedTeacher("all_teachers");
    setSelectedClass("all_classes");
    setSelectedSubject("all_subjects");
    setStartDate(null);
    setEndDate(null);
  };  return (
    <ToastProvider>
      <Router>
        <div className="min-h-screen bg-background font-sans">
          <header className="sticky top-0 z-50 w-full border-b bg-white shadow-sm">
            <div className="container flex h-16 items-center justify-between">
              <Link to="/" className="flex items-center gap-3">
                <img src="/logo.svg" alt="ACS Future School Logo" className="h-10 w-auto" />
                <span className="font-semibold text-xl hidden md:inline-block bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent">ACS Future School</span>
              </Link>

              <nav className="flex items-center gap-4">
                <Link
                  to="/"
                  className="text-sm flex items-center font-medium text-gray-600 transition-colors hover:text-indigo-600 bg-gray-50 hover:bg-indigo-50 px-4 py-2 rounded-md"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Class Schedule</span>
                </Link>
              </nav>
            </div>
          </header>          <main className="container py-8 md:py-12">
            <Routes>
              <Route
                path="/"
                element={
                  <section className="space-y-8">
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="text-center mb-8"
                    >
                      <h1 className="text-3xl md:text-4xl font-bold tracking-tight bg-gradient-to-r from-indigo-600 to-blue-600 bg-clip-text text-transparent">
                        Class Schedule
                      </h1>
                      <p className="text-gray-500 mt-2 text-lg">
                        ACS Future School Academic Program
                      </p>
                      <div className="w-20 h-1 bg-gradient-to-r from-indigo-500 to-blue-500 mx-auto mt-4 rounded-full"></div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <Card className="shadow-md border border-gray-100 rounded-xl overflow-hidden">
                        <CardHeader className="pb-4 bg-gradient-to-r from-blue-50 to-indigo-50">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                              <CardTitle className="text-xl font-bold flex items-center text-gray-800">
                                <Filter className="h-5 w-5 mr-3 text-blue-600" />
                                Filter Options
                              </CardTitle>
                              <CardDescription className="text-gray-600 mt-2 ml-8">
                                Customize your view with the filters below
                              </CardDescription>
                            </div>
                            <Button
                              onClick={handleRemoveFilters}
                              variant="outline"
                              size="sm"
                              className="bg-white text-gray-700 hover:text-red-600 hover:border-red-200 transition-colors border border-gray-200 shadow-sm"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Reset Filters
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-6 pb-8 bg-white px-6">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="space-y-2.5 bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                              <Label className="flex items-center text-sm font-medium text-gray-800">
                                <User className="h-4 w-4 mr-2 text-indigo-600" />
                                Teacher
                              </Label>
                              <Select 
                                value={selectedTeacher} 
                                onValueChange={setSelectedTeacher}
                              >
                                <SelectTrigger className="h-10 w-full bg-white border-gray-200 hover:border-indigo-300 focus:border-indigo-400 shadow-sm">
                                  <SelectValue placeholder="All Teachers" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border border-gray-200 shadow-md">
                                  <SelectItem value="all_teachers" className="text-gray-800 focus:bg-indigo-50 focus:text-indigo-700">All Teachers</SelectItem>
                                  {uniqueTeachers.map((teacher) => (
                                    <SelectItem key={teacher} value={teacher} className="text-gray-700 focus:bg-indigo-50 focus:text-indigo-700">
                                      {teacher}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2.5 bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                              <Label className="flex items-center text-sm font-medium text-gray-800">
                                <BookOpen className="h-4 w-4 mr-2 text-indigo-600" />
                                Subject
                              </Label>
                              <Select 
                                value={selectedSubject} 
                                onValueChange={setSelectedSubject}
                              >
                                <SelectTrigger className="h-10 w-full bg-white border-gray-200 hover:border-indigo-300 focus:border-indigo-400 shadow-sm">
                                  <SelectValue placeholder="All Subjects" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border border-gray-200 shadow-md">
                                  <SelectItem value="all_subjects" className="text-gray-800 focus:bg-indigo-50 focus:text-indigo-700">All Subjects</SelectItem>
                                  {uniqueSubjects.map((subject) => (
                                    <SelectItem key={subject} value={subject} className="text-gray-700 focus:bg-indigo-50 focus:text-indigo-700">
                                      {subject}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2.5 bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                              <Label className="flex items-center text-sm font-medium text-gray-800">
                                <User className="h-4 w-4 mr-2 text-indigo-600" />
                                Class
                              </Label>
                              <Select 
                                value={selectedClass} 
                                onValueChange={setSelectedClass}
                              >
                                <SelectTrigger className="h-10 w-full bg-white border-gray-200 hover:border-indigo-300 focus:border-indigo-400 shadow-sm">
                                  <SelectValue placeholder="All Classes" />
                                </SelectTrigger>
                                <SelectContent className="bg-white border border-gray-200 shadow-md">
                                  <SelectItem value="all_classes" className="text-gray-800 focus:bg-indigo-50 focus:text-indigo-700">All Classes</SelectItem>
                                  {uniqueClasses.map((cls) => (
                                    <SelectItem key={cls} value={cls} className="text-gray-700 focus:bg-indigo-50 focus:text-indigo-700">
                                      {cls}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>
                            
                            <div className="space-y-2.5 bg-gray-50 p-4 rounded-lg border border-gray-100 shadow-sm">
                              <Label className="flex items-center text-sm font-medium text-gray-800 mb-2">
                                <Calendar className="h-4 w-4 mr-2 text-indigo-600" />
                                Date Range
                              </Label>
                              <div className="flex flex-col gap-3">
                                <DatePicker 
                                  selected={startDate}
                                  onSelect={setStartDate}
                                  placeholder="Start date"
                                  className="border-gray-200 focus:border-indigo-400 shadow-sm bg-white"
                                />
                                <DatePicker 
                                  selected={endDate}
                                  onSelect={setEndDate}
                                  placeholder="End date"
                                  className="border-gray-200 focus:border-indigo-400 shadow-sm bg-white"
                                />
                              </div>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.4 }}
                    >                      {loading ? (
                        <div className="flex flex-col justify-center items-center h-64 bg-white rounded-lg shadow-lg border border-gray-100">
                          <Loader2 className="h-12 w-12 text-blue-600 animate-spin mb-4" />
                          <p className="text-gray-600 font-medium">Loading class schedule...</p>
                        </div>
                      ) : error ? (
                        <Card className="border-red-200 shadow-lg bg-white">
                          <CardHeader>
                            <CardTitle className="text-red-600 flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                              </svg>
                              Error Loading Data
                            </CardTitle>
                            <CardDescription className="text-red-600/80">{error}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <Button className="bg-red-600 hover:bg-red-700 text-white" onClick={() => window.location.reload()}>
                              Retry
                            </Button>
                          </CardContent>
                        </Card>
                      ) : sortedRoutines.length === 0 ? (
                        <Card className="shadow-lg border-gray-100 bg-white">
                          <CardHeader className="text-center py-10">
                            <div className="text-6xl mb-4 flex justify-center">📭</div>
                            <CardTitle className="text-xl mb-2 text-gray-800">No classes found</CardTitle>
                            <CardDescription className="text-base text-gray-600">
                              Try adjusting your filters to see more results
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="flex justify-center pb-8">
                            <Button 
                              onClick={handleRemoveFilters}
                              className="bg-blue-600 hover:bg-blue-700 text-white"
                            >
                              Clear All Filters
                            </Button>
                          </CardContent>
                        </Card>
                      ) : (                        <Card className="shadow-lg border-gray-100 bg-white">
                          <CardHeader className="bg-slate-50 border-b py-4">
                            <CardTitle className="text-lg font-bold text-gray-800">
                              Class Schedule Table
                            </CardTitle>
                            <CardDescription className="text-gray-600">
                              Displaying {sortedRoutines.length} classes
                            </CardDescription>
                          </CardHeader>
                          <div className="overflow-x-auto">
                            <RoutineTable routines={sortedRoutines} />
                          </div>
                        </Card>
                      )}
                    </motion.div>
                  </section>
                }
              />            </Routes>
          </main>          <footer className="border-t py-8 md:py-6 bg-gradient-to-r from-indigo-50 to-blue-50">
            <div className="container flex flex-col items-center justify-between gap-6 md:h-16 md:flex-row">
              <p className="text-sm text-gray-600 text-center md:text-left">
                &copy; 2025 ACS Future School. All rights reserved.
              </p>
              <div className="flex gap-6">
                <Link to="#" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors font-medium">
                  Privacy Policy
                </Link>
                <Link to="#" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors font-medium">
                  Terms of Service
                </Link>
                <Link to="#" className="text-sm text-gray-600 hover:text-indigo-600 transition-colors font-medium">
                  Contact Us
                </Link>
              </div>
            </div>
          </footer>
        </div>
      </Router>
    </ToastProvider>
  );
};

export default App;
