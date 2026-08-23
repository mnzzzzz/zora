"use client";

import {
  useEffect,
  useRef,
  useState,
} from "react";

export type AnnotationType =
  | "pen"
  | "highlight"
  | "note";

export type Point = {
  x: number;
  y: number;
};

export type Annotation = {
  id: string;
  type: AnnotationType;
  page: number;

  points?: Point[];

  x?: number;
  y?: number;

  width?: number;
  height?: number;

  text?: string;

  color: string;
};

type Props = {
  page: number;
  width: number;
  height: number;
  tool: AnnotationType | "select" | "eraser";
  color: string;
  annotations: Annotation[];
  onChange: (annotations: Annotation[]) => void;
};

export default function PdfAnnotationLayer({
  page,
  width,
  height,
  tool,
  color,
  annotations,
  onChange,
}: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);

  const [drawing, setDrawing] = useState(false);
  const [currentPoints, setCurrentPoints] = useState<Point[]>([]);

  const pageAnnotations = annotations.filter(
    (annotation) => annotation.page === page
  );

  const getPoint = (
    event: React.PointerEvent<SVGSVGElement>
  ): Point => {
    const rect = svgRef.current?.getBoundingClientRect();

    if (!rect) {
      return { x: 0, y: 0 };
    }

    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  };

  const handlePointerDown = (
    event: React.PointerEvent<SVGSVGElement>
  ) => {
    if (tool === "select") return;

    const point = getPoint(event);

    if (tool === "eraser") {
      const radius = 25;

      const remaining = annotations.filter((annotation) => {
        if (annotation.page !== page) return true;

        if (annotation.points) {
          return !annotation.points.some(
            (p) =>
              Math.abs(p.x - point.x) < radius &&
              Math.abs(p.y - point.y) < radius
          );
        }

        if (
          annotation.x !== undefined &&
          annotation.y !== undefined
        ) {
          return (
            Math.abs(annotation.x - point.x) > radius ||
            Math.abs(annotation.y - point.y) > radius
          );
        }

        return true;
      });

      onChange(remaining);
      return;
    }

    if (tool === "note") {
      const text = window.prompt("Enter your note:");

      if (!text?.trim()) return;

      const note: Annotation = {
        id: crypto.randomUUID(),
        type: "note",
        page,
        x: point.x,
        y: point.y,
        text: text.trim(),
        color,
      };

      onChange([...annotations, note]);
      return;
    }

    setDrawing(true);
    setCurrentPoints([point]);
  };

  const handlePointerMove = (
    event: React.PointerEvent<SVGSVGElement>
  ) => {
    if (!drawing) return;

    const point = getPoint(event);

    setCurrentPoints((current) => [
      ...current,
      point,
    ]);
  };

  const finishDrawing = () => {
    if (!drawing || currentPoints.length < 2) {
      setDrawing(false);
      setCurrentPoints([]);
      return;
    }

    const annotation: Annotation = {
      id: crypto.randomUUID(),
      type: tool === "highlight" ? "highlight" : "pen",
      page,
      points: currentPoints,
      color,
    };

    onChange([...annotations, annotation]);

    setDrawing(false);
    setCurrentPoints([]);
  };

  const pointsToString = (points: Point[]) =>
    points
      .map((point) => `${point.x},${point.y}`)
      .join(" ");

  return (
    <svg
      ref={svgRef}
      width={width}
      height={height}
      className="absolute inset-0 touch-none"
      style={{
        cursor:
          tool === "select"
            ? "default"
            : tool === "eraser"
            ? "crosshair"
            : "crosshair",
      }}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={finishDrawing}
      onPointerLeave={finishDrawing}
    >
      {pageAnnotations.map((annotation) => {
        if (
          annotation.type === "pen" &&
          annotation.points
        ) {
          return (
            <polyline
              key={annotation.id}
              points={pointsToString(annotation.points)}
              fill="none"
              stroke={annotation.color}
              strokeWidth={3}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.9}
            />
          );
        }

        if (
          annotation.type === "highlight" &&
          annotation.points
        ) {
          return (
            <polyline
              key={annotation.id}
              points={pointsToString(annotation.points)}
              fill="none"
              stroke={annotation.color}
              strokeWidth={18}
              strokeLinecap="round"
              strokeLinejoin="round"
              opacity={0.35}
            />
          );
        }

        if (
          annotation.type === "note" &&
          annotation.x !== undefined &&
          annotation.y !== undefined
        ) {
          return (
            <g key={annotation.id}>
              <circle
                cx={annotation.x}
                cy={annotation.y}
                r={12}
                fill={annotation.color}
                opacity={0.95}
              />

              <text
                x={annotation.x}
                y={annotation.y + 4}
                textAnchor="middle"
                fontSize="12"
                fill="white"
                fontWeight="bold"
              >
                N
              </text>
            </g>
          );
        }

        return null;
      })}

      {drawing && currentPoints.length > 1 && (
        <polyline
          points={pointsToString(currentPoints)}
          fill="none"
          stroke={color}
          strokeWidth={
            tool === "highlight" ? 18 : 3
          }
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={
            tool === "highlight" ? 0.35 : 0.9
          }
        />
      )}
    </svg>
  );
}