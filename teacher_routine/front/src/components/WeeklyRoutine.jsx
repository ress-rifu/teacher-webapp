import { useState, useMemo } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import {
  FiFilter,
  FiXCircle,
  FiCalendar,
  FiClock,
  FiBook,
  FiUser,
  FiUserCheck,
  FiChevronLeft,
  FiChevronRight,
} from "react-icons/fi"
import { motion, AnimatePresence } from "framer-motion"

const WeeklyRoutine = ({ routines = [] }) => {
  const [currentWeekIndex, setCurrentWeekIndex] = useState(0)
  const [sortClass, setSortClass] = useState(null)
  const [sortTime, setSortTime] = useState(null)
  const [sortSubject, setSortSubject] = useState(null)
  const [filterClass, setFilterClass] = useState("")
  const [filterTime, setFilterTime] = useState("")
  const [filterSubject, setFilterSubject] = useState("")
  const [filterTeacher, setFilterTeacher] = useState("")
  const [selectedDate, setSelectedDate] = useState(null)

  // Corrected Week Calculation: Start from Saturday
  const getSaturdayToThursdayRange = (weekIndex) => {
    const currentDate = new Date()
    const currentDay = currentDate.getDay()
    const daysToSaturday = currentDay === 0 ? -6 : 6 - currentDay

    currentDate.setDate(currentDate.getDate() + daysToSaturday) // Set the current date to the upcoming Saturday
    const startDate = new Date(currentDate)
    startDate.setHours(0, 0, 0, 0) // Set to start of the day

    const endDate = new Date(startDate)
    endDate.setDate(startDate.getDate() + 4) // Thursday (4 days after Saturday)
    endDate.setHours(23, 59, 59, 999) // End of day for Thursday

    currentDate.setDate(currentDate.getDate() + weekIndex * 7) // Shift the date by `weekIndex`

    return { startDate, endDate }
  }

  const getRoutinesForWeek = (weekIndex) => {
    const { startDate: weekStart, endDate: weekEnd } = getSaturdayToThursdayRange(weekIndex)

    const filteredRoutines = routines.filter((routine) => {
      if (!routine[0] || !routine[0].trim()) return false

      const routineDate = new Date(routine[0])
      return routineDate >= weekStart && routineDate <= weekEnd
    })

    const filteredByClass = filteredRoutines.filter((routine) =>
      filterClass ? routine[2].toLowerCase().includes(filterClass.toLowerCase()) : true
    )

    const filteredByTime = filteredByClass.filter((routine) =>
      filterTime ? routine[1].toLowerCase().includes(filterTime.toLowerCase()) : true
    )

    const filteredBySubject = filteredByTime.filter((routine) =>
      filterSubject ? routine[4].toLowerCase().includes(filterSubject.toLowerCase()) : true
    )

    const filteredByTeacher = filteredBySubject.filter((routine) =>
      filterTeacher ? routine[9] && routine[9].toLowerCase().includes(filterTeacher.toLowerCase()) : true
    )

    const filteredByDate = filteredByTeacher.filter((routine) => {
      if (!selectedDate) return true
      const routineDate = new Date(routine[0])
      return routineDate.toDateString() === selectedDate.toDateString()
    })

    return filteredByDate.sort((a, b) => {
      const dateA = new Date(a[0])
      const dateB = new Date(b[0])

      if (dateA - dateB !== 0) return dateA - dateB
      if (sortClass) return sortClass === "asc" ? a[2].localeCompare(b[2]) : b[2].localeCompare(a[2])
      if (sortTime) return sortTime === "asc" ? a[1].localeCompare(b[1]) : b[1].localeCompare(a[1])
      if (sortSubject) return sortSubject === "asc" ? a[4].localeCompare(b[4]) : b[4].localeCompare(a[4])

      return 0
    })
  }

  const sortedRoutines = getRoutinesForWeek(currentWeekIndex)

  const handleSortClass = () => setSortClass(sortClass === "asc" ? "desc" : "asc")
  const handleSortTime = () => setSortTime(sortTime === "asc" ? "desc" : "asc")
  const handleSortSubject = () => setSortSubject(sortSubject === "asc" ? "desc" : "asc")

  const handleFilterClass = (e) => setFilterClass(e.target.value)
  const handleFilterTime = (e) => setFilterTime(e.target.value)
  const handleFilterSubject = (e) => setFilterSubject(e.target.value)
  const handleFilterTeacher = (e) => setFilterTeacher(e.target.value)

  const uniqueClasses = useMemo(() => [...new Set(routines.map((r) => r[2]))], [routines])
  const uniqueTimes = useMemo(() => [...new Set(routines.map((r) => r[1]))], [routines])
  const uniqueSubjects = useMemo(() => [...new Set(routines.map((r) => r[4]))], [routines])
  const uniqueTeachers = useMemo(() => [...new Set(routines.map((r) => r[9]))], [routines])

  const handleClearFilters = () => {
    setFilterClass("")
    setFilterTime("")
    setFilterSubject("")
    setFilterTeacher("")
    setSelectedDate(null)
  }

  const handlePreviousWeek = () => setCurrentWeekIndex(currentWeekIndex - 1)
  const handleNextWeek = () => setCurrentWeekIndex(currentWeekIndex + 1)

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
      <main className="container mx-auto px-4 py-8">
        <section className="space-y-8">
          <div className="text-center mb-12">
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Weekly Routine</h1>
            <p className="text-gray-600">View and manage weekly classes</p>
          </div>

          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg p-6 mb-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
              {[ ... ]}  {/* Filter UI here, unchanged from your provided code */}

            </div>

            {/* Clear Filters */}
            <div className="mt-4 text-right">
              <button
                onClick={handleClearFilters}
                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors"
              >
                <FiXCircle className="inline-block mr-2" />
                Clear Filters
              </button>
            </div>
          </motion.div>

          {/* Week Navigation */}
          <div className="flex justify-between items-center mb-4">
            <button
              onClick={handlePreviousWeek}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              <FiChevronLeft className="inline-block mr-2" />
              Previous Week
            </button>
            <button
              onClick={handleNextWeek}
              className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
            >
              Next Week
              <FiChevronRight className="inline-block ml-2" />
            </button>
          </div>

          {/* Displaying Weekly Routine Table */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-xl shadow-lg overflow-hidden"
          >
            <AnimatePresence>
              {sortedRoutines.length > 0 ? (
                <div className="overflow-x-auto">
                  <table className="min-w-full table-auto">
                    <thead className="bg-blue-500 text-white">
                      <tr>
                        {["Day", "Class Date", "Time", "Class", "Subject", "Teacher", "Topic"].map((heading, i) => (
                          <th key={i} className="p-4 text-left">
                            {heading}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {sortedRoutines.map((routine, idx) => {
                        const routineDate = new Date(routine[0])
                        const dayName = routineDate.toLocaleString("default", { weekday: "long" })
                        const isToday = routineDate.toDateString() === new Date().toDateString()

                        return (
                          <motion.tr
                            key={idx}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 0.3 }}
                            className={`border-b hover:bg-gray-100 transition-all duration-200 ${isToday ? "bg-blue-50" : ""}`}
                          >
                            <td className="p-4 whitespace-nowrap">{dayName}</td>
                            <td className="p-4 whitespace-nowrap">{routine[0]}</td>
                            <td className="p-4 whitespace-nowrap">{routine[1]}</td>
                            <td className="p-4 whitespace-nowrap">{routine[2]}</td>
                            <td className="p-4 whitespace-nowrap">{routine[4]}</td>
                            <td className="p-4 whitespace-nowrap">{routine[9]}</td>
                            <td className="p-4 whitespace-nowrap">{routine[8]}</td>
                          </motion.tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center h-64 text-gray-500">
                  <FiFilter className="text-5xl mb-4" />
                  <p>No routines found for the selected filters.</p>
                </div>
              )}
            </AnimatePresence>
          </motion.div>
        </section>
      </main>
    </div>
  )
}

export default WeeklyRoutine;
