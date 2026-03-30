import { Loader2 } from "lucide-react";

const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      
      <div className="flex flex-col items-center gap-4">
        {/* Spinner */}
        <div className="flex items-center justify-center w-16 h-16 rounded-full bg-white shadow-md">
          <Loader2 className="w-8 h-8 text-gray-600 animate-spin" />
        </div>

        {/* Text */}
        <p className="text-gray-600 text-sm sm:text-base font-medium">
          Loading, please wait...
        </p>

      </div>
    </div>
  );
};

export default LoadingScreen;