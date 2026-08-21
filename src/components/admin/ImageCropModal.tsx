import React, { useState, useRef, useEffect } from 'react';

interface ImageCropModalProps {
  isOpen: boolean;
  imageSrc: string;
  onCropComplete: (croppedDataUrl: string) => void;
  onClose: () => void;
}

export const ImageCropModal: React.FC<ImageCropModalProps> = ({
  isOpen,
  imageSrc,
  onCropComplete,
  onClose,
}) => {
  const [zoom, setZoom] = useState<number>(1);
  const [rotation, setRotation] = useState<number>(0);
  const [position, setPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [naturalDimensions, setNaturalDimensions] = useState<{ width: number; height: number }>({ width: 0, height: 0 });
  const [previewDataUrl, setPreviewDataUrl] = useState<string>('');

  const imageRef = useRef<HTMLImageElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // Reset parameters whenever a new image is loaded
  useEffect(() => {
    if (isOpen && imageSrc) {
      setZoom(1);
      setRotation(0);
      setPosition({ x: 0, y: 0 });
    }
  }, [isOpen, imageSrc]);

  // When image loads, store dimensions
  const onImageLoaded = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const { naturalWidth, naturalHeight } = e.currentTarget;
    setNaturalDimensions({ width: naturalWidth, height: naturalHeight });
  };

  // Generate live preview when zoom/position/rotation changes
  useEffect(() => {
    if (!isOpen || !imageSrc || !imageRef.current || !containerRef.current) return;

    const generatePreview = () => {
      const canvas = document.createElement('canvas');
      const targetSize = 300;
      canvas.width = targetSize;
      canvas.height = targetSize;
      const ctx = canvas.getContext('2d');
      if (!ctx || !imageRef.current) return;

      const img = imageRef.current;
      const cont = containerRef.current;
      if (!img.naturalWidth || !img.naturalHeight) return;

      const contWidth = cont.clientWidth;
      const contHeight = cont.clientHeight;
      const cropSize = Math.min(contWidth, contHeight) * 0.8;

      ctx.clearRect(0, 0, targetSize, targetSize);
      ctx.save();

      // Move canvas origin to center
      ctx.translate(targetSize / 2, targetSize / 2);
      ctx.rotate((rotation * Math.PI) / 180);

      // Scaling factor between screen crop box and target canvas
      const scale = (targetSize / cropSize) * zoom;
      ctx.scale(scale, scale);

      // Apply drag offset (adjusted for zoom and rotation)
      ctx.translate(position.x / zoom, position.y / zoom);

      // Calculate initial image fit in container
      const baseScale = Math.max(cropSize / img.naturalWidth, cropSize / img.naturalHeight);
      const drawWidth = img.naturalWidth * baseScale;
      const drawHeight = img.naturalHeight * baseScale;

      ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
      ctx.restore();

      setPreviewDataUrl(canvas.toDataURL('image/jpeg', 0.85));
    };

    const timer = setTimeout(generatePreview, 50);
    return () => clearTimeout(timer);
  }, [isOpen, imageSrc, zoom, position, rotation, naturalDimensions]);

  // Drag handlers (Mouse & Touch)
  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true);
    setDragStart({
      x: e.clientX - position.x,
      y: e.clientY - position.y,
    });
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return;
    setPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y,
    });
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setIsDragging(false);
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
  };

  // Wheel zoom handler
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoom((prev) => Math.min(Math.max(prev + delta, 0.8), 3.5));
  };

  // Save / Apply high quality crop
  const handleApplyCrop = () => {
    if (!imageRef.current || !containerRef.current) return;
    const img = imageRef.current;
    const cont = containerRef.current;

    const canvas = document.createElement('canvas');
    const OUTPUT_SIZE = 600; // High quality 600x600 square output
    canvas.width = OUTPUT_SIZE;
    canvas.height = OUTPUT_SIZE;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const contWidth = cont.clientWidth;
    const contHeight = cont.clientHeight;
    const cropSize = Math.min(contWidth, contHeight) * 0.8;

    ctx.clearRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
    ctx.save();

    // Center canvas
    ctx.translate(OUTPUT_SIZE / 2, OUTPUT_SIZE / 2);
    ctx.rotate((rotation * Math.PI) / 180);

    const scale = (OUTPUT_SIZE / cropSize) * zoom;
    ctx.scale(scale, scale);
    ctx.translate(position.x / zoom, position.y / zoom);

    const baseScale = Math.max(cropSize / img.naturalWidth, cropSize / img.naturalHeight);
    const drawWidth = img.naturalWidth * baseScale;
    const drawHeight = img.naturalHeight * baseScale;

    ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
    ctx.restore();

    const finalDataUrl = canvas.toDataURL('image/jpeg', 0.9);
    onCropComplete(finalDataUrl);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fadeIn">
      <div className="bg-[#f7f9fc] rounded-3xl max-w-2xl w-full shadow-2xl overflow-hidden flex flex-col max-h-[95vh] border border-gray-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-2">
            <span className="material-symbols-outlined text-[#004c4c] text-2xl">crop</span>
            <div>
              <h3 className="font-headline text-lg font-bold text-[#004c4c]">
                Adjust & Frame Photo
              </h3>
              <p className="text-xs text-[#486363]">
                Drag to reposition, zoom in/out, or rotate to fit perfectly
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-gray-400 hover:text-gray-700 hover:bg-gray-100 cursor-pointer"
          >
            <span className="material-symbols-outlined text-xl">close</span>
          </button>
        </div>

        {/* Interactive Workspace */}
        <div className="p-6 space-y-6 flex-grow overflow-y-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
            {/* Main Interactive Drag/Crop Viewport */}
            <div className="md:col-span-2 space-y-3">
              <div
                ref={containerRef}
                onWheel={handleWheel}
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                onPointerCancel={handlePointerUp}
                className="relative w-full h-[320px] bg-gray-900 rounded-2xl overflow-hidden cursor-grab active:cursor-grabbing select-none flex items-center justify-center touch-none shadow-inner"
              >
                {/* Image being dragged and zoomed */}
                <div
                  style={{
                    transform: `translate(${position.x}px, ${position.y}px) scale(${zoom}) rotate(${rotation}deg)`,
                    transition: isDragging ? 'none' : 'transform 0.1s ease-out',
                    transformOrigin: 'center center',
                  }}
                  className="flex items-center justify-center pointer-events-none"
                >
                  <img
                    ref={imageRef}
                    src={imageSrc}
                    alt="Crop preview"
                    onLoad={onImageLoaded}
                    className="max-w-none object-contain select-none max-h-[300px]"
                    crossOrigin="anonymous"
                  />
                </div>

                {/* Circular Target Overlay with Vignette */}
                <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
                  <div className="w-[240px] h-[240px] rounded-full border-2 border-white shadow-[0_0_0_9999px_rgba(0,0,0,0.55)] flex items-center justify-center relative">
                    {/* Crosshair guidelines */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-30">
                      <div className="w-full h-[1px] bg-white"></div>
                      <div className="h-full w-[1px] bg-white absolute"></div>
                    </div>
                  </div>
                </div>

                {/* Helper hint pill */}
                <div className="absolute bottom-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-black/60 text-white text-[11px] font-medium backdrop-blur-xs pointer-events-none flex items-center gap-1.5 shadow">
                  <span className="material-symbols-outlined text-xs">pan_tool</span>
                  <span>Click & Drag to Reposition</span>
                </div>
              </div>

              {/* Quick control tools */}
              <div className="flex items-center justify-between text-xs text-[#486363] px-1">
                <span>Drag to align headshot</span>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => setRotation((r) => (r + 90) % 360)}
                    className="px-2.5 py-1 rounded-lg bg-gray-200/70 hover:bg-gray-300 text-gray-700 font-semibold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">rotate_right</span>
                    <span>Rotate 90°</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setZoom(1);
                      setPosition({ x: 0, y: 0 });
                      setRotation(0);
                    }}
                    className="px-2.5 py-1 rounded-lg bg-gray-200/70 hover:bg-gray-300 text-gray-700 font-semibold text-xs flex items-center gap-1 cursor-pointer"
                  >
                    <span className="material-symbols-outlined text-sm">restart_alt</span>
                    <span>Reset</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Live Result Preview */}
            <div className="flex flex-col items-center justify-center gap-3 p-4 rounded-2xl bg-white border border-gray-200 shadow-sm text-center">
              <span className="text-xs font-bold text-[#004c4c] uppercase tracking-wider">
                Homepage Preview
              </span>

              {/* Exact home hero replica preview */}
              <div className="w-28 h-28 rounded-full p-1.5 bg-[#f7f9fc] shadow-[-3px_-3px_8px_#ffffff,3px_3px_8px_#d1d9e6] flex items-center justify-center">
                <div className="w-full h-full rounded-full overflow-hidden shadow-[inset_-2px_-2px_4px_#ffffff,inset_2px_2px_4px_#d1d9e6] bg-[#e8eef3]">
                  {previewDataUrl ? (
                    <img
                      src={previewDataUrl}
                      alt="Homepage avatar preview"
                      className="w-full h-full object-cover rounded-full"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">
                      Loading...
                    </div>
                  )}
                </div>
              </div>

              <div className="text-[11px] text-[#486363] leading-tight">
                This is exactly how your profile picture will appear on the homepage.
              </div>
            </div>
          </div>

          {/* Zoom Slider Control */}
          <div className="p-4 rounded-2xl bg-[#f0f4f8] border border-gray-200 space-y-2">
            <div className="flex items-center justify-between text-xs font-semibold text-[#004c4c]">
              <div className="flex items-center gap-1.5">
                <span className="material-symbols-outlined text-sm">zoom_in</span>
                <span>Zoom Level</span>
              </div>
              <span className="font-mono text-[11px] bg-white px-2 py-0.5 rounded-md border border-gray-200">
                {Math.round(zoom * 100)}%
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setZoom((z) => Math.max(z - 0.15, 0.8))}
                className="w-7 h-7 rounded-lg bg-white hover:bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-600 font-bold text-sm cursor-pointer shadow-xs"
              >
                −
              </button>

              <input
                type="range"
                min="0.8"
                max="3.0"
                step="0.05"
                value={zoom}
                onChange={(e) => setZoom(parseFloat(e.target.value))}
                className="flex-grow h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-[#004c4c]"
              />

              <button
                type="button"
                onClick={() => setZoom((z) => Math.min(z + 0.15, 3.0))}
                className="w-7 h-7 rounded-lg bg-white hover:bg-gray-100 border border-gray-300 flex items-center justify-center text-gray-600 font-bold text-sm cursor-pointer shadow-xs"
              >
                +
              </button>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200 bg-white">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-gray-600 hover:bg-gray-100 font-semibold text-xs cursor-pointer"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleApplyCrop}
            className="px-6 py-2.5 rounded-xl bg-[#004c4c] text-white hover:bg-[#006666] font-bold text-xs flex items-center gap-2 shadow-md hover:shadow-lg cursor-pointer transition-all"
          >
            <span className="material-symbols-outlined text-sm">check</span>
            <span>Apply & Save Framing</span>
          </button>
        </div>
      </div>
    </div>
  );
};
