'use client';

import React from 'react';

export function SkeletonShimmer({ className = '' }: { className?: string }) {
  return (
    <div className={`shimmer-bg rounded-lg ${className}`} />
  );
}

export default function SkeletonLoader() {
  return (
    <div className="w-full space-y-16 animate-pulse duration-1000">
      {/* Title & Description Skeleton */}
      <div className="max-w-3xl space-y-4">
        {/* Category Badge */}
        <SkeletonShimmer className="h-5 w-24 rounded-full" />
        {/* Title */}
        <SkeletonShimmer className="h-10 sm:h-12 w-2/3" />
        {/* Description */}
        <div className="space-y-2">
          <SkeletonShimmer className="h-4 w-full" />
          <SkeletonShimmer className="h-4 w-5/6" />
        </div>
      </div>

      {/* Trust Badges Skeleton */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 p-5 rounded-2xl border border-border bg-card">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <SkeletonShimmer className="h-10 w-10 shrink-0 rounded-xl" />
            <div className="space-y-1.5 flex-1">
              <SkeletonShimmer className="h-3 w-3/4" />
              <SkeletonShimmer className="h-2 w-1/2" />
            </div>
          </div>
        ))}
      </div>

      {/* Calculator Body Skeleton */}
      <div className="rounded-3xl border border-border bg-card p-6 md:p-8 shadow-premium-md space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8">
          {/* Inputs Section */}
          <div className="md:col-span-7 space-y-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="space-y-2">
                <div className="flex justify-between">
                  <SkeletonShimmer className="h-4 w-1/4" />
                  <SkeletonShimmer className="h-4 w-1/12" />
                </div>
                <SkeletonShimmer className="h-11 w-full rounded-xl" />
                <SkeletonShimmer className="h-2 w-full rounded-full" />
              </div>
            ))}
            <div className="flex gap-4 pt-4">
              <SkeletonShimmer className="h-11 flex-1 rounded-xl" />
              <SkeletonShimmer className="h-11 flex-1 rounded-xl" />
            </div>
          </div>

          {/* Results/Chart Section */}
          <div className="md:col-span-5 bg-secondary/40 border border-border rounded-2xl p-6 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              <SkeletonShimmer className="h-4 w-1/3" />
              <SkeletonShimmer className="h-8 w-1/2" />
            </div>
            {/* Visual indicator (like a chart circle or bar) */}
            <div className="flex justify-center items-center py-6">
              <SkeletonShimmer className="h-36 w-36 rounded-full" />
            </div>
            <div className="space-y-3">
              <SkeletonShimmer className="h-4 w-full" />
              <SkeletonShimmer className="h-4 w-5/6" />
            </div>
          </div>
        </div>
      </div>

      {/* FAQs Skeleton */}
      <div className="border-t border-border/60 pt-12 space-y-6">
        <div className="space-y-2">
          <SkeletonShimmer className="h-8 w-1/3" />
          <SkeletonShimmer className="h-4 w-1/2" />
        </div>
        <div className="space-y-4">
          {[...Array(3)].map((_, i) => (
            <SkeletonShimmer key={i} className="h-16 w-full rounded-xl" />
          ))}
        </div>
      </div>

      {/* Related Tools Skeleton */}
      <div className="border-t border-border/60 pt-12 space-y-6">
        <SkeletonShimmer className="h-6 w-28" />
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border border-border bg-card p-5 rounded-2xl space-y-4">
              <SkeletonShimmer className="h-9 w-9 rounded-xl" />
              <div className="space-y-2">
                <SkeletonShimmer className="h-5 w-3/4" />
                <SkeletonShimmer className="h-3 w-full" />
                <SkeletonShimmer className="h-3 w-5/6" />
              </div>
              <SkeletonShimmer className="h-4 w-1/3 pt-2" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
