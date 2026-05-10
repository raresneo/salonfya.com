import React, { useState } from 'react';

const ImageGallery = ({ images }: { images: string[] }) => {
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    return (
        <>
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 mt-8">
                {images.map((img, idx) => (
                    <div
                        key={idx}
                        className="group relative aspect-[3/4] overflow-hidden cursor-zoom-in border border-[var(--color-border)]"
                        onClick={() => setSelectedImage(img)}
                    >
                        <img src={img} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110 vintage-pastel" alt={`Gallery ${idx}`} />
                        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors"></div>
                        <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
                            <span className="bg-white/80 p-2 rounded-full text-[10px] uppercase tracking-wider block">Zoom</span>
                        </div>
                    </div>
                ))}
            </div>

            {/* Full Screen Zoom Modal */}
            {selectedImage && (
                <div
                    className="fixed inset-0 z-[110] bg-white/95 backdrop-blur-xl flex items-center justify-center p-4 cursor-zoom-out"
                    onClick={() => setSelectedImage(null)}
                >
                    <img
                        src={selectedImage}
                        className="max-w-full max-h-full object-contain shadow-2xl animate-[scaleIn_0.3s_ease-out]"
                        alt="Zoom Detail"
                    />
                </div>
            )}
        </>
    );
};

export default ImageGallery;
