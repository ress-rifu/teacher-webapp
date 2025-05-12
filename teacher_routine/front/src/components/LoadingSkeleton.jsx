// teacher-routine-frontend/src/components/LoadingSkeleton.jsx

import React from 'react';
import { Skeleton } from "@/components/ui/skeleton";

const LoadingSkeleton = () => (
    <div className="space-y-4">
        <div className="space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="space-y-2">
            <Skeleton className="h-4 w-2/3" />
            <Skeleton className="h-4 w-3/4" />
            <Skeleton className="h-4 w-1/2" />
        </div>
        <div className="space-y-2 mt-8">
            <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                    <Skeleton className="h-4 w-[250px]" />
                    <Skeleton className="h-4 w-[200px]" />
                </div>
            </div>
        </div>
    </div>
);

export default LoadingSkeleton;
