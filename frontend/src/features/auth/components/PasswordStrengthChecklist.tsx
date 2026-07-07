"use client";

interface PasswordStrengthChecklistProps {
  password: string;
}

export function PasswordStrengthChecklist({
  password,
}: PasswordStrengthChecklistProps) {
  const hasLength = password.length >= 8;
  const hasUpper = /[A-Z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSymbol = /[!@#$%^&*(),.?":{}|<>]/.test(password);

  const items = [
    { id: "length", label: "8+ characters", met: hasLength },
    { id: "upper", label: "Uppercase", met: hasUpper },
    { id: "number", label: "Number", met: hasNumber },
    { id: "symbol", label: "Symbol", met: hasSymbol },
  ];

  return (
    <div className="grid grid-cols-2 gap-y-sm gap-x-md mt-md border-t border-border-base pt-md">
      {items.map((item) => (
        <div
          key={item.id}
          className={`flex items-center gap-1.5 font-mono-label text-mono-label transition-colors px-sm ${
            item.met ? "text-[#16A34A]" : "text-text-muted"
          }`}
          id={`v-${item.id}`}
        >
          <span
            className="material-symbols-outlined !text-[14px]"
            style={{
              fontVariationSettings: `'FILL' ${item.met ? 1 : 0}`,
            }}
          >
            check_circle
          </span>
          <span>{item.label}</span>
        </div>
      ))}
    </div>
  );
}
