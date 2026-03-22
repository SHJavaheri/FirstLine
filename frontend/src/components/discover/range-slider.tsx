"use client";

import { useState, useEffect } from "react";

type RangeSliderProps = {
  min: number;
  max: number;
  step: number;
  minValue: number;
  maxValue: number;
  onChange: (min: number, max: number) => void;
  formatValue?: (value: number) => string;
};

export function RangeSlider({
  min,
  max,
  step,
  minValue,
  maxValue,
  onChange,
  formatValue = (v) => v.toString(),
}: RangeSliderProps) {
  const [localMin, setLocalMin] = useState(minValue);
  const [localMax, setLocalMax] = useState(maxValue);

  useEffect(() => {
    setLocalMin(minValue);
    setLocalMax(maxValue);
  }, [minValue, maxValue]);

  function handleMinChange(value: number) {
    const newMin = Math.min(value, localMax - step);
    setLocalMin(newMin);
    onChange(newMin, localMax);
  }

  function handleMaxChange(value: number) {
    const newMax = Math.max(value, localMin + step);
    setLocalMax(newMax);
    onChange(localMin, newMax);
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center gap-3">
        <input
          type="number"
          value={localMin}
          onChange={(e) => handleMinChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          className="w-24 rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
        <span className="text-slate-500">to</span>
        <input
          type="number"
          value={localMax}
          onChange={(e) => handleMaxChange(Number(e.target.value))}
          min={min}
          max={max}
          step={step}
          className="w-24 rounded-md border border-slate-300 px-3 py-1.5 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
        />
      </div>
      <div className="relative pt-1">
        <div className="relative h-2 rounded-full bg-slate-200">
          <div
            className="absolute h-2 rounded-full bg-blue-500"
            style={{
              left: `${((localMin - min) / (max - min)) * 100}%`,
              right: `${100 - ((localMax - min) / (max - min)) * 100}%`,
            }}
          />
        </div>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localMin}
          onChange={(e) => handleMinChange(Number(e.target.value))}
          className="absolute top-0 h-2 w-full cursor-pointer appearance-none bg-transparent"
          style={{ pointerEvents: "none" }}
        />
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={localMax}
          onChange={(e) => handleMaxChange(Number(e.target.value))}
          className="absolute top-0 h-2 w-full cursor-pointer appearance-none bg-transparent"
          style={{ pointerEvents: "none" }}
        />
      </div>
      <div className="flex justify-between text-xs text-slate-600">
        <span>{formatValue(localMin)}</span>
        <span>{formatValue(localMax)}</span>
      </div>
    </div>
  );
}
