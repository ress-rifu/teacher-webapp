import { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import RoutineTable from "./components/RoutineTable";
import WeeklyRoutine from "./components/WeeklyRoutine";
import axios from "axios";
import { Calendar, Clock, BookOpen, User, Home, Filter, X, Loader2 } from "lucide-react";
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
  };
  return (
    <ToastProvider>
      <Router>
        <div className="min-h-screen bg-background">
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 shadow-sm">
            <div className="container flex h-16 items-center">
              <Link to="/" className="flex items-center gap-3 mr-10">
                <img src="/logo.svg" alt="ACS Future School Logo" className="h-9 w-auto" />
                <span className="font-semibold text-lg hidden md:inline-block">ACS Future School</span>
              </Link>

              <nav className="flex gap-6">
                <Link
                  to="/"
                  className="text-sm flex items-center font-medium transition-colors hover:text-primary"
                >
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>Schedule</span>
                </Link>
                <Link
                  to="/weekly"
                  className="text-sm flex items-center font-medium transition-colors hover:text-primary"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  <span>Weekly View</span>
                </Link>
              </nav>
            </div>
          </header>

          <main className="container py-6 md:py-10">
            <Routes>
              <Route
                path="/"
                element={
                  <section className="space-y-6">
                    <motion.div
                      initial={{ opacity: 0, y: -20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="text-center mb-8"
                    >
                      <h1 className="text-3xl font-bold tracking-tight text-primary">Class Schedule</h1>
                      <p className="text-muted-foreground mt-2">ACS Future School Academic Program</p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <Card className="shadow-md border-neutral-100">
                        <CardHeader className="pb-3">
                          <div className="flex items-center justify-between">
                            <CardTitle className="text-xl font-semibold flex items-center">
                              <Filter className="h-5 w-5 mr-2 text-primary" />
                              Filters
                            </CardTitle>
                            <Button
                              onClick={handleRemoveFilters}
                              variant="outline"
                              size="sm"
                              className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
                            >
                              <X className="h-4 w-4 mr-2" />
                              Clear Filters
                            </Button>
                          </div>
                          <CardDescription>
                            Filter schedules by teacher, subject, class, or date range
                          </CardDescription>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                            <div className="space-y-2.5">
                              <Label className="flex items-center text-sm font-medium">
                                <User className="h-4 w-4 mr-2 text-primary" />
                                Teacher
                              </Label>
                              <Select 
                                value={selectedTeacher} 
                                onValueChange={setSelectedTeacher}
                              >
                                <SelectTrigger className="h-10 w-full">
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
                            </div>

                            <div className="space-y-2.5">
                              <Label className="flex items-center text-sm font-medium">
                                <BookOpen className="h-4 w-4 mr-2 text-primary" />
                                Subject
                              </Label>
                              <Select 
                                value={selectedSubject} 
                                onValueChange={setSelectedSubject}
                              >
                                <SelectTrigger className="h-10 w-full">
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
                            </div>

                            <div className="space-y-2.5">
                              <Label className="flex items-center text-sm font-medium">
                                <User className="h-4 w-4 mr-2 text-primary" />
                                Class
                              </Label>
                              <Select 
                                value={selectedClass} 
                                onValueChange={setSelectedClass}
                              >
                                <SelectTrigger className="h-10 w-full">
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
                            </div>

                            <div className="space-y-2.5">
                              <Label className="flex items-center text-sm font-medium mb-2">
                                <Calendar className="h-4 w-4 mr-2 text-primary" />
                                Date Range
                              </Label>
                              <div className="flex flex-col gap-3">
                                <DatePicker 
                                  selected={startDate}
                                  onSelect={setStartDate}
                                  placeholder="Start date"
                                />
                                <DatePicker 
                                  selected={endDate}
                                  onSelect={setEndDate}
                                  placeholder="End date"
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
                        <div className="flex flex-col justify-center items-center h-64 bg-white rounded-lg shadow-md border border-neutral-100">
                          <Loader2 className="h-12 w-12 text-primary animate-spin mb-4" />
                          <p className="text-muted-foreground">Loading class schedule...</p>
                        </div>
                      ) : error ? (
                        <Card className="border-destructive shadow-md">
                          <CardHeader>
                            <CardTitle className="text-destructive flex items-center">
                              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mr-2">
                                <circle cx="12" cy="12" r="10" />
                                <line x1="12" y1="8" x2="12" y2="12" />
                                <line x1="12" y1="16" x2="12.01" y2="16" />
                              </svg>
                              Error
                            </CardTitle>
                            <CardDescription className="text-destructive/80">{error}</CardDescription>
                          </CardHeader>
                        </Card>
                      ) : sortedRoutines.length === 0 ? (
                        <Card className="shadow-md">
                          <CardHeader className="text-center py-8">
                            <div className="text-5xl mb-4 flex justify-center">📭</div>
                            <CardTitle className="text-xl mb-2">No classes found</CardTitle>
                            <CardDescription className="text-base">
                              Try adjusting your filters to see more results
                            </CardDescription>
                          </CardHeader>
                        </Card>
                      ) : (
                        <Card className="shadow-md">
                          <div className="overflow-x-auto">
                            <RoutineTable routines={sortedRoutines} />
                          </div>
                        </Card>
                      )}
                    </motion.div>
                  </section>
                }
              />
              <Route path="/weekly" element={<WeeklyRoutine routines={routines} />} />
            </Routes>
          </main>

          <footer className="border-t py-6 md:py-0 bg-secondary/20">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
              <p className="text-sm text-muted-foreground text-center md:text-left">
                &copy; 2025 ACS Future School. All rights reserved.
              </p>
              <div className="flex gap-4">
                <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
                <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Terms of Service
                </Link>
                <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors">
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
