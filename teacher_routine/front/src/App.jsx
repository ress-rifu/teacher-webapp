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
          <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
            <div className="container flex h-14 items-center">
              <Link to="/" className="flex items-center gap-2 mr-8">
                <img src="/logo.svg" alt="ACS Future School Logo" className="h-8 w-auto" />
                <span className="font-semibold hidden md:inline-block">ACS Future School</span>
              </Link>

              <nav className="flex gap-4 sm:gap-6">
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
                      className="text-center"
                    >
                      <h1 className="text-3xl font-bold tracking-tight">Class Schedule</h1>
                      <p className="text-muted-foreground mt-1">AFS Academic Program</p>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.5, delay: 0.2 }}
                    >
                      <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                          <div className="flex items-center">
                            <Filter className="h-4 w-4 mr-2" />
                            <CardTitle>Filters</CardTitle>
                          </div>
                          <Button
                            onClick={handleRemoveFilters}
                            variant="outline"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                          >
                            <X className="h-4 w-4 mr-2" />
                            Clear Filters
                          </Button>
                        </CardHeader>
                        <CardContent>
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="space-y-2">
                              <Label className="flex items-center">
                                <User className="h-4 w-4 mr-2 text-primary" />
                                Teacher
                              </Label>
                              <Select 
                                value={selectedTeacher} 
                                onValueChange={setSelectedTeacher}
                              >                                <SelectTrigger>
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

                            <div className="space-y-2">
                              <Label className="flex items-center">
                                <BookOpen className="h-4 w-4 mr-2 text-primary" />
                                Subject
                              </Label>
                              <Select 
                                value={selectedSubject} 
                                onValueChange={setSelectedSubject}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="All Subjects" />                                </SelectTrigger>
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

                            <div className="space-y-2">
                              <Label className="flex items-center">
                                <User className="h-4 w-4 mr-2 text-primary" />
                                Class
                              </Label>
                              <Select 
                                value={selectedClass} 
                                onValueChange={setSelectedClass}
                              >                                <SelectTrigger>
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

                            <div className="space-y-2">
                              <Label className="flex items-center mb-2">
                                <Calendar className="h-4 w-4 mr-2 text-primary" />
                                Date Range
                              </Label>
                              <div className="flex flex-col gap-3">
                                <DatePicker 
                                  selected={startDate}
                                  onSelect={setStartDate}
                                />
                                <DatePicker 
                                  selected={endDate}
                                  onSelect={setEndDate}
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
                        <div className="flex justify-center items-center h-64">
                          <Loader2 className="h-12 w-12 text-primary animate-spin" />
                        </div>
                      ) : error ? (
                        <Card className="border-destructive">
                          <CardHeader>
                            <CardTitle className="text-destructive">Error</CardTitle>
                            <CardDescription>{error}</CardDescription>
                          </CardHeader>
                        </Card>
                      ) : sortedRoutines.length === 0 ? (
                        <Card>
                          <CardHeader className="text-center">
                            <div className="text-5xl mb-4 flex justify-center">📭</div>
                            <CardTitle>No classes found</CardTitle>
                            <CardDescription>Try adjusting your filters</CardDescription>
                          </CardHeader>
                        </Card>
                      ) : (
                        <Card>
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

          <footer className="border-t py-6 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-16 md:flex-row">
              <p className="text-sm text-muted-foreground text-center md:text-left">
                &copy; 2025 ACS Future School. All rights reserved.
              </p>
              <div className="flex gap-4">
                <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Privacy Policy
                </Link>
                <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">
                  Terms of Service
                </Link>
                <Link to="#" className="text-sm text-muted-foreground hover:text-foreground">
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
