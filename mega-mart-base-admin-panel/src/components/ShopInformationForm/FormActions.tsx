/* eslint-disable @typescript-eslint/no-explicit-any */
'use client';

import { Loader2 } from "lucide-react";

export default function FormActions({
  onSubmit,
  onCancel,
  isLoading,
  clicks,
}: {
  onSubmit: () => void;
  onCancel: () => void;
  isLoading: boolean;
  clicks: string;
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:justify-end gap-3 pt-4 pb-6">
      
  
      {/* Submit Button */}
      <button
        onClick={onSubmit}
        disabled={isLoading}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium 
        bg-gray-900 text-white hover:bg-gray-800 
        h-10 px-6 transition-all disabled:opacity-50"
      >
        {isLoading && <Loader2 className="w-4 h-4 animate-spin" />}

        {isLoading
          ? clicks === 'Update Shop'
            ? 'Updating Shop...'
            : 'Creating Shop...'
          : clicks}
      </button>
          {/* Cancel Button */}
      <button
        onClick={onCancel}
        disabled={isLoading}
        className="w-full sm:w-auto inline-flex items-center justify-center rounded-md text-sm font-medium 
        border border-gray-300 text-gray-700 bg-white hover:bg-gray-100
        h-10 px-6 transition-all disabled:opacity-50"
      >
        Cancel
      </button>

    </div>
  );
}