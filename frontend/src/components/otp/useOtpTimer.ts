import { useEffect, useState } from "react";

export const useOtpTimer = (seconds: number) => {
  const [time, setTime] = useState(seconds);

  useEffect(() => {
    if (time === 0) return;

    const interval = setInterval(() => {
      setTime((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [time]);

  const reset = () => setTime(seconds);

  return { time, reset };
};