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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";

const RoutineTable = ({ routines }) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage, setItemsPerPage] = useState(10);

    // Handle rows per page change
    const handleRowsPerPageChange = (value) => {
        setItemsPerPage(value === "All" ? routines.length : parseInt(value));
        setCurrentPage(1); // Reset to first page when changing rows per page
    };

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
            <Table className="border-collapse">
                <TableCaption className="mt-4 mb-2"></TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="px-4 py-3">Class Date</TableHead>
                        <TableHead className="px-4 py-3">Time</TableHead>
                        <TableHead className="px-4 py-3">Class</TableHead>
                        <TableHead className="px-4 py-3">Subject</TableHead>
                        <TableHead className="px-4 py-3">Teacher</TableHead>
                        <TableHead className="px-4 py-3">Topic</TableHead>
                        <TableHead className="px-4 py-3">Part</TableHead>
                        <TableHead className="px-4 py-3">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentItems.map((routine, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium px-4 py-3">{routine[0]}</TableCell> {/* Class Date */}
                            <TableCell className="px-4 py-3">{routine[1]}</TableCell> {/* Time */}
                            <TableCell className="px-4 py-3 font-bangla">{routine[36]}</TableCell> {/* Class */}
                            <TableCell className="font-medium px-4 py-3 font-bangla">{routine[5]}</TableCell> {/* Subject */}
                            <TableCell className="px-4 py-3">{routine[10]}</TableCell> {/* Teacher */}
                            <TableCell className="max-w-[200px] truncate px-4 py-3 font-bangla">{routine[6]}</TableCell> {/* Topic */}
                            <TableCell className="px-4 py-3">{routine[7]}</TableCell> {/* Part */}
                            <TableCell className="px-4 py-3">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    onClick={() => handleGenerateClick(routine)}
                                >
                                    Generate
                                </Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
              {/* Pagination and Rows Per Page Selector */}
            <div className="flex flex-col sm:flex-row items-center justify-between mt-6 mb-8 px-4">
                {/* Rows Per Page Selector - Left Side */}
                <div className="flex items-center space-x-2 mb-4 sm:mb-0">
                    <span className="text-sm text-muted-foreground">Rows per page:</span>
                    <Select
                        value={itemsPerPage === routines.length ? "All" : itemsPerPage.toString()}
                        onValueChange={handleRowsPerPageChange}
                    >
                        <SelectTrigger className="h-8 w-[80px]">
                            <SelectValue placeholder="10" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="10">10</SelectItem>
                            <SelectItem value="20">20</SelectItem>
                            <SelectItem value="50">50</SelectItem>
                            <SelectItem value="100">100</SelectItem>
                            <SelectItem value="All">All</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Pagination - Right Side */}
                {totalPages > 1 && (
                    <Pagination className="justify-end">
                        <PaginationContent className="bg-gray-50 rounded-md p-1">
                            <PaginationItem>
                                <PaginationPrevious
                                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                    disabled={currentPage === 1}
                                    className="mx-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100"
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
                                                className={`mx-1 h-9 w-9 p-0 flex items-center justify-center ${
                                                    currentPage === pageNum
                                                    ? "bg-blue-500 text-white hover:bg-blue-600"
                                                    : "text-gray-600 hover:bg-gray-100 hover:text-gray-800"
                                                }`}
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
                                    className="mx-1 text-gray-600 hover:text-gray-800 hover:bg-gray-100"
                                />
                            </PaginationItem>
                        </PaginationContent>
                    </Pagination>
                )}
            </div>
        </div>
    );
};

export default RoutineTable;
