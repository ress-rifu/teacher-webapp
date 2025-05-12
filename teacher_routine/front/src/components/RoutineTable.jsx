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
        <div className="space-y-6">
            <Table className="border rounded-lg overflow-hidden shadow-sm">
                <TableCaption className="mt-4 text-sm text-muted-foreground">Teacher routine schedule for ACS Future School</TableCaption>
                <TableHeader className="bg-secondary/50">
                    <TableRow>
                        <TableHead className="font-medium">Class Date</TableHead>
                        <TableHead className="font-medium">Time</TableHead>
                        <TableHead className="font-medium">Class</TableHead>
                        <TableHead className="font-medium">Subject</TableHead>
                        <TableHead className="font-medium">Teacher</TableHead>
                        <TableHead className="font-medium">Topic</TableHead>
                        <TableHead className="font-medium">Part</TableHead>
                        <TableHead className="font-medium">Action</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {currentItems.map((routine, index) => (
                        <TableRow key={index} className={index % 2 === 0 ? "bg-white" : "bg-secondary/20"}>
                            <TableCell className="font-medium">{routine[0]}</TableCell> {/* Class Date */}
                            <TableCell>{routine[1]}</TableCell> {/* Time */}
                            <TableCell>{routine[36]}</TableCell> {/* Class */}
                            <TableCell className="font-medium">{routine[5]}</TableCell> {/* Subject */}
                            <TableCell>{routine[10]}</TableCell> {/* Teacher */}
                            <TableCell className="max-w-[200px] truncate">{routine[6]}</TableCell> {/* Topic */}
                            <TableCell>{routine[7]}</TableCell> {/* Part */}
                            <TableCell>
                                <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="hover:bg-primary hover:text-white transition-colors"
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
                <Pagination className="justify-center">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationPrevious 
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                                disabled={currentPage === 1}
                                className={currentPage === 1 ? "opacity-50 cursor-not-allowed" : "hover:bg-secondary transition-colors"}
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
                                            className={currentPage === pageNum ? "bg-primary text-white" : "hover:bg-secondary transition-colors"}
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
                                className={currentPage === totalPages ? "opacity-50 cursor-not-allowed" : "hover:bg-secondary transition-colors"}
                            />
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
};

export default RoutineTable;
