"use client";
import { useEffect, useRef, useState } from "react";
import jsPDF from "jspdf";

export default function Carousel({ quotes }: { quotes: string[] }) {
  const [currentSlide, setCurrentSlide] = useState(0);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [fontStyle, setFontStyle] = useState("Arial");
  const [colorTheme, setColorTheme] = useState("gradient");
  const [backgroundColor, setBackgroundColor] = useState("#1e293b"); // Default: Dark Blue


  const drawText = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number, maxWidth: number, lineHeight: number) => {
    const words = text.split(" ");
    let line = "";
    let yOffset = y;

    for (let i = 0; i < words.length; i++) {
      const testLine = line + words[i] + " ";
      const testWidth = ctx.measureText(testLine).width;

      if (testWidth > maxWidth && i > 0) {
        ctx.fillText(line, x, yOffset);
        line = words[i] + " ";
        yOffset += lineHeight;
      } else {
        line = testLine;
      }
    }
    ctx.fillText(line, x, yOffset);
  };


  useEffect(() => {
    if (quotes.length === 0) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    // Set canvas size based on screen width
    const canvasSize = window.innerWidth < 640 ? 300 : 800; // Smaller canvas for mobile
    canvas.width = canvasSize;
    canvas.height = canvasSize;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Apply background
    if (colorTheme === "gradient") {
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, "#4facfe"); // Blue
      gradient.addColorStop(1, "#00f2fe"); // Cyan
      ctx.fillStyle = gradient;
    } else {
      // Use a solid color or image background
      ctx.fillStyle = backgroundColor;
    }
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Set text properties
    ctx.fillStyle = "white";
    ctx.font = `24px ${fontStyle}`;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    // ctx.fillText(quotes[currentSlide], canvas.width / 2, canvas.height / 2);
    drawText(ctx, quotes[currentSlide], canvas.width / 2, canvas.height / 3, canvas.width * 0.8, 30);
  }, [quotes, currentSlide, fontStyle, colorTheme, backgroundColor]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % quotes.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + quotes.length) % quotes.length);
  };

  const downloadImage = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const link = document.createElement("a");
    link.href = canvas.toDataURL("image/png");
    link.download = `carousel-slide-${currentSlide + 1}.png`;
    link.click();
  };

  const splitTextIntoLines = (text: string, pdf: jsPDF, maxWidth: number) => {
    const words = text.split(" ");
    const lines: string[] = [];
    let line = "";

    words.forEach((word) => {
      const testLine = line + word + " ";
      const testWidth = pdf.getTextWidth(testLine);

      if (testWidth > maxWidth) {
        lines.push(line);
        line = word + " ";
      } else {
        line = testLine;
      }
    });

    lines.push(line);
    return lines;
  };



  const downloadPDF = () => {
    const pdf = new jsPDF();
    pdf.setFontSize(16);
    pdf.setFont(fontStyle);

    let yPosition = 30;
    const maxWidth = 180; // Limit text width
    const lineHeight = 10;

    quotes.forEach((quote) => {
      //before
      // pdf.text(quote, 20, 30 + i * 40);

      //after
      const wrappedLines = splitTextIntoLines(quote, pdf, maxWidth);
      wrappedLines.forEach((line) => {
        pdf.text(line, 15, yPosition);
        yPosition += lineHeight;
      });

      yPosition += 10; // Extra space between quotes
    });

    pdf.save("carousel.pdf");
  };

  return (
    <div className="flex flex-col items-center w-full">
      {/* Customization Options */}
      <div className="mt-4 flex flex-col sm:flex-row gap-4 bg-gray-100 p-4 rounded-lg m-4">
        {/* Font Style Dropdown */}
        <select
          value={fontStyle}
          onChange={(e) => setFontStyle(e.target.value)}
          className="p-2 border rounded bg-white text-gray-900"
        >
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
          <option value="Courier New">Courier New</option>
        </select>

        {/* Color Theme Dropdown */}
        <select
          value={colorTheme}
          onChange={(e) => setColorTheme(e.target.value)}
          className="p-2 border rounded bg-white text-gray-900"
        >
          <option value="gradient">Gradient</option>
          <option value="solid">Solid</option>
        </select>

        {/* Background Color Dropdown */}
        {colorTheme === "solid" && (
          <select
            value={backgroundColor}
            onChange={(e) => setBackgroundColor(e.target.value)}
            className="p-2 border rounded bg-white text-gray-900"
          >
            <option value="#4facfe">Blue</option>
            <option value="#00f2fe">Cyan</option>
            <option value="#1e293b">Dark Blue</option>
            <option value="#ffffff">White</option>
            <option value="#000000">Black</option>
            <option value="#ff0000">Red</option>
            <option value="#00ff00">Green</option>
            <option value="#0000ff">Blue</option>
          </select>
        )}
      </div>

      {/* Canvas and Navigation Buttons */}
      <div className="flex flex-row items-center gap-4 max-w-md sm:max-w-none overflow-x-hidden">
        {/* Previous Button */}
        <button
          onClick={prevSlide}
          className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 text-2xl"
        >
          &lt;
        </button>

        {/* Canvas */}
        <canvas
          ref={canvasRef}
          className="border shadow-lg w-[200px] h-[200px] sm:w-[800px] sm:h-[800px] max-w-full"
        />

        {/* Next Button */}
        <button
          onClick={nextSlide}
          className="px-4 py-2 bg-blue-500 text-white rounded-full hover:bg-blue-600 text-2xl"
        >
          &gt;
        </button>
      </div>

      {/* Download Buttons */}
      <div className="flex flex-col sm:flex-row gap-4 mt-4">
        <button
          onClick={downloadImage}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Download Image
        </button>
        <button
          onClick={downloadPDF}
          className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
        >
          Download PDF
        </button>
      </div>
    </div>
  );
}