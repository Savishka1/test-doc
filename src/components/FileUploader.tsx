import { useState, useRef } from 'react';
import type { ChangeEvent } from 'react';
import { getFileErrorMessage } from '../lib/validators';
import '../styles/FileUploader.css';

interface FileUploaderProps {
  label: string;
  required?: boolean;
  onFileSelect: (file: File | null) => void;
  accept?: string;
  testId?: string;
}

export const FileUploader = ({
  label,
  required = false,
  onFileSelect,
  accept = '.pdf,.jpg,.jpeg,.png',
  testId = 'file-uploader',
}: FileUploaderProps) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    setError(null);
    setPreview(null);

    if (!file) {
      setSelectedFile(null);
      onFileSelect(null);
      return;
    }

    // Validate file
    const errorMessage = getFileErrorMessage(file);
    if (errorMessage) {
      setError(errorMessage);
      setSelectedFile(null);
      onFileSelect(null);
      return;
    }

    setSelectedFile(file);
    onFileSelect(file);

    // Generate preview for images
    if (file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setError(null);
    setPreview(null);
    onFileSelect(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <div className="file-uploader" data-testid={testId}>
      <label className="file-uploader-label">
        {label} {required && <span className="required">*</span>}
      </label>

      <div className="file-uploader-input-wrapper">
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="file-input"
          data-testid={`${testId}-input`}
        />
        <button
          type="button"
          className="btn btn-secondary"
          onClick={() => fileInputRef.current?.click()}
          data-testid={`${testId}-button`}
        >
          Choose File
        </button>
        {selectedFile && (
          <span className="file-name" data-testid={`${testId}-filename`}>
            {selectedFile.name}
          </span>
        )}
      </div>

      {error && (
        <div className="file-error" data-testid={`${testId}-error`}>
          {error}
        </div>
      )}

      {selectedFile && !error && (
        <div className="file-info">
          <div className="file-details">
            <span>Size: {(selectedFile.size / 1024).toFixed(2)} KB</span>
            <button
              type="button"
              className="btn-remove"
              onClick={handleRemove}
              data-testid={`${testId}-remove`}
            >
              Remove
            </button>
          </div>
          {preview && (
            <img
              src={preview}
              alt="Preview"
              className="file-preview"
              data-testid={`${testId}-preview`}
            />
          )}
        </div>
      )}
    </div>
  );
};
