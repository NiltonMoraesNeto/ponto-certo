function LoadingSpin() {
  return (
    <div className="w-full">
      <div className="flex justify-center">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-purple-500 motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        ></div>
      </div>
    </div>
  );
}

export default LoadingSpin;
