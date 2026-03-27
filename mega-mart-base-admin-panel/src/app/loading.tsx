const LoadingScreen = () => {
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="flex flex-col items-center">
        {/* Spinner */}
        <div className="w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        
        {/* Loading text */}
        <h2 className="mt-4 text-lg font-semibold text-gray-700 animate-pulse">
          Loading...
        </h2>
      </div>
    </div>
  );
};

export default LoadingScreen;
