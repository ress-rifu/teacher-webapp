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

  const handleDateChange = (date) => {
    setSelectedDate(date);
  };

  // Get routines for the current week
  const sortedRoutines = getRoutinesForWeek(currentWeekIndex);

  return (
    <div className="space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold tracking-tight text-primary">Weekly Class Schedule</h1>
        <div className="flex items-center justify-center mt-4 space-x-4">
          <Button 
            onClick={handlePreviousWeek} 
            variant="outline" 
            size="sm"
            className="transition-colors hover:bg-secondary"
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous Week
          </Button>
          <p className="text-lg font-medium text-gray-700 px-4 py-2 rounded-full bg-secondary/50">
            {weekRangeText}
          </p>
          <Button 
            onClick={handleNextWeek} 
            variant="outline" 
            size="sm"
            className="transition-colors hover:bg-secondary"
          >
            Next Week
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>

      <Card className="shadow-md border-neutral-100">
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
              className="text-destructive hover:text-destructive hover:bg-destructive/10 transition-colors"
            >
              <X className="h-4 w-4 mr-2" />
              Clear Filters
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            <div className="space-y-2.5">
              <Label className="flex items-center text-sm font-medium">
                <Clock className="h-4 w-4 mr-2 text-primary" />
                Time
              </Label>
              <Select 
                value={filterTime}
                onValueChange={handleFilterTime}
              >                
                <SelectTrigger className="h-10 w-full">
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

            <div className="space-y-2.5">
              <Label className="flex items-center text-sm font-medium">
                <UserCheck className="h-4 w-4 mr-2 text-primary" />
                Class
              </Label>
              <Select 
                value={filterClass}
                onValueChange={handleFilterClass}
              >
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="All Classes" />
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

            <div className="space-y-2.5">
              <Label className="flex items-center text-sm font-medium">
                <BookOpen className="h-4 w-4 mr-2 text-primary" />
                Subject
              </Label>
              <Select 
                value={filterSubject}
                onValueChange={handleFilterSubject}
              >
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="All Subjects" />
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

            <div className="space-y-2.5">
              <Label className="flex items-center text-sm font-medium">
                <User className="h-4 w-4 mr-2 text-primary" />
                Teacher
              </Label>
              <Select 
                value={filterTeacher}
                onValueChange={handleFilterTeacher}
              >
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="All Teachers" />
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

            <div className="space-y-2.5">
              <Label className="flex items-center text-sm font-medium">
                <Calendar className="h-4 w-4 mr-2 text-primary" />
                Select Date
              </Label>
              <DatePicker 
                selected={selectedDate}
                onSelect={handleDateChange}
                placeholder="Choose a specific date"
                className="w-full"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md overflow-hidden">
        <AnimatePresence>
          {sortedRoutines.length > 0 ? (
            <Table className="border rounded-lg">
              <TableCaption className="mt-4 text-sm text-muted-foreground">Weekly schedule for {weekRangeText}</TableCaption>
              <TableHeader className="bg-secondary/50">
                <TableRow>
                  <TableHead className="font-medium">Day</TableHead>
                  <TableHead className="font-medium">Class Date</TableHead>
                  <TableHead className="font-medium">Time</TableHead>
                  <TableHead className="font-medium">Class</TableHead>
                  <TableHead className="font-medium">Subject</TableHead>
                  <TableHead className="font-medium">Teacher</TableHead>
                  <TableHead className="font-medium">Topic</TableHead>
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
                      className={isToday ? "bg-primary/10" : idx % 2 === 0 ? "bg-white" : "bg-secondary/20"}
                    >
                      <TableCell className="font-medium">{dayName}</TableCell>
                      <TableCell>{routine[0]}</TableCell>
                      <TableCell>{routine[1]}</TableCell>
                      <TableCell>{routine[36]}</TableCell>
                      <TableCell className="font-medium">{routine[5]}</TableCell>
                      <TableCell>{routine[10]}</TableCell>
                      <TableCell className="max-w-[200px] truncate">{routine[6]}</TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="p-8 text-center"
            >
              <div className="text-5xl mb-4 flex justify-center">📭</div>
              <h3 className="text-xl font-semibold mb-2">No classes found</h3>
              <p className="text-muted-foreground">
                No classes match your filters for this week. Try adjusting your filters or select another week.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </Card>
    </div>
  );
};

export default WeeklyRoutine;