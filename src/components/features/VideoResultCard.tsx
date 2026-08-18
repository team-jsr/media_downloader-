import React, { useState } from 'react';
import { Download, Film, Music, FileVideo } from 'lucide-react';
import { Button } from '../ui/Button';
import './VideoResultCard.css';

interface Format {
  format_id: string;
  ext: string;
  resolution: string;
  filesize: number;
  url: string;
  hasVideo: boolean;
  hasAudio: boolean;
  abr?: number;
}

interface VideoResultCardProps {
  title: string;
  thumbnail: string;
  duration?: number;
  videoFormats?: Format[];
  audioFormats?: Format[];
  directUrl?: string;
  originalUrl: string;
}

export const VideoResultCard: React.FC<VideoResultCardProps> = ({
  title,
  thumbnail,
  duration,
  videoFormats = [],
  audioFormats = [],
  directUrl,
  originalUrl,
}) => {
  const [activeTab, setActiveTab] = useState<'video' | 'audio'>('video');
  
  const formatDuration = (seconds?: number) => {
    if (!seconds) return '';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    if (h > 0) return `${h}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  const formatSize = (bytes: number) => {
    if (!bytes || bytes === 0) return '';
    const mb = bytes / (1024 * 1024);
    return `${mb.toFixed(1)} MB`;
  };

  const handleDownload = (formatId?: string, fallbackUrl?: string) => {
    let proxyUrl = '';
    if (formatId) {
      proxyUrl = `/api/proxy?url=${encodeURIComponent(originalUrl)}&format_id=${encodeURIComponent(formatId)}`;
    } else if (fallbackUrl) {
      proxyUrl = `/api/proxy?fallback_url=${encodeURIComponent(fallbackUrl)}`;
    }
    
    if (proxyUrl) {
      window.open(proxyUrl, '_blank', 'noopener,noreferrer');
    }
  };

  const formatResolutionLabel = (res: string) => {
    if (!res) return 'Unknown Quality';
    if (res.toLowerCase() === 'audio only') return 'Audio';
    
    const match = res.match(/(\d+)x(\d+)/);
    if (match) {
      return `${match[2]}p`;
    }
    
    return res;
  };

  const displayFormats = activeTab === 'video' ? videoFormats.slice(0, 10) : audioFormats.slice(0, 10);

  return (
    <div className="video-card glass-panel animate-fade-in">
      <div className="video-card-header">
        <div className="thumbnail-wrapper">
          <img src={thumbnail} alt={title} className="thumbnail" />
          {duration && <span className="duration-badge">{formatDuration(duration)}</span>}
        </div>
        <div className="video-info">
          <h3 className="video-title">{title}</h3>
        </div>
      </div>

      <div className="download-section">
        <div className="tabs">
          <button 
            className={`tab-btn ${activeTab === 'video' ? 'active' : ''}`}
            onClick={() => setActiveTab('video')}
          >
            <Film size={18} />
            Video
          </button>
          <button 
            className={`tab-btn ${activeTab === 'audio' ? 'active' : ''}`}
            onClick={() => setActiveTab('audio')}
          >
            <Music size={18} />
            Audio Only
          </button>
        </div>
        
        {displayFormats && displayFormats.length > 0 ? (
          <div className="formats-list">
            {displayFormats.map((format) => (
              <div key={format.format_id} className="format-row">
                <div className="format-details">
                  <div className="format-primary">
                    <span className="format-res">
                      {activeTab === 'audio' && format.abr 
                        ? `${Math.round(format.abr)} kbps` 
                        : formatResolutionLabel(format.resolution)}
                    </span>
                    <span className="format-ext badge">{format.ext.toUpperCase()}</span>
                  </div>
                  {format.filesize > 0 && (
                    <span className="format-size">{formatSize(format.filesize)}</span>
                  )}
                </div>
                <Button 
                  variant="primary" 
                  className="download-btn"
                  onClick={() => handleDownload(format.format_id)}
                >
                  <Download size={18} />
                  Download
                </Button>
              </div>
            ))}
          </div>
        ) : (
          directUrl ? (
            <div className="fallback-download">
              <Button onClick={() => handleDownload(undefined, directUrl)} className="w-full">
                <Download size={20} />
                Download Media
              </Button>
            </div>
          ) : (
            <div className="no-formats">
              <p>No formats available for this selection.</p>
            </div>
          )
        )}
      </div>
    </div>
  );
};
