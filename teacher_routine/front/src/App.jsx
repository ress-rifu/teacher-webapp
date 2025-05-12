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
                <span className="font-semibold text-lg hidden md:inline-block text-gray-800">ACS Future School</span>
              </Link>

              <nav className="flex items-center gap-4">
                <Link
                  to="/"
                  className="text-sm flex items-center font-medium text-gray-600 transition-colors hover:text-primary"
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
                      <h1 className="text-3xl md:text-4xl font-bold tracking-tight text-gray-900">Class Schedule</h1>
                      <p className="text-gray-500 mt-2 text-lg">ACS Future School Academic Program</p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <Card className="shadow-lg border-0 rounded-lg overflow-hidden">
                        <CardHeader className="pb-4 bg-slate-50 border-b">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-xl font-bold flex items-center text-gray-800">
                              <Filter className="h-5 w-5 mr-3 text-blue-600" />
                              Filters
                            </CardTitle>
                            <Button
                              onClick={handleRemoveFilters}
                              variant="outline"
                              size="sm"
                              className="text-gray-600 hover:text-red-600 hover:bg-red-50 transition-colors border border-gray-200"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Clear Filters
                            </Button>
                          </div>
                          <CardDescription className="text-gray-500 mt-2">
                            Filter schedules by teacher, subject, class, or date range
                          </CardDescription>
                        </CardHeader>
                        <CardContent className="pt-6 pb-6 bg-white">
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">                            <div className="space-y-2.5">
                              <Label className="flex items-center text-sm font-medium text-gray-700">
                                <User className="h-4 w-4 mr-2 text-blue-600" />
                                Teacher
                              </Label>
                              <Select 
                                value={selectedTeacher} 
                                onValueChange={setSelectedTeacher}
                              >
                                <SelectTrigger className="h-10 w-full bg-white border-gray-300 hover:border-blue-500 focus:border-blue-500">
                                  <SelectValue placeholder="All Teachers" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all_teachers">All Teachers</SelectItem>
                                  {uniqueTeachers.map((teacher) => (
                                    <SelectItem key={teacher} value={teacher}>
                                      {teacher}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>                            <div className="space-y-2.5">
                              <Label className="flex items-center text-sm font-medium text-gray-700">
                                <BookOpen className="h-4 w-4 mr-2 text-blue-600" />
                                Subject
                              </Label>
                              <Select 
                                value={selectedSubject} 
                                onValueChange={setSelectedSubject}
                              >
                                <SelectTrigger className="h-10 w-full bg-white border-gray-300 hover:border-blue-500 focus:border-blue-500">
                                  <SelectValue placeholder="All Subjects" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all_subjects">All Subjects</SelectItem>
                                  {uniqueSubjects.map((subject) => (
                                    <SelectItem key={subject} value={subject}>
                                      {subject}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>                            <div className="space-y-2.5">
                              <Label className="flex items-center text-sm font-medium text-gray-700">
                                <User className="h-4 w-4 mr-2 text-blue-600" />
                                Class
                              </Label>
                              <Select 
                                value={selectedClass} 
                                onValueChange={setSelectedClass}
                              >
                                <SelectTrigger className="h-10 w-full bg-white border-gray-300 hover:border-blue-500 focus:border-blue-500">
                                  <SelectValue placeholder="All Classes" />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="all_classes">All Classes</SelectItem>
                                  {uniqueClasses.map((cls) => (
                                    <SelectItem key={cls} value={cls}>
                                      {cls}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>                            <div className="space-y-2.5">
                              <Label className="flex items-center text-sm font-medium text-gray-700 mb-2">
                                <Calendar className="h-4 w-4 mr-2 text-blue-600" />
                                Date Range
                              </Label>
                              <div className="flex flex-col gap-3">
                                <DatePicker 
                                  selected={startDate}
                                  onSelect={setStartDate}
                                  placeholder="Start date"
                                  className="border-gray-300 focus:border-blue-500"
                                />
                                <DatePicker 
                                  selected={endDate}
                                  onSelect={setEndDate}
                                  placeholder="End date"
                                  className="border-gray-300 focus:border-blue-500"
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
          </main>

          <footer className="border-t py-8 md:py-6 bg-gray-50">
            <div className="container flex flex-col items-center justify-between gap-6 md:h-16 md:flex-row">
              <p className="text-sm text-gray-600 text-center md:text-left">
                &copy; 2025 ACS Future School. All rights reserved.
              </p>
              <div className="flex gap-6">
                <Link to="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  Privacy Policy
                </Link>
                <Link to="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium">
                  Terms of Service
                </Link>
                <Link to="#" className="text-sm text-gray-600 hover:text-blue-600 transition-colors font-medium">
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
