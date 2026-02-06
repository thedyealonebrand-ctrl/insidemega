import { useState, useEffect } from "react";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

const CountdownTimer = () => {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    // Calculate next Saturday
    const getNextSaturday = () => {
      const now = new Date();
      const dayOfWeek = now.getDay();
      const daysUntilSaturday = (6 - dayOfWeek + 7) % 7 || 7;
      const nextSaturday = new Date(now);
      nextSaturday.setDate(now.getDate() + daysUntilSaturday);
      nextSaturday.setHours(20, 0, 0, 0); // 8 PM
      return nextSaturday;
    };

    const targetDate = getNextSaturday();

    const calculateTimeLeft = () => {
      const difference = targetDate.getTime() - new Date().getTime();

      if (difference > 0) {
        return {
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
          minutes: Math.floor((difference / 1000 / 60) % 60),
          seconds: Math.floor((difference / 1000) % 60),
        };
      }

      return { days: 0, hours: 0, minutes: 0, seconds: 0 };
    };

    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      setTimeLeft(calculateTimeLeft());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const TimeBlock = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="w-20 h-24 sm:w-28 sm:h-32 bg-secondary/50 backdrop-blur-sm rounded-lg border border-primary/20 flex items-center justify-center box-glow">
          <span className="font-display text-4xl sm:text-6xl text-primary text-glow">
            {value.toString().padStart(2, "0")}
          </span>
        </div>
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent rounded-lg pointer-events-none" />
      </div>
      <span className="mt-3 text-xs sm:text-sm font-body uppercase tracking-[0.3em] text-muted-foreground">
        {label}
      </span>
    </div>
  );

  return (
    <div className="flex gap-3 sm:gap-6">
      <TimeBlock value={timeLeft.days} label="Days" />
      <TimeBlock value={timeLeft.hours} label="Hours" />
      <TimeBlock value={timeLeft.minutes} label="Min" />
      <TimeBlock value={timeLeft.seconds} label="Sec" />
    </div>
  );
};

export default CountdownTimer;
