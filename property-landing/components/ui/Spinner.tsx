"use client";

/**
 * Simple dashboard spinner
 * radi u light i dark temi
 */

export default function Spinner() {
  return (
    <div className="h-8 w-8 animate-spin rounded-full border-2 border-gray-300 border-t-black dark:border-gray-700 dark:border-t-white" />
  );
}