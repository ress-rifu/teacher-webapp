import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import RoutineTable from "./components/RoutineTable";
import axios from "axios";
import { Calendar, BookOpen, User, Home, Filter, X, Loader2, GraduationCap } from "lucide-react";
import { motion } from "framer-motion";
import { DatePicker } from "./components/ui/date-picker";
import { Button } from "./components/ui/button";
// Removed unused select imports
import { MultiSelect } from "./components/ui/multi-select";
import { Label } from "./components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./components/ui/card";
// Removed unused tabs imports
import { ToastProvider } from "./components/ui/toast";

const App = () => {
  const [routines, setRoutines] = useState([]);
  const [selectedTeachers, setSelectedTeachers] = useState([]); // For teachers filter
  const [selectedClasses, setSelectedClasses] = useState([]); // For classes filter
  const [selectedSubjects, setSelectedSubjects] = useState([]); // For subjects filter
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

        // Sort teachers alphabetically
        const teachers = [...new Set(filteredRoutines.map((r) => r[10]).filter(Boolean))];
        teachers.sort((a, b) => a.localeCompare(b));
        setUniqueTeachers(teachers);

        // Sort classes alphabetically
        const classes = [...new Set(filteredRoutines.map((r) => r[36]).filter(Boolean))];
        classes.sort((a, b) => a.localeCompare(b));
        setUniqueClasses(classes);

        // Sort subjects alphabetically
        const subjects = [...new Set(filteredRoutines.map((r) => r[5]).filter(Boolean))];
        subjects.sort((a, b) => a.localeCompare(b));
        setUniqueSubjects(subjects);

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

    // Check if the routine's teacher is in the selected teachers array
    const teacherMatch = selectedTeachers.length === 0 ||
      selectedTeachers.some(teacher => routine[10]?.toLowerCase().includes(teacher.toLowerCase()));

    // Check if the routine's class is in the selected classes array
    const classMatch = selectedClasses.length === 0 ||
      selectedClasses.some(cls => routine[36]?.toLowerCase().includes(cls.toLowerCase()));

    // Check if the routine's subject is in the selected subjects array
    const subjectMatch = selectedSubjects.length === 0 ||
      selectedSubjects.some(subject => routine[5]?.toLowerCase().includes(subject.toLowerCase()));

    return (
      teacherMatch &&
      classMatch &&
      subjectMatch &&
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
    setSelectedTeachers([]);
    setSelectedClasses([]);
    setSelectedSubjects([]);
    setStartDate(null);
    setEndDate(null);
  };  return (
    <ToastProvider>
      <Router>
        <div className="min-h-screen bg-background font-sans">
          <header className="sticky top-0 z-50 w-full border-b bg-background">
            <div className="container flex h-16 items-center justify-between px-4 md:px-6">
              <Link to="/" className="flex items-center gap-3">
                <img src="/logo.svg" alt="ACS Future School Logo" className="h-10 w-auto" />
                <span className="font-semibold text-xl hidden md:inline-block">ACS Future School</span>
              </Link>

              <nav className="flex items-center gap-4">
                <Link
                  to="/"
                  className="text-sm flex items-center font-medium transition-colors hover:text-foreground/80 px-4 py-2 rounded-md"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Class Schedule</span>
                </Link>
              </nav>
            </div>
          </header>          <main className="container py-6 md:py-8 px-4 md:px-6">
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
                      <h1 className="text-3xl md:text-4xl font-bold tracking-tight">
                        Class Schedule
                      </h1>
                      <p className="text-muted-foreground mt-2 text-lg">
                        ACS Future School Academic Program
                      </p>
                      <div className="w-20 h-1 bg-muted mx-auto mt-4 rounded-full"></div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <Card>
                        <CardHeader className="pb-3 pt-5 px-6">
                          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                            <div>
                              <CardTitle className="text-xl font-bold flex items-center">
                                <Filter className="h-5 w-5 mr-3" />
                                Filter Options
                              </CardTitle>
                              <CardDescription className="mt-2 ml-8">
                                Customize your view with the filters below
                              </CardDescription>
                            </div>
                            <Button
                              onClick={handleRemoveFilters}
                              variant="outline"
                              size="sm"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Reset Filters
                            </Button>
                          </div>
                        </CardHeader>
                        <CardContent className="pt-4 pb-6 px-6">
                          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                            <div className="space-y-2 p-4 rounded-md border bg-card h-full">
                              <Label className="flex items-center text-sm font-medium mb-1.5">
                                <User className="h-4 w-4 mr-2" />
                                Teacher
                              </Label>
                              <MultiSelect
                                options={uniqueTeachers.map(teacher => ({ value: teacher, label: teacher }))}
                                placeholder="Select one or more teachers..."
                                selected={selectedTeachers}
                                onChange={setSelectedTeachers}
                                className="w-full"
                              />
                            </div>

                            <div className="space-y-2 p-4 rounded-md border bg-card h-full">
                              <Label className="flex items-center text-sm font-medium mb-1.5">
                                <BookOpen className="h-4 w-4 mr-2" />
                                Subject
                              </Label>
                              <MultiSelect
                                options={uniqueSubjects.map(subject => ({ value: subject, label: subject }))}
                                placeholder="Select one or more subjects..."
                                selected={selectedSubjects}
                                onChange={setSelectedSubjects}
                                className="w-full"
                              />
                            </div>

                            <div className="space-y-2 p-4 rounded-md border bg-card h-full">
                              <Label className="flex items-center text-sm font-medium mb-1.5">
                                <GraduationCap className="h-4 w-4 mr-2" />
                                Class
                              </Label>
                              <MultiSelect
                                options={uniqueClasses.map(cls => ({ value: cls, label: cls }))}
                                placeholder="Select one or more classes..."
                                selected={selectedClasses}
                                onChange={setSelectedClasses}
                                className="w-full"
                              />
                            </div>

                            <div className="space-y-2 p-4 rounded-md border bg-card h-full">
                              <Label className="flex items-center text-sm font-medium mb-1.5">
                                <Calendar className="h-4 w-4 mr-2" />
                                Date Range
                              </Label>
                              <div className="flex flex-col gap-3">
                                <DatePicker
                                  selected={startDate}
                                  onSelect={setStartDate}
                                  className="w-full"
                                />
                                <DatePicker
                                  selected={endDate}
                                  onSelect={setEndDate}
                                  className="w-full"
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
                    >
                      {loading ? (
                        <div className="flex flex-col justify-center items-center h-64 bg-card rounded-md border">
                          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                          <p className="text-muted-foreground font-medium">Loading class schedule...</p>
                        </div>
                      ) : error ? (
                        <Card>
                          <CardHeader>
                            <CardTitle className="flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                              </svg>
                              Error Loading Data
                            </CardTitle>
                            <CardDescription>{error}</CardDescription>
                          </CardHeader>
                          <CardContent>
                            <Button onClick={() => window.location.reload()}>
                              Retry
                            </Button>
                          </CardContent>
                        </Card>
                      ) : sortedRoutines.length === 0 ? (
                        <Card>
                          <CardHeader className="text-center py-10">
                            <div className="text-6xl mb-4 flex justify-center">📭</div>
                            <CardTitle className="text-xl mb-2">No classes found</CardTitle>
                            <CardDescription className="text-base">
                              Try adjusting your filters to see more results
                            </CardDescription>
                          </CardHeader>
                          <CardContent className="flex justify-center pb-8">
                            <Button
                              onClick={handleRemoveFilters}
                            >
                              Clear All Filters
                            </Button>
                          </CardContent>
                        </Card>
                      ) : (                        <Card>
                          <CardHeader className="border-b py-4 px-6">
                            <CardTitle className="text-lg font-bold">
                              Class Schedule Table
                            </CardTitle>
                            <CardDescription>
                              Displaying {sortedRoutines.length} classes
                            </CardDescription>
                          </CardHeader>
                          <div className="overflow-x-auto p-1">
                            <RoutineTable routines={sortedRoutines} />
                          </div>
                        </Card>
                      )}
                    </motion.div>
                  </section>
                }
              />            </Routes>
          </main>          <footer className="border-t py-6 md:py-4">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row px-4 md:px-6">
              <p className="text-sm text-muted-foreground text-center md:text-left">
                &copy; 2025 ACS Future School. All rights reserved.
              </p>
              <div className="flex gap-6">
                <Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
                  Privacy Policy
                </Link>
                <Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
                  Terms of Service
                </Link>
                <Link to="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors font-medium">
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
