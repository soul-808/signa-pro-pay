// src/app/page.tsx
'use client';

import { useState, ChangeEvent } from 'react';

export default function Home() {
  const [file, setFile] = useState<File | null>(null);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const uploadFile = async () => {
    if (!file) return alert('Please select a file');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '' },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        alert('File uploaded successfully');
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      alert(`Upload failed: ${error}`);
    }
  };

  return (
    <div>
      <h1>Signa-Pro-Pay Transaction Uploader</h1>
      <input type="file" onChange={handleFileChange} />
      <button onClick={uploadFile}>Upload</button>
    </div>
  );
}
