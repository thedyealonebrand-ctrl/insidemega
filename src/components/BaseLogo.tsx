const BaseLogo = ({ className = "" }: { className?: string }) => (
  <svg
    viewBox="0 0 111 111"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <circle cx="55.5" cy="55.5" r="55.5" fill="currentColor" />
    <path
      d="M55.3323 93.4C75.7 93.4 92.6323 77.6 92.6323 55.5C92.6323 33.4 75.7 17.6 55.3323 17.6C36.1323 17.6 19.7323 31.5 18.0323 50.2H66.0323V60.8H18.0323C19.7323 79.5 36.1323 93.4 55.3323 93.4Z"
      fill="hsl(var(--background))"
    />
  </svg>
);

export default BaseLogo;
