import { useState, useMemo } from "react";
import { DatePicker } from "@/components/ui/date-picker";
import {
  Calendar,
  Clock,
  BookOpen,
  User,
  UserCheck,
  ChevronLeft,
  ChevronRight,
  Filter,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const WeeklyRoutine = ({ routines = [] }) => {
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0); // Default to current week  const [sortClass, setSortClass] = useState(null);
  const [sortTime, setSortTime] = useState(null);
  const [sortSubject, setSortSubject] = useState(null);
  const [filterClass, setFilterClass] = useState("all_classes");
  const [filterTime, setFilterTime] = useState("all_times");
  const [filterSubject, setFilterSubject] = useState("all_subjects");
  const [filterTeacher, setFilterTeacher] = useState("all_teachers");
  const [selectedDate, setSelectedDate] = useState(null);

  // Week calculation to show Saturday to Thursday
  const getSaturdayToThursdayRange = (weekIndex) => {
    const currentDate = new Date();
    const dayOfWeek = currentDate.getDay(); // 0 = Sunday, 6 = Saturday

    // Calculate days to subtract to get to the most recent Saturday
    const daysToSubtract = (dayOfWeek + 1) % 7;
    const startDate = new Date(currentDate);
    startDate.setDate(currentDate.getDate() - daysToSubtract + weekIndex * 7);
    startDate.setHours(0, 0, 0, 0); // Start of Saturday

    const endDate = new Date(startDate);
    endDate.setDate(startDate.getDate() + 5); // Thursday (5 days after Saturday)
    endDate.setHours(23, 59, 59, 999); // End of Thursday

    return { startDate, endDate };
  };

  const getRoutinesForWeek = (weekIndex) => {
    const { startDate: weekStart, endDate: weekEnd } =
      getSaturdayToThursdayRange(weekIndex);

    const filteredRoutines = routines.filter((routine) => {
      if (!routine[0] || !routine[0].trim()) return false;

      const routineDate = new Date(routine[0]);
      return routineDate >= weekStart && routineDate <= weekEnd;
    });    const filteredByClass = filteredRoutines.filter((routine) =>
      filterClass === "all_classes" || !filterClass
        ? true
        : routine[11]?.toLowerCase().includes(filterClass.toLowerCase())
    );

    const filteredByTime = filteredByClass.filter((routine) =>
      filterTime === "all_times" || !filterTime
        ? true
        : routine[1]?.toLowerCase().includes(filterTime.toLowerCase())
    );

    const filteredBySubject = filteredByTime.filter((routine) =>
      filterSubject === "all_subjects" || !filterSubject
        ? true
        : routine[5]?.toLowerCase().includes(filterSubject.toLowerCase())
    );

    const filteredByTeacher = filteredBySubject.filter((routine) =>
      filterTeacher === "all_teachers" || !filterTeacher
        ? true
        : routine[10] &&
          routine[10].toLowerCase().includes(filterTeacher.toLowerCase())
    );

    const filteredByDate = filteredByTeacher.filter((routine) => {
      if (!selectedDate) return true;
      const routineDate = new Date(routine[0]);
      return routineDate.toDateString() === selectedDate.toDateString();
    });

    return filteredByDate.sort((a, b) => {
      const dateA = new Date(a[0]);
      const dateB = new Date(b[0]);

      if (dateA - dateB !== 0) return dateA - dateB;
      if (sortClass)
        return sortClass === "asc"
          ? a[11]?.localeCompare(b[11] || "")
          : b[11]?.localeCompare(a[11] || "");
      if (sortTime)
        return sortTime === "asc"
          ? a[1]?.localeCompare(b[1] || "")
          : b[1]?.localeCompare(a[1] || "");
      if (sortSubject)
        return sortSubject === "asc"
          ? a[5]?.localeCompare(b[5] || "")
          : b[5]?.localeCompare(a[5] || "");

      return 0;
    });
  };

  // Get current week's date range
  const { startDate: weekStart, endDate: weekEnd } = useMemo(
    () => getSaturdayToThursdayRange(currentWeekIndex),
    [currentWeekIndex]
  );

  // Format dates for display
  const weekRangeText = useMemo(() => {
    const startMonth = weekStart.toLocaleString("default", { month: "short" });
    const endMonth = weekEnd.toLocaleString("default", { month: "short" });
    const startDay = weekStart.getDate();
    const endDay = weekEnd.getDate();
    const startYear = weekStart.getFullYear();
    const endYear = weekEnd.getFullYear();

    if (startYear !== endYear) {
      return `${startMonth} ${startDay}, ${startYear} - ${endMonth} ${endDay}, ${endYear}`;
    } else if (startMonth !== endMonth) {
      return `${startMonth} ${startDay} - ${endMonth} ${endDay}, ${startYear}`;
    } else {
      return `${startMonth} ${startDay} - ${endDay}, ${startYear}`;
    }
  }, [weekStart, weekEnd]);

  // Extract unique options for filters
  const uniqueClasses = useMemo(
    () =>
      [
        ...new Set(
          routines
            .filter((r) => r[11])
            .map((r) => r[11])
            .filter(Boolean)
        ),
      ].sort(),
    [routines]
  );

  const uniqueTimes = useMemo(
    () =>
      [
        ...new Set(
          routines
            .filter((r) => r[1])
            .map((r) => r[1])
            .filter(Boolean)
        ),
      ].sort(),
    [routines]
  );

  const uniqueSubjects = useMemo(
    () =>
      [
        ...new Set(
          routines
            .filter((r) => r[5])
            .map((r) => r[5])
            .filter(Boolean)
        ),
      ].sort(),
    [routines]
  );

  const uniqueTeachers = useMemo(
    () =>
      [
        ...new Set(
          routines
            .filter((r) => r[10])
            .map((r) => r[10])
            .filter(Boolean)
        ),
      ].sort(),
    [routines]
  );

  // Handle sorting and filtering
  const handleSortClass = () => {
    setSortClass(sortClass === "asc" ? "desc" : "asc");
    setSortTime(null);
    setSortSubject(null);
  };

  const handleSortTime = () => {
    setSortTime(sortTime === "asc" ? "desc" : "asc");
    setSortClass(null);
    setSortSubject(null);
  };

  const handleSortSubject = () => {
    setSortSubject(sortSubject === "asc" ? "desc" : "asc");
    setSortClass(null);
    setSortTime(null);
  };

  const handleFilterClass = (value) => {
    setFilterClass(value);
  };

  const handleFilterTime = (value) => {
    setFilterTime(value);
  };

  const handleFilterSubject = (value) => {
    setFilterSubject(value);
  };

  const handleFilterTeacher = (value) => {
    setFilterTeacher(value);
  };
  const handleClearFilters = () => {
    setFilterClass("all_classes");
    setFilterTime("all_times");
    setFilterSubject("all_subjects");
    setFilterTeacher("all_teachers");
    setSelectedDate(null);
  };

  const handlePreviousWeek = () => {
    setCurrentWeekIndex(currentWeekIndex - 1);
  };

  const handleNextWeek = () => {
    setCurrentWeekIndex(currentWeekIndex + 1);
  };

  // Get routines for the current week
  const sortedRoutines = getRoutinesForWeek(currentWeekIndex);

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight">Weekly Class Schedule</h1>
        <p className="text-muted-foreground mt-1">
          {weekRangeText}
        </p>
      </div>

      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Filter className="h-5 w-5 text-primary" />
              <CardTitle>Filters</CardTitle>
            </div>
            <Button
              onClick={handleClearFilters}
              variant="outline"
              size="sm"
              className="text-destructive hover:text-destructive"
            >
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-4">
            <div className="space-y-2">
              <Label className="flex items-center">
                <Clock className="h-4 w-4 mr-2 text-primary" />
                Time
              </Label>
              <Select 
                value={filterTime}
                onValueChange={handleFilterTime}
              >                <SelectTrigger>
                  <SelectValue placeholder="All Times" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_times">All Times</SelectItem>
                  {uniqueTimes.map((time, i) => (
                    <SelectItem key={i} value={time}>
                      {time}
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
                value={filterClass}
                onValueChange={handleFilterClass}
              >
                <SelectTrigger>                  <SelectValue placeholder="All Classes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_classes">All Classes</SelectItem>
                  {uniqueClasses.map((cls, i) => (
                    <SelectItem key={i} value={cls}>
                      {cls}
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
                value={filterSubject}
                onValueChange={handleFilterSubject}
              >
                <SelectTrigger>                  <SelectValue placeholder="All Subjects" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_subjects">All Subjects</SelectItem>
                  {uniqueSubjects.map((subject, i) => (
                    <SelectItem key={i} value={subject}>
                      {subject}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center">
                <UserCheck className="h-4 w-4 mr-2 text-primary" />
                Teacher
              </Label>
              <Select 
                value={filterTeacher}
                onValueChange={handleFilterTeacher}
              >
                <SelectTrigger>                  <SelectValue placeholder="All Teachers" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all_teachers">All Teachers</SelectItem>
                  {uniqueTeachers.map((teacher, i) => (
                    <SelectItem key={i} value={teacher}>
                      {teacher}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center">
                <Calendar className="h-4 w-4 mr-2 text-primary" />
                Date
              </Label>
              <DatePicker 
                selected={selectedDate}
                onSelect={setSelectedDate}
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center mb-4">
        <Button
          onClick={handlePreviousWeek}
          variant="outline"
          className="flex items-center"
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Previous Week
        </Button>
        <Button
          onClick={handleNextWeek}
          variant="outline"
          className="flex items-center"
        >
          Next Week
          <ChevronRight className="h-4 w-4 ml-2" />
        </Button>
      </div>

      <Card>
        <AnimatePresence>
          {sortedRoutines.length > 0 ? (
            <Table>
              <TableCaption>Weekly schedule for {weekRangeText}</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Day</TableHead>
                  <TableHead>Class Date</TableHead>
                  <TableHead>Time</TableHead>
                  <TableHead>Class</TableHead>
                  <TableHead>Subject</TableHead>
                  <TableHead>Teacher</TableHead>
                  <TableHead>Topic</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {sortedRoutines.map((routine, idx) => {
                  const routineDate = new Date(routine[0]);
                  const dayName = routineDate.toLocaleString("default", {
                    weekday: "long",
                  });
                  const isToday =
                    routineDate.toDateString() === new Date().toDateString();

                  return (
                    <TableRow 
                      key={idx}
                      className={isToday ? "bg-primary/10" : ""}
                    >
                      <TableCell className="font-medium">{dayName}</TableCell>
                      <TableCell>{routine[0]}</TableCell>
                      <TableCell>{routine[1]}</TableCell>
                      <TableCell>{routine[36]}</TableCell>
                      <TableCell>{routine[5]}</TableCell>
                      <TableCell>{routine[10]}</TableCell>
                      <TableCell>{routine[6]}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <Filter className="h-12 w-12 mb-4" />
              <p>No routines found for the selected filters.</p>
            </div>          )}
        </AnimatePresence>
      </Card>
    </div>
  );
};

export default WeeklyRoutine;