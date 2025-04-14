"use client";

import { useState, useRef, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Checkbox } from "@/components/ui/checkbox";
import toast from "react-hot-toast";
import QRCode from 'qrcode';

export default function QRCodeGenerator() {
    // State management
    const [url, setUrl] = useState("");
    const [shortenedUrl, setShortenedUrl] = useState("");
    const [logoPreview, setLogoPreview] = useState(null);
    const [qrFgColor, setQrFgColor] = useState("#000000");
    const [qrBgColor, setQrBgColor] = useState("#ffffff");
    const [logoSize, setLogoSize] = useState(18);
    const [fileName, setFileName] = useState("qr-code");
    const [isShortening, setIsShortening] = useState(false);
    const [useShortUrl, setUseShortUrl] = useState(false);
    const [qrSize, setQrSize] = useState(300);
    const canvasRef = useRef(null);
    const qrRef = useRef(null);
    const logoInputRef = useRef(null);

    // Constant for high-definition QR code
    const HD_QR_SIZE = 1200;

    // URL to use for QR generation
    const qrUrl = useShortUrl && shortenedUrl ? shortenedUrl : url;

    // Update QR size on window resize
    useEffect(() => {
        const handleResize = () => {
            setQrSize(window.innerWidth < 640 ? 250 : window.innerWidth < 768 ? 280 : 300);
        };

        handleResize(); // Initial size setup
        window.addEventListener('resize', handleResize);
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    // Handle logo upload
    const handleLogoChange = (e) => {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const img = new Image();
            img.onload = () => {
                setLogoPreview({
                    src: img.src,
                    width: img.width,
                    height: img.height
                });
            };
            img.src = e.target.result;
        };
        reader.readAsDataURL(file);
    };

    // Shorten URL using TinyURL API
    const shortenUrl = async () => {
        if (!url || !url.trim()) {
            toast.error("Please enter a valid URL first");
            return;
        }

        if (!url.startsWith('http://') && !url.startsWith('https://')) {
            toast.error("URL must start with http:// or https://");
            return;
        }

        try {
            setIsShortening(true);
            const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(url)}`);

            if (!response.ok) {
                throw new Error('Failed to shorten URL');
            }

            const shortUrl = await response.text();
            setShortenedUrl(shortUrl);
            setUseShortUrl(true);
            toast.success("URL shortened successfully");
        } catch (error) {
            console.error('Error shortening URL:', error);
            toast.error("Failed to shorten URL. Please try again later.");
        } finally {
            setIsShortening(false);
        }
    };

    // Render QR code to canvas with proper logo aspect ratio
    const renderQRCode = async (canvas, url, size, logoImg = null, logoSizePercent = 18) => {
        if (!canvas || !url) return null;

        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, size, size);

        try {
            await QRCode.toCanvas(canvas, url, {
                width: size,
                margin: 1,
                color: {
                    dark: qrFgColor,
                    light: qrBgColor
                },
                errorCorrectionLevel: 'H'
            });

            // Add logo if present
            if (logoImg) {
                const logoSizeInPx = size * (logoSizePercent / 100);
                const logoX = (size - logoSizeInPx) / 2;
                const logoY = (size - logoSizeInPx) / 2;

                // Clear the center area for the logo
                ctx.fillStyle = qrBgColor;
                ctx.fillRect(logoX, logoY, logoSizeInPx, logoSizeInPx);

                // Calculate dimensions to maintain aspect ratio
                let drawWidth = logoSizeInPx;
                let drawHeight = logoSizeInPx;
                const aspectRatio = logoImg.width / logoImg.height;

                if (aspectRatio > 1) {
                    drawHeight = drawWidth / aspectRatio;
                } else {
                    drawWidth = drawHeight * aspectRatio;
                }

                // Center the logo
                const offsetX = logoX + (logoSizeInPx - drawWidth) / 2;
                const offsetY = logoY + (logoSizeInPx - drawHeight) / 2;

                // Draw the logo
                ctx.drawImage(logoImg, offsetX, offsetY, drawWidth, drawHeight);
            }

            return canvas;
        } catch (error) {
            console.error("Error rendering QR code:", error);
            return null;
        }
    };

    // Live QR code display effect
    useEffect(() => {
        const updateQRCode = async () => {
            if (!qrUrl || !canvasRef.current) return;

            try {
                if (logoPreview) {
                    const logoImg = new Image();
                    logoImg.onload = async () => {
                        await renderQRCode(canvasRef.current, qrUrl, qrSize, logoImg, logoSize);
                    };
                    logoImg.src = logoPreview.src;
                } else {
                    await renderQRCode(canvasRef.current, qrUrl, qrSize);
                }
            } catch (error) {
                console.error("Error updating QR code:", error);
            }
        };

        updateQRCode();
    }, [qrUrl, qrSize, logoPreview, logoSize, qrFgColor, qrBgColor]);

    // Download QR code as PNG
    const downloadQRCode = async () => {
        if (!qrUrl) {
            toast.error("Please enter a valid URL first");
            return;
        }

        try {
            // Create a temporary canvas with high resolution
            const tempCanvas = document.createElement('canvas');
            tempCanvas.width = HD_QR_SIZE;
            tempCanvas.height = HD_QR_SIZE;

            // Generate high-resolution QR code
            if (logoPreview) {
                const logoImg = new Image();
                logoImg.src = logoPreview.src;

                // Wait for logo to load
                await new Promise((resolve) => {
                    logoImg.onload = resolve;
                });

                await renderQRCode(tempCanvas, qrUrl, HD_QR_SIZE, logoImg, logoSize);
            } else {
                await renderQRCode(tempCanvas, qrUrl, HD_QR_SIZE);
            }

            // Export as PNG at maximum quality
            const dataUrl = tempCanvas.toDataURL('image/png', 1.0);
            const downloadLink = document.createElement("a");
            downloadLink.href = dataUrl;
            downloadLink.download = `${fileName || "qr-code"}.png`;
            document.body.appendChild(downloadLink);
            downloadLink.click();
            document.body.removeChild(downloadLink);
            toast.success("QR code downloaded successfully");
        } catch (error) {
            console.error('Error generating HD image:', error);
            toast.error("Failed to download QR code");
        }
    };

    // Reset all settings
    const resetAll = () => {
        setUrl("");
        setLogoPreview(null);
        setQrFgColor("#000000");
        setQrBgColor("#ffffff");
        setFileName("qr-code");
        setLogoSize(18);
        setUseShortUrl(false);
        setShortenedUrl("");

        // Reset the file input value
        if (logoInputRef.current) {
            logoInputRef.current.value = "";
        }
    };

    // Copy shortened URL to clipboard
    const copyToClipboard = () => {
        navigator.clipboard.writeText(shortenedUrl);
        toast.success("Copied to clipboard");
    };

    return (
        <div className="container px-4 mx-auto py-6 md:py-8">
            <h1 className="text-2xl md:text-3xl font-bold mb-4 md:mb-6">QR Code Generator</h1>
            <p className="text-gray-500 mb-6 md:mb-8 text-sm md:text-base">
                Create modern-looking QR codes with custom logo for your events, resources, and more.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8 mb-6 md:mb-8">
                {/* QR Code Preview */}
                <Card className="p-4 md:p-6 bg-white shadow-lg rounded-xl border-none">
                    <div className="flex flex-col items-center">
                        <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">QR Code Preview</h2>
                        <div
                            ref={qrRef}
                            className="border border-dashed border-gray-300 p-4 md:p-8 rounded-lg flex items-center justify-center bg-gray-50 w-full"
                            style={{ minHeight: `${qrSize + 50}px` }}
                        >
                            {qrUrl ? (
                                <div className="relative transition-all duration-300">
                                    <canvas
                                        ref={canvasRef}
                                        width={qrSize}
                                        height={qrSize}
                                        className="shadow-lg transition-all duration-300 rounded-lg"
                                    />
                                </div>
                            ) : (
                                <div className="text-center px-4">
                                    <p className="text-gray-400 mb-2 text-sm md:text-base">Enter a URL to generate QR code</p>
                                    <p className="text-xs text-gray-400">Your custom logo will appear in the center</p>
                                </div>
                            )}
                        </div>
                        <div className="w-full mt-4">
                            <div className="flex flex-col sm:flex-row gap-2 items-start sm:items-center mb-4">
                                <Label htmlFor="fileName" className="min-w-[80px] sm:min-w-[100px]">File Name:</Label>
                                <div className="flex w-full">
                                    <Input
                                        id="fileName"
                                        placeholder="qr-code"
                                        value={fileName}
                                        onChange={(e) => setFileName(e.target.value)}
                                        className="flex-1 bg-gray-50"
                                    />
                                    <span className="text-sm text-gray-500 ml-2 mt-2 sm:mt-0">.png</span>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 w-full">
                                <Button
                                    className="flex-1"
                                    onClick={downloadQRCode}
                                    disabled={!qrUrl}
                                >
                                    Download QR Code
                                </Button>
                                <Button
                                    variant="outline"
                                    className="flex-1"
                                    onClick={resetAll}
                                >
                                    Reset
                                </Button>
                            </div>
                            <div className="flex items-center justify-center mt-3 px-3 py-2 bg-blue-100 border border-blue-300 rounded-md">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-blue-600 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                                <p className="text-sm font-semibold text-blue-800">QR code will be downloaded in ultra-high resolution (1200×1200px)</p>
                            </div>
                        </div>
                    </div>
                </Card>

                {/* QR Code Settings */}
                <Card className="p-4 md:p-6 bg-white shadow-lg rounded-xl border-none">
                    <h2 className="text-lg md:text-xl font-semibold mb-4 md:mb-6">QR Code Settings</h2>

                    <div className="space-y-5">
                        {/* URL Input */}
                        <div className="space-y-2">
                            <Label htmlFor="url">Enter URL</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="url"
                                    type="url"
                                    placeholder="https://example.com"
                                    value={url}
                                    onChange={(e) => setUrl(e.target.value)}
                                    className="bg-gray-50 flex-1"
                                />
                                <Button
                                    onClick={shortenUrl}
                                    disabled={isShortening || !url}
                                    className="whitespace-nowrap"
                                >
                                    {isShortening ? 'Shortening...' : 'Shorten URL'}
                                </Button>
                            </div>

                            {shortenedUrl && (
                                <div className="mt-3 p-3 border rounded-lg bg-gray-50">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Checkbox
                                            id="useShortUrl"
                                            checked={useShortUrl}
                                            onCheckedChange={setUseShortUrl}
                                        />
                                        <Label htmlFor="useShortUrl" className="text-sm font-medium cursor-pointer">
                                            Use shortened URL
                                        </Label>
                                    </div>
                                    <div className="flex gap-2 items-center">
                                        <Input
                                            value={shortenedUrl}
                                            readOnly
                                            className="bg-white text-sm flex-1"
                                        />
                                        <Button
                                            variant="outline"
                                            size="sm"
                                            onClick={copyToClipboard}
                                            className="whitespace-nowrap"
                                        >
                                            Copy
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Separator />

                        {/* Logo Upload */}
                        <div className="space-y-2">
                            <Label htmlFor="logo">Upload Logo (Optional)</Label>
                            <Input
                                id="logo"
                                type="file"
                                accept="image/*"
                                onChange={handleLogoChange}
                                className="cursor-pointer bg-gray-50"
                                ref={logoInputRef}
                            />
                            {logoPreview && (
                                <div className="mt-3 p-3 border rounded-lg bg-gray-50">
                                    <p className="text-sm text-gray-500 mb-2">Logo Preview:</p>
                                    <div className="flex flex-col gap-4">
                                        <div className="flex items-center gap-4">
                                            <img
                                                src={logoPreview.src}
                                                alt="Logo Preview"
                                                className="h-12 w-12 sm:h-16 sm:w-16 object-contain border rounded-md bg-white p-1"
                                            />
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                className="h-auto px-3 py-1 text-xs sm:text-sm text-red-500 border-red-200 hover:bg-red-50"
                                                onClick={() => setLogoPreview(null)}
                                            >
                                                Remove Logo
                                            </Button>
                                        </div>

                                        <div className="space-y-2">
                                            <div className="flex justify-between">
                                                <Label htmlFor="logoSize">Logo Size: {logoSize}%</Label>
                                            </div>
                                            <Input
                                                id="logoSize"
                                                type="range"
                                                min="10"
                                                max="35"
                                                value={logoSize}
                                                onChange={(e) => setLogoSize(parseInt(e.target.value))}
                                                className="cursor-pointer"
                                            />
                                            <p className="text-xs text-gray-500">Adjust the size of your logo within the QR code</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>

                        <Separator />

                        {/* QR Code Customization */}
                        <div className="space-y-4">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <Label htmlFor="fgColor">Foreground Color</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="fgColor"
                                            type="color"
                                            value={qrFgColor}
                                            onChange={(e) => setQrFgColor(e.target.value)}
                                            className="w-12 h-10 p-1 cursor-pointer"
                                        />
                                        <Input
                                            type="text"
                                            value={qrFgColor}
                                            onChange={(e) => setQrFgColor(e.target.value)}
                                            className="flex-1 bg-gray-50"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="bgColor">Background Color</Label>
                                    <div className="flex gap-2">
                                        <Input
                                            id="bgColor"
                                            type="color"
                                            value={qrBgColor}
                                            onChange={(e) => setQrBgColor(e.target.value)}
                                            className="w-12 h-10 p-1 cursor-pointer"
                                        />
                                        <Input
                                            type="text"
                                            value={qrBgColor}
                                            onChange={(e) => setQrBgColor(e.target.value)}
                                            className="flex-1 bg-gray-50"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </Card>
            </div>

            {/* Tips and Instructions */}
            <Card className="p-4 md:p-6 mt-6 md:mt-8 bg-primary/5 shadow-sm rounded-xl border-none">
                <h2 className="text-lg md:text-xl font-semibold mb-3 md:mb-4">Tips for Effective QR Codes</h2>
                <ul className="list-disc pl-5 space-y-1 md:space-y-2 text-xs md:text-sm">
                    <li>Use high contrast colors for better scanning reliability</li>
                    <li>Keep logo sizes proportional to ensure the QR code remains scannable</li>
                    <li>Test your QR code with various devices before distributing</li>
                    <li>Consider the context where the QR code will be displayed (print vs digital)</li>
                    <li>Use shortened URLs when possible to reduce QR code complexity</li>
                </ul>
            </Card>
        </div>
    );
}