"use client"

import { useState, useMemo } from "react"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"
import { FiFilter, FiXCircle, FiCalendar, FiClock, FiBook, FiUserCheck, FiChevronLeft, FiChevronRight } from "react-icons/fi"
import { motion, AnimatePresence } from "framer-motion"

const WeeklyRoutine = ({ routines = [] }) => {
  const [startDate, setStartDate] = useState(new Date())
  const [selectedDay, setSelectedDay] = useState(null)
  const [showFilter, setShowFilter] = useState(false)
  const [filterText, setFilterText] = useState("")
  const [filterClass, setFilterClass] = useState("")
  const [filterTeacher, setFilterTeacher] = useState("")
  const [filterSubject, setFilterSubject] = useState("")

  // Get unique filter values
  const uniqueClasses = useMemo(() => [...new Set(routines.map((r) => r[2]))], [routines])
  const uniqueTeachers = useMemo(() => [...new Set(routines.map((r) => r[9]))], [routines])
  const uniqueSubjects = useMemo(() => [...new Set(routines.map((r) => r[4]))], [routines])

  // Filter logic
  const filteredRoutines = useMemo(() => {
    let filtered = routines

    if (filterText) {
      filtered = filtered.filter((event) => event.title.toLowerCase().includes(filterText.toLowerCase()))
    }

    if (filterClass) {
      filtered = filtered.filter((event) => event[2].toLowerCase().includes(filterClass.toLowerCase()))
    }

    if (filterTeacher) {
      filtered = filtered.filter((event) => event[9].toLowerCase().includes(filterTeacher.toLowerCase()))
    }

    if (filterSubject) {
      filtered = filtered.filter((event) => event[4].toLowerCase().includes(filterSubject.toLowerCase()))
    }

    return filtered
  }, [filterText, filterClass, filterTeacher, filterSubject, routines])

  const handleDayClick = (day) => {
    setSelectedDay(day)
  }

  const handleFilterChange = (e) => {
    setFilterText(e.target.value)
  }

  const handleClearFilters = () => {
    setFilterText("")
    setFilterClass("")
    setFilterTeacher("")
    setFilterSubject("")
  }

  const dayEvents = filteredRoutines.filter((event) => {
    return selectedDay && new Date(event[0]).toDateString() === selectedDay.toDateString()
  })

  const days = []
  for (let i = 0; i < 7; i++) {
    const date = new Date()
    date.setDate(date.getDate() - date.getDay() + i)
    days.push(date)
  }

  return (
    <div className="weekly-routine bg-gradient-to-br from-blue-50 to-indigo-100 min-h-screen p-4 md:p-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden"
      >
        <div className="p-6 md:p-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <motion.h1
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="text-3xl md:text-4xl font-bold text-gray-800 mb-4 md:mb-0"
            >
              Weekly Routine
            </motion.h1>
            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowFilter(!showFilter)}
                className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center"
              >
                <FiFilter className="mr-2" /> Filter
              </motion.button>
              <DatePicker
                selected={startDate}
                onChange={(date) => setStartDate(date)}
                customInput={
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-indigo-500 text-white px-4 py-2 rounded-lg flex items-center"
                  >
                    <FiCalendar className="mr-2" /> Select Date
                  </motion.button>
                }
              />
            </div>
          </div>

          <AnimatePresence>
            {showFilter && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="mb-8"
              >
                <div className="bg-gray-100 p-4 rounded-lg flex items-center">
                  <input
                    type="text"
                    value={filterText}
                    onChange={handleFilterChange}
                    placeholder="Search events..."
                    className="flex-grow p-2 rounded-l-md border-2 border-gray-300 focus:outline-none focus:border-blue-500"
                  />
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleClearFilters}
                    className="bg-red-500 text-white p-2 rounded-r-md"
                  >
                    <FiXCircle size={24} />
                  </motion.button>
                </div>
                {/* Class, Teacher, and Subject filters */}
                <div className="flex flex-wrap gap-4 mt-4">
                  <div className="flex-grow">
                    <label className="text-sm font-medium">Class</label>
                    <select
                      value={filterClass}
                      onChange={(e) => setFilterClass(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">All Classes</option>
                      {uniqueClasses.map((cls, i) => (
                        <option key={i} value={cls}>
                          {cls}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-grow">
                    <label className="text-sm font-medium">Teacher</label>
                    <select
                      value={filterTeacher}
                      onChange={(e) => setFilterTeacher(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">All Teachers</option>
                      {uniqueTeachers.map((teacher, i) => (
                        <option key={i} value={teacher}>
                          {teacher}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div className="flex-grow">
                    <label className="text-sm font-medium">Subject</label>
                    <select
                      value={filterSubject}
                      onChange={(e) => setFilterSubject(e.target.value)}
                      className="w-full p-2 border rounded-md"
                    >
                      <option value="">All Subjects</option>
                      {uniqueSubjects.map((subject, i) => (
                        <option key={i} value={subject}>
                          {subject}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
            {days.map((day, index) => (
              <motion.div
                key={day.toDateString()}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleDayClick(day)}
                className={`bg-white rounded-lg shadow-md p-4 cursor-pointer ${
                  selectedDay && selectedDay.toDateString() === day.toDateString() ? "ring-2 ring-blue-500" : ""
                }`}
              >
                <div className="text-center mb-2">
                  <div className="text-lg font-semibold text-gray-800">
                    {day.toLocaleDateString("en-US", { weekday: "short" })}
                  </div>
                  <div className="text-3xl font-bold text-gray-900">{day.getDate()}</div>
                </div>
                {selectedDay && selectedDay.toDateString() === day.toDateString() && dayEvents.length > 0 && (
                  <motion.ul
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.3 }}
                    className="mt-2 space-y-2"
                  >
                    {dayEvents.map((event) => (
                      <motion.li
                        key={event.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3 }}
                        className="text-sm text-gray-600 flex items-center"
                      >
                        <FiClock className="mr-1" /> {event.time} - {event.title}
                      </motion.li>
                    ))}
                  </motion.ul>
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>
    </div>
  )
}

export default WeeklyRoutine;
