import React, { useState } from 'react';
import { Card, Button } from '../../components/ui/Common';

interface OTPProps {
  type: 'signup' | 'forgot-password';
}

const OTP: React.FC<OTPProps> = ({ type }) => {
  const [otp, setOtp] = useState(['', '', '', '']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    window.location.hash =
      type === 'signup' ? '#/login' : '#/reset-password';
  };

  return (
    <div className="min-h-screen w-full bg-[#F6F5F3] flex items-center justify-center px-6">
      <div className="w-full max-w-md">
        {/* Brand */}
        <div className="text-center mb-10">
          <a href="#/" className="text-3xl font-serif text-[#1A1A1A] font-medium">
            Spenzee
          </a>
        </div>

        {/* Card */}
        <Card className="text-center">
          <h1 className="text-2xl font-serif text-white mb-4">
            Verify code
          </h1>
          <p className="text-sm text-gray-400 mb-10">
            Enter the 4-digit code sent to your email.
          </p>

          <form onSubmit={handleSubmit}>
            <div className="flex justify-center gap-4 mb-10">
              {otp.map((_, i) => (
                <input
                  key={i}
                  maxLength={1}
                  className="
                    w-14 h-16
                    bg-[#1a1a1a]
                    border border-white/10
                    rounded-md
                    text-center
                    text-xl
                    text-white
                    focus:outline-none
                    focus:border-white/40
                  "
                />
              ))}
            </div>

            <Button>Verify</Button>
          </form>

          <div className="mt-8">
            <button
              type="button"
              className="text-xs text-gray-400 hover:text-white transition"
            >
              Didn’t receive a code? <span className="underline">Resend</span>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
};

export default OTP;
