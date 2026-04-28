"use client";

type Props = {
  solvedDates: string[];
};

export default function StreakHeatmap({ solvedDates }: Props) {
  const today = new Date();

  // 🔥 last 365 days (today included)
  const days = [];

  for (let i = 364; i >= 0; i--) {
    const d = new Date();
    d.setDate(today.getDate() - i);
    days.push(new Date(d));
  }

  const solvedSet = new Set(solvedDates);

  const getColor = (date: Date) => {
    const d = date.toISOString().slice(0, 10);

    if (!solvedSet.has(d)) return "bg-[#1f1f1f]";

    return "bg-green-500";
  };

  return (
    <div className="overflow-hidden">
       <p className="font-bold p-2 bg-linear-to-r from-green-400 via-green-300 to-green-400 bg-size-[200%_100%] bg-clip-text text-transparent animate-[shimmer_2s_linear_infinite]">
  Submissions in the past one year
</p>
      <div className="grid grid-flow-col grid-rows-7 gap-1">
        {days.map((date, i) => (
          <div
            key={i}
            title={date.toDateString()}
            className={`w-3 h-3 rounded-sm cursor-pointer ${getColor(date)} hover:scale-125 transition`}
          />
        ))}
      </div>
    </div>
  );
}