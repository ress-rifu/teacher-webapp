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
    const currentItems = routines.slice(indexOfFirstItem, indexOfLastItem);

    return (
        <div className="space-y-4">
            <Table>
                <TableCaption>Teacher routine schedule</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead>Class Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Class</TableHead>
                        <TableHead>Subject</TableHead>
                        <TableHead>Teacher</TableHead>
                        <TableHead>Topic</TableHead>
                        <TableHead>Part</TableHead>
                        <TableHead>Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentItems.map((routine, index) => (
                        <TableRow key={index}>
                            <TableCell>{routine[0]}</TableCell> {/* Class Date */}
                            <TableCell>{routine[1]}</TableCell> {/* Time */}
                            <TableCell>{routine[36]}</TableCell> {/* Class */}
                            <TableCell>{routine[5]}</TableCell> {/* Subject */}
                            <TableCell>{routine[10]}</TableCell> {/* Teacher */}
                            <TableCell>{routine[6]}</TableCell> {/* Topic */}
                            <TableCell>{routine[7]}</TableCell> {/* Part */}
                            <TableCell>
                                <Button 
                                    variant="default" 
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
            
            {/* Pagination */}
            {totalPages > 1 && (
                <Pagination>
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
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
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
};

export default RoutineTable;
