export default function Logo({ className = 'h-14 w-auto sm:h-16' }) {
  return (
    <img
      src="/logo.png"
      alt="Soeurs Finds — Online Shopping"
      className={`object-contain ${className}`}
    />
  );
}
