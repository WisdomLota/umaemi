export default function CornerDot({ className = "" }: { className?: string }) {
  return (
    <svg width="29" height="28" viewBox="0 0 29 28" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path fillRule="evenodd" clipRule="evenodd" d="M20.2793 11.7C15.9715 11.7 12.4793 15.1922 12.4793 19.5C12.4793 23.8078 15.9715 27.3 20.2793 27.3C24.5871 27.3 28.0793 23.8078 28.0793 19.5C28.0793 15.1922 24.5871 11.7 20.2793 11.7ZM1.5593 0C0.697733 0 -0.000703812 0.698435 -0.000703812 1.56V19.5C-0.000703812 8.73045 8.72975 0 19.4993 0C19.7605 0 20.0206 0.00543594 20.2793 0.0156155V0H1.5593Z" fill="currentColor"/>
    </svg>
  );
}