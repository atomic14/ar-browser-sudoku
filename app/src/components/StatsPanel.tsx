import React from "react";

export default function StatsPanel({
  imageCaptureTime,
  thresholdTime,
  connectedComponentTime,
  getCornerPointsTime,
  extractImageTime,
  extractBoxesTime,
  ocrTime,
  solveTime,
}: {
  imageCaptureTime: number;
  thresholdTime: number;
  connectedComponentTime: number;
  getCornerPointsTime: number;
  extractImageTime: number;
  extractBoxesTime: number;
  ocrTime: number;
  solveTime: number;
}) {
  return (
    <div className="stats-panel">
      <div>
        <b>imageCaptureTime:</b> {Math.round(imageCaptureTime)}
      </div>
      <div>
        <b>thresholdTime:</b> {Math.round(thresholdTime)}
      </div>
      <div>
        <b>connectedComponentTime:</b> {Math.round(connectedComponentTime)}
      </div>
      <div>
        <b>getCornerPointsTime:</b> {Math.round(getCornerPointsTime)}
      </div>
      <div>
        <b>extractImageTime:</b> {Math.round(extractImageTime)}
      </div>
      <div>
        <b>extractBoxesTime:</b> {Math.round(extractBoxesTime)}
      </div>
      <div>
        <b>ocrTime:</b> {Math.round(ocrTime)}
      </div>
      <div>
        <b>solveTime:</b> {Math.round(solveTime)}
      </div>
    </div>
  );
}
