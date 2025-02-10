"use client"

import { useState, useEffect } from "react"
import { BrowserRouter as Router, Route, Routes } from "react-router-dom"
import WeeklyRoutine from "./components/WeeklyRoutine"
import axios from "axios"
import { motion } from "framer-motion"
import "react-datepicker/dist/react-datepicker.css"

const App = () => {
  // State declarations
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

  const API_URL = process.env.REACT_APP_API_URL || "https://teacher-webapp.onrender.com"

  // Fetch routines effect
  useEffect(() => {
    const fetchRoutines = async () => {
      try {
        const response = await axios.get(`${API_URL}/api/routines`)
        const routinesData = response.data
        const filteredRoutines = routinesData.slice(1)

        // Sort routines by date and time
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
  }, [API_URL]) // Added API_URL to dependencies

  // Filter routines based on selected criteria
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

  // Sort filtered routines
  const sortedRoutines = [...filteredRoutines].sort((a, b) => {
    const dateA = new Date(a[0])
    const dateB = new Date(b[0])
    return dateA - dateB || a[1].localeCompare(b[1])
  })

  // Handler to remove all filters
  const handleRemoveFilters = () => {
    setSelectedTeacher("")
    setSelectedClass("")
    setSelectedSubject("")
    setSelectedDate(null)
  }

  // Component JSX
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50">
        {/* Navigation */}
        <nav className="bg-white/80 backdrop-blur-md border-b border-blue-100 sticky top-0 z-50">
          {/* Navigation content */}
        </nav>

        <main className="container mx-auto px-4 py-8">
          <Routes>
            <Route
              path="/"
              element={
                <section className="space-y-8">
                  {/* Header */}
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
                    {/* Filter content */}
                  </motion.div>

                  {/* Content Section */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.5, delay: 0.4 }}
                  >
                    {/* Conditional rendering based on loading, error, and data states */}
                  </motion.div>
                </section>
              }
            />
            <Route path="/weekly" element={<WeeklyRoutine routines={routines} />} />
          </Routes>
        </main>

        <footer className="bg-white border-t border-blue-100 mt-12">{/* Footer content */}</footer>
      </div>
    </Router>
  )
}

export default App;

