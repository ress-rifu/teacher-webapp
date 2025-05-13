import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,

  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious
} from "@/components/ui/pagination";
import { useState } from "react";

const RoutineTable = ({ routines }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 10;

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

    // Calculate pagination
    const totalPages = Math.ceil(routines.length / itemsPerPage);
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = routines.slice(indexOfFirstItem, indexOfLastItem);    return (
        <div className="space-y-6">
            <Table className="border border-gray-200 rounded-lg overflow-hidden shadow-md">
                <TableCaption className="mt-4 text-sm text-gray-500 pb-4">Teacher routine schedule for ACS Future School</TableCaption>
                <TableHeader className="bg-gray-50 border-b">
                    <TableRow className="hover:bg-transparent">
                        <TableHead className="font-semibold text-gray-700 py-4">Class Date</TableHead>
                        <TableHead className="font-semibold text-gray-700">Time</TableHead>
                        <TableHead className="font-semibold text-gray-700">Class</TableHead>
                        <TableHead className="font-semibold text-gray-700">Subject</TableHead>
                        <TableHead className="font-semibold text-gray-700">Teacher</TableHead>
                        <TableHead className="font-semibold text-gray-700">Topic</TableHead>
                        <TableHead className="font-semibold text-gray-700">Part</TableHead>
                        <TableHead className="font-semibold text-gray-700">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentItems.map((routine, index) => (
                        <TableRow
                            key={index}
                            className={index % 2 === 0 ? "bg-white hover:bg-gray-50 transition-colors" : "bg-gray-50 hover:bg-gray-100 transition-colors"}
                        >
                            <TableCell className="font-medium text-gray-700">{routine[0]}</TableCell> {/* Class Date */}
                            <TableCell className="text-gray-600">{routine[1]}</TableCell> {/* Time */}
                            <TableCell className="text-gray-600">{routine[36]}</TableCell> {/* Class */}
                            <TableCell className="font-medium text-gray-700">{routine[5]}</TableCell> {/* Subject */}
                            <TableCell className="text-gray-600">{routine[10]}</TableCell> {/* Teacher */}
                            <TableCell className="max-w-[200px] truncate text-gray-600">{routine[6]}</TableCell> {/* Topic */}
                            <TableCell className="text-gray-600">{routine[7]}</TableCell> {/* Part */}
                            <TableCell>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    className="bg-white text-gray-700 border-gray-200 hover:bg-gray-700 hover:text-white hover:border-gray-700 transition-colors font-medium shadow-sm focus:ring-2 focus:ring-gray-500 focus:ring-offset-1"
                                    onClick={() => handleGenerateClick(routine)}
                                >
                                    Generate
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
              {/* Pagination */}
            {totalPages > 1 && (
                <Pagination className="justify-center mt-8">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={currentPage === 1
                                    ? "opacity-50 cursor-not-allowed border-gray-200"
                                    : "hover:bg-gray-100 text-gray-700 transition-colors border-gray-200 shadow-sm"}
                            />
                        </PaginationItem>

                        {Array.from({ length: Math.min(totalPages, 5) }).map((_, i) => {
                            // Logic to display current page and surrounding pages
                            let pageNum = i + 1;
                            if (totalPages > 5 && currentPage > 3) {
                                pageNum = currentPage - 3 + i + 1;
                            }
                            if (pageNum <= totalPages) {
                                return (
                                    <PaginationItem key={i}>
                                        <PaginationLink
                                            isActive={currentPage === pageNum}
                                            onClick={() => setCurrentPage(pageNum)}
                                            className={currentPage === pageNum
                                                ? "bg-gray-700 text-white hover:bg-gray-800 border-gray-700 shadow-sm"
                                                : "text-gray-700 hover:bg-gray-100 hover:text-gray-800 transition-colors border-gray-200 shadow-sm"}
                                        >
                                            {pageNum}
                                        </PaginationLink>
                                    </PaginationItem>
                                );
                            }
                            return null;
                        })}

                        <PaginationItem>
                            <PaginationNext
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                                disabled={currentPage === totalPages}
                                className={currentPage === totalPages
                                    ? "opacity-50 cursor-not-allowed border-gray-200"
                                    : "hover:bg-gray-100 text-gray-700 transition-colors border-gray-200 shadow-sm"}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
};

export default RoutineTable;
