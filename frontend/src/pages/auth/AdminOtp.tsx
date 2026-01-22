import React, { useState, useRef, useEffect } from 'react';
import { ShieldCheck, Loader2 } from 'lucide-react';

/* =======================
   OTP INPUT (INLINE)
======================= */
interface OTPInputProps {
  length: number;
  values: string[];
  onChange: (values: string[]) => void;
  disabled?: boolean;
}

const OTPInput: React.FC<OTPInputProps> = ({ length, values, onChange, disabled }) => {
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    const firstEmpty = values.findIndex(v => v === '');
    if (firstEmpty !== -1 && inputsRef.current[firstEmpty]) {
      inputsRef.current[firstEmpty]?.focus();
    }
  }, []);

  const handleChange = (index: number, value: string) => {
    const sanitizedValue = value.replace(/[^0-9]/g, '').slice(-1);
    const newValues = [...values];
    newValues[index] = sanitizedValue;
    onChange(newValues);

    if (sanitizedValue !== '' && index < length - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      const newValues = [...values];
      if (values[index] === '' && index > 0) {
        newValues[index - 1] = '';
        onChange(newValues);
        inputsRef.current[index - 1]?.focus();
      } else {
        newValues[index] = '';
        onChange(newValues);
      }
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pasteData = e.clipboardData.getData('text').slice(0, length).replace(/[^0-9]/g, '');
    const newValues = [...values];
    pasteData.split('').forEach((char, i) => {
      newValues[i] = char;
    });
    onChange(newValues);
    const nextIndex = Math.min(pasteData.length, length - 1);
    inputsRef.current[nextIndex]?.focus();
  };

  return (
    <div className="flex justify-between gap-2 md:gap-3 w-full">
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { inputsRef.current[i] = el; }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={values[i]}
          disabled={disabled}
          onChange={(e) => handleChange(i, e.target.value)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          placeholder="0"
          className="w-full aspect-[4/5] bg-zinc-900 border border-zinc-800 text-center text-xl md:text-2xl font-light focus:outline-none focus:border-zinc-500 focus:ring-1 focus:ring-zinc-500 transition-all duration-200 text-white placeholder:text-zinc-800 rounded-sm"
        />
      ))}
    </div>
  );
};

/* =======================
   OTP VERIFICATION PAGE
======================= */
const OTPVerification: React.FC = () => {
  const [otp, setOtp] = useState<string[]>(new Array(6).fill(''));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [timer, setTimer] = useState(0);

  const handleVerify = () => {
    const code = otp.join('');
    if (code.length < 6) {
      setError('Please enter the full 6-digit verification code.');
      return;
    }

    setLoading(true);
    setError(null);

    setTimeout(() => {
      setLoading(false);
      if (code === '000000') {
        setError('Verification failed. Invalid or expired administrative token.');
      } else {
        alert('Access Granted. Redirecting to Admin Console...');
      }
    }, 1500);
  };

  const handleResend = () => {
    if (timer > 0) return;
    setTimer(60);
  };

  useEffect(() => {
    let interval: any;
    if (timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    }
    return () => clearInterval(interval);
  }, [timer]);

  return (
    <div className="w-full max-w-md bg-[#111111] text-white shadow-2xl rounded-sm p-8 md:p-12 flex flex-col items-center">
      <div className="text-center mb-10 w-full">
        <span className="block text-[10px] uppercase tracking-[0.4em] text-zinc-500 mb-2">
          Admin Security Verification
        </span>
        <h1 className="text-2xl font-light tracking-tighter">Spenzee</h1>
      </div>

      <div className="w-full mb-8">
        <h2 className="text-xl font-medium mb-3">Verify Access</h2>
        <p className="text-sm text-zinc-400">
          Enter the one-time verification code sent to your registered admin email.
        </p>
      </div>

      <div className="w-full mb-8">
        <OTPInput length={6} values={otp} onChange={setOtp} disabled={loading} />
        {error && (
          <p className="mt-4 text-xs text-red-400 flex items-center justify-center bg-red-900/10 py-2 border border-red-900/20">
            <ShieldCheck className="w-3 h-3 mr-2" />
            {error}
          </p>
        )}
      </div>

      <button
        onClick={handleVerify}
        disabled={loading}
        className="w-full bg-white text-black py-4 text-sm hover:bg-zinc-200 transition-all disabled:opacity-50 rounded-sm flex items-center justify-center"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
            Verifying Token...
          </>
        ) : (
          'Verify & Continue'
        )}
      </button>

      <div className="mt-8 text-center w-full">
        <button
          onClick={handleResend}
          disabled={timer > 0 || loading}
          className={`text-xs underline ${
            timer > 0 ? 'text-zinc-600' : 'text-zinc-400 hover:text-white'
          }`}
        >
          {timer > 0 ? `Resend available in ${timer}s` : 'Resend Code'}
        </button>

        <p className="mt-12 text-[10px] uppercase tracking-widest text-zinc-600">
          This action is logged for security purposes.
        </p>
      </div>
    </div>
  );
};

export default OTPVerification;
