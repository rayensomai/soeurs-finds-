export default function Logo({ className = 'h-16 w-auto sm:h-20' }) {
  return (
    <img
      src="/logo.png"
      alt="Soeurs Finds — Vos trouvailles, notre passion"
      className={`object-contain ${className}`}
    />
  );
}
