import React, { useState, useRef, useEffect } from 'react';
import {
  Scan,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sun,
  Contrast,
  Sliders,
  Ruler,
  Maximize2,
  FileText,
  UserCheck,
  CheckCircle2,
  Building2,
  Move,
} from 'lucide-react';
import { RadiologyStudy } from '../types/index.ts';
import { calculateCaliperDistance } from '../utils/healthLogic.ts';

interface RadiologyWorkstationProps {
  studies: RadiologyStudy[];
}

export const RadiologyWorkstation: React.FC<RadiologyWorkstationProps> = ({ studies }) => {
  const [selectedStudyIndex, setSelectedStudyIndex] = useState(0);
  const currentStudy = studies[selectedStudyIndex] || studies[0];

  // Windowing & Display Controls
  const [brightness, setBrightness] = useState<number>(0); // -100 to +100
  const [contrast, setContrast] = useState<number>(1.2); // 0.5 to 2.5
  const [isInverted, setIsInverted] = useState<boolean>(false);
  const [zoom, setZoom] = useState<number>(1.0); // 1.0x to 4.0x
  const [activeTool, setActiveTool] = useState<'pan' | 'caliper'>('caliper');

  // Caliper Points (Canvas relative coordinates)
  const [caliperStart, setCaliperStart] = useState<{ x: number; y: number } | null>({ x: 260, y: 320 });
  const [caliperEnd, setCaliperEnd] = useState<{ x: number; y: number } | null>({ x: 420, y: 320 });
  const [isDrawingCaliper, setIsDrawingCaliper] = useState(false);

  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  // Reset controls
  const handleReset = () => {
    setBrightness(0);
    setContrast(1.2);
    setIsInverted(false);
    setZoom(1.0);
    setCaliperStart({ x: 260, y: 320 });
    setCaliperEnd({ x: 420, y: 320 });
  };

  // Measure mm
  const measuredDistanceMm =
    caliperStart && caliperEnd
      ? calculateCaliperDistance(caliperStart, caliperEnd, 0.3)
      : null;

  // Redraw canvas whenever controls, preset, or caliper change
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear canvas
    ctx.clearRect(0, 0, width, height);
    ctx.save();

    // Background base
    ctx.fillStyle = isInverted ? '#f1f5f9' : '#05070d';
    ctx.fillRect(0, 0, width, height);

    // Apply Zoom from center
    ctx.translate(width / 2, height / 2);
    ctx.scale(zoom, zoom);
    ctx.translate(-width / 2, -height / 2);

    // Apply brightness and contrast filter
    const brightFactor = (brightness + 100) / 100; // 0 to 2
    ctx.filter = `contrast(${contrast}) brightness(${brightFactor}) ${isInverted ? 'invert(1)' : 'invert(0)'}`;

    // Render Anatomical Radiograph Preset
    if (currentStudy.canvasPreset === 'chest-xray') {
      renderChestXray(ctx, width, height);
    } else if (currentStudy.canvasPreset === 'brain-mri') {
      renderBrainMRI(ctx, width, height);
    } else {
      renderKneeXray(ctx, width, height);
    }

    ctx.restore();

    // Draw Caliper Overlay (unaffected by contrast filters for maximum clinical legibility)
    if (caliperStart && caliperEnd) {
      drawCaliperOverlay(ctx, caliperStart, caliperEnd, measuredDistanceMm, zoom, width, height);
    }
  }, [selectedStudyIndex, brightness, contrast, isInverted, zoom, caliperStart, caliperEnd, measuredDistanceMm]);

  // Anatomy Generators for Canvas Radiographs
  const renderChestXray = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const cx = w / 2;
    const cy = h / 2;

    // Thoracic cage glow / soft tissues
    const grad = ctx.createRadialGradient(cx, cy, 50, cx, cy, 320);
    grad.addColorStop(0, '#2d3748');
    grad.addColorStop(0.5, '#1a202c');
    grad.addColorStop(1, '#080c14');
    ctx.fillStyle = grad;
    ctx.fillRect(cx - 280, cy - 280, 560, 560);

    // Lung fields (radiolucent = darker air)
    ctx.fillStyle = '#0f141d';
    // Left lung field
    ctx.beginPath();
    ctx.ellipse(cx - 100, cy - 20, 85, 170, -0.05, 0, Math.PI * 2);
    ctx.fill();

    // Right lung field
    ctx.beginPath();
    ctx.ellipse(cx + 100, cy - 20, 85, 170, 0.05, 0, Math.PI * 2);
    ctx.fill();

    // Mediastinum & Spine (radiopaque = lighter white/gray)
    ctx.fillStyle = '#e2e8f0';
    ctx.shadowColor = '#cbd5e1';
    ctx.shadowBlur = 15;

    // Spine column
    ctx.beginPath();
    ctx.rect(cx - 16, cy - 260, 32, 500);
    ctx.fillStyle = '#94a3b8';
    ctx.fill();

    // Clavicles
    ctx.strokeStyle = '#e2e8f0';
    ctx.lineWidth = 14;
    ctx.beginPath();
    ctx.moveTo(cx - 200, cy - 190);
    ctx.quadraticCurveTo(cx - 100, cy - 210, cx - 20, cy - 180);
    ctx.moveTo(cx + 200, cy - 190);
    ctx.quadraticCurveTo(cx + 100, cy - 210, cx + 20, cy - 180);
    ctx.stroke();

    // Rib cage contours
    ctx.strokeStyle = '#64748b';
    ctx.lineWidth = 9;
    for (let r = 1; r <= 8; r++) {
      const yOffset = cy - 160 + r * 38;
      // Left rib
      ctx.beginPath();
      ctx.arc(cx - 90, yOffset, 100 - r * 4, Math.PI * 0.8, Math.PI * 1.7, false);
      ctx.stroke();
      // Right rib
      ctx.beginPath();
      ctx.arc(cx + 90, yOffset, 100 - r * 4, -Math.PI * 0.7, Math.PI * 0.2, false);
      ctx.stroke();
    }

    // Cardiac Silhouette (Heart border - key measurement feature)
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.moveTo(cx - 20, cy - 100);
    ctx.bezierCurveTo(cx - 120, cy - 20, cx - 110, cy + 90, cx + 30, cy + 120);
    ctx.bezierCurveTo(cx + 80, cy + 110, cx + 60, cy - 30, cx - 20, cy - 100);
    ctx.fill();

    // Diaphragm Domes
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.arc(cx - 110, cy + 170, 110, Math.PI * 1.1, Math.PI * 1.9, false);
    ctx.fill();
    ctx.beginPath();
    ctx.arc(cx + 110, cy + 180, 110, Math.PI * 1.1, Math.PI * 1.9, false);
    ctx.fill();

    // Medical annotation markers
    ctx.shadowBlur = 0;
    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('PORTABLE AP ERECT', 40, 50);
    ctx.fillText('R', 50, 100);
    ctx.fillText('L', w - 70, 100);
  };

  const renderBrainMRI = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const cx = w / 2;
    const cy = h / 2;

    // Cranial Vault
    ctx.strokeStyle = '#f8fafc';
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.ellipse(cx, cy, 180, 220, 0, 0, Math.PI * 2);
    ctx.stroke();

    // Brain tissue
    ctx.fillStyle = '#475569';
    ctx.beginPath();
    ctx.ellipse(cx, cy, 172, 212, 0, 0, Math.PI * 2);
    ctx.fill();

    // Ventricles (T2 hyperintense CSF = bright)
    ctx.fillStyle = '#f1f5f9';
    // Lateral ventricles
    ctx.beginPath();
    ctx.ellipse(cx - 30, cy - 20, 22, 60, -0.2, 0, Math.PI * 2);
    ctx.fill();
    ctx.beginPath();
    ctx.ellipse(cx + 30, cy - 20, 22, 60, 0.2, 0, Math.PI * 2);
    ctx.fill();

    // Sulcal patterns
    ctx.strokeStyle = '#94a3b8';
    ctx.lineWidth = 2.5;
    for (let i = 0; i < 18; i++) {
      const angle = (i / 18) * Math.PI * 2;
      ctx.beginPath();
      ctx.moveTo(cx + Math.cos(angle) * 165, cy + Math.sin(angle) * 200);
      ctx.lineTo(cx + Math.cos(angle) * 115, cy + Math.sin(angle) * 145);
      ctx.stroke();
    }

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('AXIAL T2 FSE', 40, 50);
    ctx.fillText('TR: 4200 TE: 104', 40, 75);
  };

  const renderKneeXray = (ctx: CanvasRenderingContext2D, w: number, h: number) => {
    const cx = w / 2;
    const cy = h / 2;

    // Distal Femur (upper bone)
    ctx.fillStyle = '#cbd5e1';
    ctx.beginPath();
    ctx.moveTo(cx - 60, 40);
    ctx.lineTo(cx + 60, 40);
    ctx.lineTo(cx + 90, cy - 30);
    ctx.quadraticCurveTo(cx + 50, cy - 10, cx, cy - 20);
    ctx.quadraticCurveTo(cx - 50, cy - 10, cx - 90, cy - 30);
    ctx.closePath();
    ctx.fill();

    // Joint Space gap (femoral-tibial line)

    // Proximal Tibia (lower bone)
    ctx.beginPath();
    ctx.moveTo(cx - 95, cy + 25);
    ctx.quadraticCurveTo(cx - 40, cy + 15, cx, cy + 18);
    ctx.quadraticCurveTo(cx + 40, cy + 15, cx + 95, cy + 25);
    ctx.lineTo(cx + 65, h - 40);
    ctx.lineTo(cx - 65, h - 40);
    ctx.closePath();
    ctx.fill();

    // Patella (knee cap shadow)
    ctx.fillStyle = '#94a3b8';
    ctx.beginPath();
    ctx.ellipse(cx - 15, cy - 25, 35, 45, 0.1, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#38bdf8';
    ctx.font = 'bold 16px monospace';
    ctx.fillText('RIGHT KNEE AP/LATERAL', 40, 50);
  };

  const drawCaliperOverlay = (
    ctx: CanvasRenderingContext2D,
    p1: { x: number; y: number },
    p2: { x: number; y: number },
    distMm: number | null,
    zoomScale: number,
    w: number,
    h: number
  ) => {
    ctx.save();

    // Map calibrated coords accounting for zoom
    ctx.translate(w / 2, h / 2);
    ctx.scale(zoomScale, zoomScale);
    ctx.translate(-w / 2, -h / 2);

    ctx.strokeStyle = '#22c55e';
    ctx.lineWidth = 2;
    ctx.setLineDash([5, 4]);

    // Line connecting caliper tips
    ctx.beginPath();
    ctx.moveTo(p1.x, p1.y);
    ctx.lineTo(p2.x, p2.y);
    ctx.stroke();

    // Crosshairs on endpoints
    const drawCrosshair = (pt: { x: number; y: number }) => {
      ctx.setLineDash([]);
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
      ctx.stroke();

      ctx.beginPath();
      ctx.moveTo(pt.x - 10, pt.y);
      ctx.lineTo(pt.x + 10, pt.y);
      ctx.moveTo(pt.x, pt.y - 10);
      ctx.lineTo(pt.x, pt.y + 10);
      ctx.stroke();
    };

    drawCrosshair(p1);
    drawCrosshair(p2);

    // Millimeter distance badge tag
    if (distMm !== null) {
      const midX = (p1.x + p2.x) / 2;
      const midY = (p1.y + p2.y) / 2 - 12;

      ctx.setLineDash([]);
      ctx.fillStyle = '#0f172a';
      ctx.fillRect(midX - 45, midY - 14, 90, 22);
      ctx.strokeStyle = '#22c55e';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(midX - 45, midY - 14, 90, 22);

      ctx.fillStyle = '#22c55e';
      ctx.font = 'bold 12px sans-serif';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${distMm} mm`, midX, midY - 2);
    }

    ctx.restore();
  };

  // Canvas Mouse Click Handling for Caliper Tool
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (activeTool !== 'caliper') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    // Set start point
    setCaliperStart({ x: Math.round(x), y: Math.round(y) });
    setCaliperEnd({ x: Math.round(x), y: Math.round(y) });
    setIsDrawingCaliper(true);
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawingCaliper || activeTool !== 'caliper') return;
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * canvas.width;
    const y = ((e.clientY - rect.top) / rect.height) * canvas.height;

    setCaliperEnd({ x: Math.round(x), y: Math.round(y) });
  };

  const handleCanvasMouseUp = () => {
    setIsDrawingCaliper(false);
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <h1 className="text-xl sm:text-2xl font-black text-slate-900">
              Radiology & DICOM Workstation
            </h1>
            <span className="px-2.5 py-0.5 text-xs font-bold rounded-full bg-blue-100 text-blue-700">
              HTML5 Canvas Calibrated
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Diagnostic viewer with real-time windowing adjustment, caliper distance measurement, and radiologist reports
          </p>
        </div>

        {/* Study Preset Switcher */}
        <div className="flex flex-wrap items-center gap-2">
          {studies.map((s, idx) => (
            <button
              key={s.id}
              onClick={() => {
                setSelectedStudyIndex(idx);
                handleReset();
              }}
              className={`px-3 py-1.5 text-xs font-bold rounded-xl transition-all ${
                selectedStudyIndex === idx
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
              }`}
            >
              {s.modality}
            </button>
          ))}
        </div>
      </div>

      {/* Main Workstation Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left 2 Cols: Interactive Canvas & Tool Overlay */}
        <div className="lg:col-span-2 bg-slate-950 rounded-2xl p-4 border border-slate-800 shadow-xl flex flex-col justify-between">
          {/* Top Canvas Toolbar */}
          <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-slate-800 text-xs text-slate-300">
            <div className="flex items-center space-x-2">
              <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                {currentStudy.modality}
              </span>
              <span className="text-slate-500">•</span>
              <span className="text-slate-400 font-mono text-[11px]">{currentStudy.accessionNumber}</span>
            </div>

            {/* Mode Switcher: Caliper vs Pan */}
            <div className="flex items-center space-x-1 bg-slate-900 p-1 rounded-lg border border-slate-700">
              <button
                onClick={() => setActiveTool('caliper')}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                  activeTool === 'caliper'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Caliper (mm)</span>
              </button>
              <button
                onClick={() => setActiveTool('pan')}
                className={`flex items-center space-x-1.5 px-2.5 py-1 rounded-md text-[11px] font-bold transition-all ${
                  activeTool === 'pan'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                <Move className="w-3.5 h-3.5" />
                <span>Pan / View</span>
              </button>
            </div>
          </div>

          {/* Canvas Radiograph */}
          <div className="relative my-3 flex items-center justify-center overflow-hidden rounded-xl bg-black border border-slate-900">
            <canvas
              ref={canvasRef}
              width={680}
              height={520}
              onMouseDown={handleCanvasMouseDown}
              onMouseMove={handleCanvasMouseMove}
              onMouseUp={handleCanvasMouseUp}
              className={`max-w-full h-auto cursor-${activeTool === 'caliper' ? 'crosshair' : 'grab'}`}
            />

            {/* In-canvas Caliper HUD readout */}
            {measuredDistanceMm !== null && (
              <div className="absolute bottom-4 left-4 bg-slate-900/90 backdrop-blur-md px-3.5 py-2 rounded-xl border border-emerald-500/50 text-white text-xs shadow-lg">
                <div className="flex items-center space-x-2">
                  <Ruler className="w-4 h-4 text-emerald-400" />
                  <span className="font-bold">Caliper Metric:</span>
                  <span className="font-mono text-emerald-400 font-extrabold text-sm">
                    {measuredDistanceMm} mm
                  </span>
                </div>
                <p className="text-[10px] text-slate-400 mt-0.5">
                  Click and drag to measure anatomical distances (cardiac diameter, lesion margin)
                </p>
              </div>
            )}
          </div>

          {/* Windowing Sliders & Image Controls */}
          <div className="pt-3 border-t border-slate-800 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 text-xs text-slate-300">
            {/* Brightness */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="flex items-center space-x-1">
                  <Sun className="w-3.5 h-3.5 text-amber-400" />
                  <span>Brightness</span>
                </span>
                <span className="font-mono">{brightness > 0 ? `+${brightness}` : brightness}</span>
              </div>
              <input
                type="range"
                min="-80"
                max="80"
                value={brightness}
                onChange={(e) => setBrightness(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>

            {/* Contrast */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="flex items-center space-x-1">
                  <Contrast className="w-3.5 h-3.5 text-blue-400" />
                  <span>Contrast</span>
                </span>
                <span className="font-mono">{contrast.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="0.5"
                max="2.5"
                step="0.1"
                value={contrast}
                onChange={(e) => setContrast(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>

            {/* Zoom */}
            <div>
              <div className="flex justify-between font-semibold mb-1">
                <span className="flex items-center space-x-1">
                  <ZoomIn className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Magnification</span>
                </span>
                <span className="font-mono">{zoom.toFixed(1)}x</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="3.0"
                step="0.1"
                value={zoom}
                onChange={(e) => setZoom(Number(e.target.value))}
                className="w-full accent-blue-500"
              />
            </div>

            {/* Toggles & Reset */}
            <div className="flex items-center space-x-2 pt-2">
              <button
                onClick={() => setIsInverted(!isInverted)}
                className={`flex-1 py-1.5 px-2 rounded-lg text-xs font-bold border transition-colors ${
                  isInverted
                    ? 'bg-white text-slate-900 border-white'
                    : 'bg-slate-900 text-slate-300 border-slate-700 hover:bg-slate-800'
                }`}
              >
                Invert Grayscale
              </button>
              <button
                onClick={handleReset}
                title="Reset View"
                className="p-1.5 bg-slate-900 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg border border-slate-700"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Right Col: Formal Radiologist Impression & Report */}
        <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <h3 className="text-base font-bold text-slate-900 flex items-center space-x-2">
                <FileText className="w-4 h-4 text-blue-600" />
                <span>Radiologist Impressions</span>
              </h3>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-50 text-emerald-700 border border-emerald-200 rounded-md">
                Verified Final
              </span>
            </div>

            <div className="mt-3 space-y-3 text-xs">
              <div>
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                  Performing Imaging Center
                </span>
                <span className="text-slate-800 font-bold">{currentStudy.facility}</span>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                  Attending Radiologist
                </span>
                <span className="text-slate-800 font-bold">{currentStudy.radiologist}</span>
              </div>

              <div>
                <span className="text-slate-400 font-semibold block text-[10px] uppercase">
                  Exam Date & Time
                </span>
                <span className="text-slate-700 font-mono">{currentStudy.studyDate}</span>
              </div>

              <div className="pt-2">
                <span className="text-slate-700 font-bold block uppercase tracking-wide text-[10px]">
                  Clinical Findings
                </span>
                <p className="text-slate-600 mt-1 leading-relaxed bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs">
                  {currentStudy.findings}
                </p>
              </div>

              <div>
                <span className="text-slate-900 font-bold block uppercase tracking-wide text-[10px]">
                  Impression & Diagnosis
                </span>
                <div className="mt-1 bg-blue-50/70 p-3 rounded-xl border border-blue-200 text-blue-950 font-medium whitespace-pre-line leading-relaxed">
                  {currentStudy.impression}
                </div>
              </div>

              <div>
                <span className="text-slate-500 font-semibold block text-[10px] uppercase">
                  Follow-up Recommendation
                </span>
                <span className="text-slate-700 font-medium">{currentStudy.recommendedFollowup}</span>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
            <span>PACS DICOM Instance UID</span>
            <span className="font-mono text-slate-500">1.2.840.10008.5.1.4.1</span>
          </div>
        </div>
      </div>
    </div>
  );
};
