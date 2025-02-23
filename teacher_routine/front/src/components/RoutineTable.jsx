// teacher-routine-frontend/src/components/RoutineTable.jsx

import React from 'react';

const RoutineTable = ({ routines }) => {
    return (
        <div>
            <table className="min-w-full table-auto mt-4 shadow-lg rounded-lg overflow-hidden">
                <thead className="bg-blue-500 text-white">
                    <tr>
                        <th className="p-3">Class Date</th>
                        <th className="p-3">Time</th>
                        <th className="p-3">Class</th>
                        <th className="p-3">Subject</th>
                        <th className="p-3">Teacher</th>
                        <th className="p-3">Topic</th>
                    </tr>
                </thead>
                <tbody>
                    {routines.map((routine, index) => (
                        <tr key={index} className="border-b hover:bg-gray-200 transition-all duration-300">
                            <td className="p-3">{routine[0]}</td> {/* Column B: Class Date */}
                            <td className="p-3">{routine[1]}</td> {/* Column C: Time */}
                            <td className="p-3">{routine[2]}</td> {/* Column D: Class */}
                            <td className="p-3">{routine[4]}</td> {/* Column F: Subject */}
                            <td className="p-3">{routine[10]}</td> {/* Column K: Teacher */}
                            <td className="p-3">{routine[8]}</td> {/* Column J: Topic */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RoutineTable;
