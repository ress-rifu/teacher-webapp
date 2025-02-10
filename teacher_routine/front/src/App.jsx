import { useState, useEffect } from "react"
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom"
import RoutineTable from "./components/RoutineTable"
import WeeklyRoutine from "./components/WeeklyRoutine"
import axios from "axios"
import { FiFilter, FiXCircle, FiCalendar, FiClock, FiBook, FiUser, FiHome } from "react-icons/fi"
import { motion } from "framer-motion"
import DatePicker from "react-datepicker"
import "react-datepicker/dist/react-datepicker.css"

const App = () => {
  const [routines, setRoutines] = useState([])
  const [selectedTeacher, setSelectedTeacher] = useState("")
  const [selectedClass, setSelectedClass] = useState("")
  const [selectedSubject, setSelectedSubject] = useState("")
  const [selectedDate, setSelectedDate] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const [uniqueTeachers, setUniqueTeachers] = useState([])
  const [uniqueClasses, setUniqueClasses] = useState([])
  const [uniqueSubjects, setUniqueSubjects] = useState([])

  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/routines")
        const routinesData = response.data

        const today = new Date()
        today.setHours(0, 0, 0, 0)

        const filteredRoutines = routinesData.slice(1).filter((routine) => {
          const routineDate = new Date(routine[0])
          return routineDate >= today
        })

        filteredRoutines.sort((a, b) => {
          const dateA = new Date(a[0])
          const dateB = new Date(b[0])
          if (dateA - dateB !== 0) return dateA - dateB
          return a[1].localeCompare(b[1])
        })

        setRoutines(filteredRoutines)

        // Extract unique values
        setUniqueTeachers([...new Set(filteredRoutines.map((r) => r[9]).filter(Boolean))])
        setUniqueClasses([...new Set(filteredRoutines.map((r) => r[2]).filter(Boolean))])
        setUniqueSubjects([...new Set(filteredRoutines.map((r) => r[4]).filter(Boolean))])

        setLoading(false)
      } catch (error) {
        setError("Failed to load data. Please try again later.")
        setLoading(false)
      }
    }

    fetchRoutines()
  }, [])

  const filteredRoutines = routines.filter((routine) => {
    if (!routine[0] || !routine[8]) return false
    const routineDate = new Date(routine[0])

    return (
      (!selectedTeacher || routine[9]?.toLowerCase().includes(selectedTeacher.toLowerCase())) &&
      (!selectedClass || routine[2]?.toLowerCase().includes(selectedClass.toLowerCase())) &&
      (!selectedSubject || routine[4]?.toLowerCase().includes(selectedSubject.toLowerCase())) &&
      (!selectedDate || routineDate.toDateString() === selectedDate.toDateString())
    )
  })

  const sortedRoutines = [...filteredRoutines].sort((a, b) => {
    const dateA = new Date(a[0])
    const dateB = new Date(b[0])
    return dateA - dateB || a[1].localeCompare(b[1])
  })

  const handleRemoveFilters = () => {
    setSelectedTeacher("")
    setSelectedClass("")
    setSelectedSubject("")
    setSelectedDate(null)
  }

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        {/* Navigation */}
        <nav className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
          <div className="container mx-auto px-4 py-3 flex flex-col md:flex-row justify-between items-center">
            <Link to="/" className="flex items-center space-x-3 mb-4 md:mb-0">
              <FiHome className="text-2xl text-blue-600" />
              <span className="text-xl font-bold text-gray-800">ACS Future School</span>
            </Link>

            <div className="flex space-x-4">
              <Link to="/" className="flex items-center px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                <FiCalendar className="mr-2 text-blue-600" />
                <span className="text-gray-700">Schedule</span>
              </Link>
              <Link to="/weekly" className="flex items-center px-3 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                <FiClock className="mr-2 text-purple-600" />
                <span className="text-gray-700">Weekly View</span>
              </Link>
            </div>
          </div>
        </nav>

        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route
              path="/"
              element={
                <section className="space-y-8">
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    className="text-center mb-12"
                  >
                    <h1 className="text-4xl font-bold text-gray-800 mb-2">Class Schedule</h1>
                    <p className="text-gray-600">View and manage upcoming classes</p>
                  </motion.div>

                  {/* Filters Section */}
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="bg-white rounded-xl shadow-lg p-6 mb-8"
                  >
                    <div className="flex items-center justify-between mb-6">
                      <div className="flex items-center space-x-2">
                        <FiFilter className="text-xl text-blue-600" />
                        <h2 className="text-xl font-semibold">Filters</h2>
                      </div>
                      <button
                        onClick={handleRemoveFilters}
                        className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <FiXCircle className="mr-2" />
                        Clear Filters
                      </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                          <FiUser className="mr-2 text-blue-500" />
                          Teacher
                        </label>
                        <select
                          value={selectedTeacher}
                          onChange={(e) => setSelectedTeacher(e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                        >
                          <option value="">All Teachers</option>
                          {uniqueTeachers.map((teacher) => (
                            <option key={teacher} value={teacher}>
                              {teacher}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                          <FiBook className="mr-2 text-green-500" />
                          Subject
                        </label>
                        <select
                          value={selectedSubject}
                          onChange={(e) => setSelectedSubject(e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-all"
                        >
                          <option value="">All Subjects</option>
                          {uniqueSubjects.map((subject) => (
                            <option key={subject} value={subject}>
                              {subject}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                          <FiUser className="mr-2 text-purple-500" />
                          Class
                        </label>
                        <select
                          value={selectedClass}
                          onChange={(e) => setSelectedClass(e.target.value)}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all"
                        >
                          <option value="">All Classes</option>
                          {uniqueClasses.map((cls) => (
                            <option key={cls} value={cls}>
                              {cls}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className="space-y-2">
                        <label className="flex items-center text-sm font-medium text-gray-700">
                          <FiCalendar className="mr-2 text-orange-500" />
                          Date
                        </label>
                        <DatePicker
                          selected={selectedDate}
                          onChange={setSelectedDate}
                          className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-orange-500 transition-all"
                          placeholderText="Select Date"
                          dateFormat="yyyy-MM-dd"
                        />
                      </div>
                    </div>
                  </motion.div>

                  {/* Content Section */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    {loading ? (
                      <div className="flex justify-center items-center h-64">
                        <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div>
                      </div>
                    ) : error ? (
                      <div className="bg-red-50 p-6 rounded-xl text-center">
                        <div className="text-red-600 mb-4 text-4xl">⚠️</div>
                        <p className="text-red-700">{error}</p>
                      </div>
                    ) : sortedRoutines.length === 0 ? (
                      <div className="bg-white p-8 rounded-xl shadow-lg text-center">
                        <div className="text-6xl mb-4">📭</div>
                        <h3 className="text-xl font-semibold mb-2">No classes found</h3>
                        <p className="text-gray-600">Try adjusting your filters</p>
                      </div>
                    ) : (
                      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
                        <RoutineTable routines={sortedRoutines} />
                      </div>
                    )}
                  </motion.div>
                </section>
              }
            />

            <Route path="/weekly" element={<WeeklyRoutine routines={routines} />} />
          </Routes>
        </main>

        <footer className="bg-white border-t border-blue-100 mt-12">
          <div className="container mx-auto px-4 py-8">
            <div className="text-center text-sm text-gray-600">
              <p>© 2024 ACS Future School. All rights reserved.</p>
              <div className="mt-2 flex justify-center space-x-4">
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Privacy Policy
                </a>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Terms of Service
                </a>
                <a href="#" className="hover:text-blue-600 transition-colors">
                  Contact Us
                </a>
              </div>
            </div>
          </div>
        </footer>
      </div>
    </Router>
  )
}

export default App;

