import React from 'react';

const RoutineTable = ({ routines }) => {
    const handleGenerateClick = async (routine) => {
        const { classDate, time, className, subject, teacher, topic, part } = routine;

        try {
            const response = await fetch('https://your-backend-url/api/generate-slide', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ classDate, time, className, subject, teacher, topic, part }),
            });

            const data = await response.json();

            if (response.ok) {
                window.open(data.url, '_blank');
            } else {
                alert('Failed to generate slide');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('Error generating slide');
        }
    };

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
                        <th className="p-3">Part</th>
                        <th className="p-3">Action</th> {/* Added Action column */}
                    </tr>
                </thead>
                <tbody>
                    {routines.map((routine, index) => (
                        <tr key={index} className="border-b hover:bg-gray-200 transition-all duration-300">
                            <td className="p-3">{routine[0]}</td> {/* Class Date */}
                            <td className="p-3">{routine[1]}</td> {/* Time */}
                            <td className="p-3">{routine[11]}</td> {/* Class */}
                            <td className="p-3">{routine[5]}</td> {/* Subject */}
                            <td className="p-3">{routine[10]}</td> {/* Teacher */}
                            <td className="p-3">{routine[6]}</td> {/* Topic */}
                            <td className="p-3">{routine[7]}</td> {/* Part */}
                            <td className="p-3">
                                <button
                                    className="bg-green-500 text-white px-4 py-2 rounded"
                                    onClick={() => handleGenerateClick(routine)}
                                >
                                    Generate
                                </button>
                            </td> {/* Generate Button */}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default RoutineTable;
