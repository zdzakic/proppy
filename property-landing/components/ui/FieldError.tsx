/**
 * FieldError
 *
 * ZAŠTO:
 * - standardizuje prikaz grešaka za input polja
 * - uklanja duplikaciju UI-a
 */

type FieldErrorProps = {
  message?: string;
};

export default function FieldError({ message }: FieldErrorProps) {
  if (!message) return null;

  return (
    <p className="text-sm text-error mt-1">
      {message}
    </p>
  );
}