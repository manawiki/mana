type ErrorFallbackProps = {
   error: Error;
   resetErrorBoundary: () => void;
};
export const ErrorFallback = ({
   error,
   resetErrorBoundary,
}: ErrorFallbackProps) => {
   return (
      <div role="alert">
         <p>Something went wrong:</p>
         <pre>{error.message}</pre>
         <button
            type="button"
            className="h-10 w-full  rounded border-2 !border-blue-500 !border-opacity-20 bg-blue-500 bg-opacity-10 text-center font-bold text-red-500 focus:outline-none dark:border-gray-700"
            onClick={resetErrorBoundary}
         >
            Try again
         </button>
      </div>
   );
};
