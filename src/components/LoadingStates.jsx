import React from 'react';
import { Loader2, Mic, Search, BarChart3 } from 'lucide-react';

// Skeleton loader for cards
export const SkeletonCard = ({ className = "" }) => (
  <div className={`bg-dark-card rounded-lg p-6 border border-dark-border animate-pulse ${className}`}>
    <div className="flex items-center space-x-3 mb-4">
      <div className="w-10 h-10 bg-dark-surface rounded-lg"></div>
      <div className="flex-1">
        <div className="h-4 bg-dark-surface rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-dark-surface rounded w-1/2"></div>
      </div>
    </div>
    <div className="space-y-2">
      <div className="h-3 bg-dark-surface rounded"></div>
      <div className="h-3 bg-dark-surface rounded w-5/6"></div>
    </div>
  </div>
);

// Skeleton loader for list items
export const SkeletonListItem = ({ className = "" }) => (
  <div className={`bg-dark-card rounded-lg p-4 border border-dark-border animate-pulse ${className}`}>
    <div className="flex items-center space-x-3">
      <div className="w-12 h-12 bg-dark-surface rounded-full"></div>
      <div className="flex-1">
        <div className="h-4 bg-dark-surface rounded w-3/4 mb-2"></div>
        <div className="h-3 bg-dark-surface rounded w-1/2"></div>
      </div>
      <div className="w-16 h-8 bg-dark-surface rounded"></div>
    </div>
  </div>
);

// Loading spinner with message
export const LoadingSpinner = ({ message = "Loading...", size = "md" }) => {
  const sizeClasses = {
    sm: "w-4 h-4",
    md: "w-6 h-6",
    lg: "w-8 h-8"
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className="relative">
        <Loader2 className={`${sizeClasses[size]} text-nature-forest animate-spin`} />
        <div className={`absolute inset-0 ${sizeClasses[size]} border-2 border-nature-forest/20 rounded-full animate-pulse`} />
      </div>
      <p className="text-slate-400 text-sm font-medium">{message}</p>
    </div>
  );
};

// Full page loading state
export const PageLoading = ({ title = "Loading", subtitle = "Please wait while we prepare your content" }) => (
  <div className="flex flex-col items-center justify-center min-h-screen p-8 space-y-6 animate-fade-in">
    <div className="relative">
      <div className="w-16 h-16 bg-nature-forest/20 rounded-full flex items-center justify-center">
        <Mic className="w-8 h-8 text-nature-forest animate-pulse" />
      </div>
      <div className="absolute inset-0 w-16 h-16 border-4 border-nature-forest/30 rounded-full animate-spin"></div>
    </div>
    <div className="text-center space-y-2">
      <h2 className="text-xl font-semibold text-white">{title}</h2>
      <p className="text-slate-400 max-w-md">{subtitle}</p>
    </div>
  </div>
);

// Dashboard loading state
export const DashboardLoading = () => (
  <div className="p-6 space-y-6 animate-fade-in">
    {/* Header skeleton */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <div className="h-8 bg-dark-surface rounded w-48"></div>
        <div className="h-4 bg-dark-surface rounded w-64"></div>
      </div>
      <div className="mt-4 sm:mt-0">
        <div className="h-10 bg-dark-surface rounded w-32"></div>
      </div>
    </div>

    {/* Stats cards skeleton */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(4)].map((_, i) => (
        <SkeletonCard key={i} />
      ))}
    </div>

    {/* Charts skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div className="bg-dark-card rounded-lg p-6 border border-dark-border animate-pulse">
        <div className="h-6 bg-dark-surface rounded w-1/3 mb-4"></div>
        <div className="h-64 bg-dark-surface rounded"></div>
      </div>
      <div className="bg-dark-card rounded-lg p-6 border border-dark-border animate-pulse">
        <div className="h-6 bg-dark-surface rounded w-1/3 mb-4"></div>
        <div className="h-64 bg-dark-surface rounded"></div>
      </div>
    </div>
  </div>
);

// Recordings loading state
export const RecordingsLoading = () => (
  <div className="p-6 space-y-6 animate-fade-in">
    {/* Header skeleton */}
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
      <div className="space-y-2">
        <div className="h-8 bg-dark-surface rounded w-48"></div>
        <div className="h-4 bg-dark-surface rounded w-64"></div>
      </div>
      <div className="mt-4 sm:mt-0 flex space-x-3">
        <div className="h-10 bg-dark-surface rounded w-24"></div>
        <div className="h-10 bg-dark-surface rounded w-24"></div>
      </div>
    </div>

    {/* Audio recorder skeleton */}
    <div className="bg-dark-card rounded-lg p-6 border border-dark-border animate-pulse">
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="h-12 bg-dark-surface rounded-xl flex-1"></div>
        <div className="h-12 bg-dark-surface rounded-xl flex-1"></div>
      </div>
    </div>

    {/* Recordings list skeleton */}
    <div className="space-y-4">
      {[...Array(5)].map((_, i) => (
        <SkeletonListItem key={i} />
      ))}
    </div>
  </div>
);

// Analysis loading state
export const AnalysisLoading = () => (
  <div className="p-6 space-y-6 animate-fade-in">
    <div className="text-center space-y-4">
      <div className="relative mx-auto w-20 h-20">
        <Search className="w-20 h-20 text-nature-forest animate-pulse" />
        <div className="absolute inset-0 w-20 h-20 border-4 border-nature-forest/30 rounded-full animate-spin"></div>
      </div>
      <div className="space-y-2">
        <div className="h-6 bg-dark-surface rounded w-48 mx-auto"></div>
        <div className="h-4 bg-dark-surface rounded w-64 mx-auto"></div>
      </div>
    </div>

    {/* Analysis results skeleton */}
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <SkeletonCard className="h-64" />
      <SkeletonCard className="h-64" />
    </div>
  </div>
);
