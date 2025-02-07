"use client";
import { useEffect, useRef } from "react";
import jsPDF from "jspdf";

export default function Carousel({ quotes }: { quotes: string[] }) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null); // Explicitly allow null

  useEffect(() => {
    if (quotes.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Explicitly set canvas size
    canvas.width = 800;
    canvas.height = 800;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Create a gradient background
    const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
    gradient.addColorStop(0, "#4facfe"); // Blue
    gradient.addColorStop(1, "#00f2fe"); // Cyan

    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set text properties
    ctx.fillStyle = "white";
    ctx.font = "24px Arial";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle"; // Center vertically
    ctx.fillText(quotes[0], canvas.width / 2, canvas.height / 2);
  }, [quotes]);

  return (
    <div className="flex flex-col items-center">
      <canvas ref={canvasRef} className="border" />

      <button
        onClick={() => downloadImage(canvasRef)}
        className="mt-4 px-4 py-2 bg-green-500 text-white rounded"
      >
        Download Image
      </button>

      <button
        onClick={() => downloadPDF(quotes)}
        className="mt-4 px-4 py-2 bg-red-500 text-white rounded"
      >
        Download PDF
      </button>
    </div>
  );
}

const downloadImage = (canvasRef: React.RefObject<HTMLCanvasElement | null>) => {
  const canvas = canvasRef.current;
  if (!canvas) return; // Ensure canvas is not null

  const link = document.createElement("a");
  link.href = canvas.toDataURL("image/png");
  link.download = "carousel-slide.png";
  link.click();
};

const downloadPDF = (quotes: string[]) => {
  const pdf = new jsPDF();

  quotes.forEach((quote, i) => {
    pdf.text(String(quote), 20, 30 + i * 40);
  });


  pdf.save("carousel.pdf");
};
