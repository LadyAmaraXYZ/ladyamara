import { cn } from "@/lib/utils";
import { CatId, CAT_TONE } from "@/lib/amara/engine";

const TONE_CLASS: Record<string, string> = {
  mom: "text-mom",
  splash: "text-splash",
  ivy: "text-ivy",
  moony: "text-moony",
};

const BODY =
  "M340 25c-24 10-21 53-49 50-23-6-46-5-68 1-23-6-17-47-42-47-12 16-10 38-17 56-7 33-20 69-5 102 5 19 26 30 30 47-5 23-25 39-31 62-10 22-17 45-24 68-28-13-51-41-48-73-4-23 27-35 24-58-20-16-47 15-55 34-19 51 10 111 56 137 21 8 26 31 34 49 15 20 43 22 66 20 44-2 90 3 134-3 32-12 42-51 38-81-4-57-27-109-54-158 18-20 39-41 40-70 3-42-15-81-21-122-2-5-4-10-8-14Z";
const WHISKERS =
  "m378 157 64-14 1 6-63 14zM378 170l67 3v5l-67-3zM145 157l-64-13-2 4 65 14zM144 170l-66 3v5l66-3z";

export function CatSvg({
  catId,
  className,
}: {
  catId?: CatId;
  className?: string;
}) {
  const tone = catId !== undefined ? CAT_TONE[catId] : "mom";
  return (
    <svg
      viewBox="0 0 500 500"
      className={cn("amara-cat h-full w-full", TONE_CLASS[tone], className)}
      aria-hidden
    >
      <path fill="#070907" d={BODY} />
      <path fill="#070907" d={WHISKERS} />
      <ellipse className="eye-lid" cx="312" cy="145" fill="currentColor" rx="28" ry="22" />
      <ellipse cx="312" cy="145.1" fill="var(--color-night)" rx="7" ry="19" />
      <ellipse className="eye-lid" cx="216" cy="145" fill="currentColor" rx="28" ry="22" />
      <ellipse cx="216" cy="145.1" fill="var(--color-night)" rx="7" ry="19" />
    </svg>
  );
}

export function FamilyMark({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "relative mx-auto aspect-square w-full max-w-md overflow-hidden rounded-lg border-4 border-moss bg-moss",
        className,
      )}
    >
      <div className="pointer-events-none absolute inset-0 grid grid-cols-3 grid-rows-3 gap-px opacity-50">
        {Array.from({ length: 9 }, (_, i) => (
          <div key={i} className="bg-grove/35" />
        ))}
      </div>
      <div className="absolute inset-[10%] z-10">
        <CatSvg catId={0} />
      </div>
      <div className="absolute bottom-[4%] left-[2%] z-20 w-[44%]">
        <CatSvg catId={1} />
      </div>
      <div className="absolute bottom-[0%] left-[28%] z-30 w-[46%]">
        <CatSvg catId={2} />
      </div>
      <div className="absolute right-[0%] bottom-[6%] z-20 w-[42%]">
        <CatSvg catId={3} />
      </div>
    </div>
  );
}