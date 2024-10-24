"use client";
import { createTheme } from '@mui/material/styles';
import Image from 'next/image'
import React, { useState, ChangeEvent, useEffect } from 'react';
import logo from '../assets/logo-1024x157.png';
import { ThemeProvider } from '@mui/material/styles';
import { Button, LinearProgress, Paper, Typography, Box } from '@mui/material';
import { Upload, CheckCircle } from 'lucide-react';
import GroupedTransactionsTable from '../components/GroupedTransactionsTable';
import { ITransaction } from '@/models/Transaction';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
      light: '#42a5f5',
      dark: '#1565c0',
    },
    secondary: {
      main: '#00796b',
      light: '#48a999',
      dark: '#004c40',
    },
    background: {
      default: '#f5f5f5',
      paper: '#ffffff',
    },
    text: {
      primary: '#333333',
      secondary: '#757575',
    },
  },
});





export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadComplete, setUploadComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [groupedTransactions, setGroupedTransactions] = useState<ITransaction[]>();


  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setUploadComplete(false);
    }
  };

  const uploadFile = async () => {
    if (!file) return alert('Please select a file');

    setUploading(true);
    setError(null);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Simulate progress
      const interval = setInterval(() => {
        setUploadProgress((prev) => {
          if (prev >= 100) {
            clearInterval(interval);
            return 100;
          }
          return prev + 10;
        });
      }, 500);

      console.log('@@@', process.env.NEXT_PUBLIC_API_KEY);

      const res = await fetch('/api/upload', {
        method: 'POST',
        headers: { 'x-api-key': process.env.NEXT_PUBLIC_API_KEY || '' },
        body: formData,
      });

      clearInterval(interval);
      setUploadProgress(100);
      setUploadComplete(true);

      const data = await res.json();
      if (!res.ok) {
        setError(`Error: ${data.error}`);
      }
      if (res.ok) {
        setTimeout(() => {
          setUploading(false);
          setUploadProgress(0);
        }, 1000);
      } else {
        throw new Error(data.error);
      }
    } catch (error) {
      setError(`Upload failed: ${error}`);
    } finally {
      setUploading(false);
      setUploadProgress(0);
    }
  };

  const fetchGroupedTransactions = async () => {
    try {
      const response = await fetch('/api/get-transactions');
      const data = await response.json();

      if (response.ok) {
        setGroupedTransactions(data.data);
      } else {
        console.error('Error:', data.error);
      }

      setGroupedTransactions(data.data);
    } catch (error) {
      console.error('Error fetching grouped transactions:', error);
    }
  };

  useEffect(() => {

    fetchGroupedTransactions();
  }, [, uploadComplete]);

  return (
    <ThemeProvider theme={theme}>
      <Box sx={{ minHeight: '100vh', bgcolor: 'background.default' }}>
        {/* Hero Section */}
        <Box sx={{
          background: `linear-gradient(to right, ${theme.palette.primary.main}, ${theme.palette.primary.dark})`,
          color: 'white',
          py: 8
        }}>
          <Box sx={{ maxWidth: 1200, mx: 'auto', px: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>

              <Image src={logo} alt="Signa-Pro-Pay Logo" />
            </Box>
            <Typography variant="h3" sx={{ mb: 2, fontWeight: 'bold' }}>
              Simple Payments, Beyond The Swipe
            </Typography>
            <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
              Transform your transaction management with powerful insights
            </Typography>
          </Box>
        </Box>

        {/* Upload Section */}
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: 4, mt: -4 }}>
          <Paper sx={{ p: 4, borderRadius: 2, boxShadow: 3 }}>
            <Box sx={{ textAlign: 'center', mb: 4 }}>
              <Typography variant="h5" sx={{ mb: 2 }}>
                Transaction Uploader
              </Typography>
              <Typography variant="body1" color="text.secondary">
                Upload your transaction file to begin analysis
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
              <input
                type="file"
                id="file-upload"
                style={{ display: 'none' }}
                onChange={handleFileChange}
              />
              <label htmlFor="file-upload">
                <Button
                  variant="outlined"
                  component="span"
                  startIcon={<Upload />}
                  sx={{ mb: 2 }}
                >
                  Select File
                </Button>
              </label>

              {file && (
                <Typography variant="body2" color="text.secondary">
                  Selected: {file.name}
                </Typography>
              )}

              <Button
                variant="contained"
                onClick={uploadFile}
                disabled={!file || uploading}
                startIcon={uploadComplete ? <CheckCircle /> : null}
                sx={{ width: 200 }}
                color={error ? 'error' : 'primary'}
              >
                {error ? 'Retry Upload' : uploadComplete ? 'Complete' : 'Upload File'}
              </Button>

              {uploading && (
                <Box sx={{ width: '100%', maxWidth: 400, mt: 2 }}>
                  <LinearProgress
                    variant="determinate"
                    value={uploadProgress}
                    sx={{ height: 8, borderRadius: 4 }}
                  />
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ textAlign: 'center', mt: 1 }}
                  >
                    {uploadProgress}% Complete
                  </Typography>
                </Box>
              )}
            </Box>
          </Paper>
        </Box>

        {/* Table Section */}
        <Box sx={{ maxWidth: 1200, mx: 'auto', px: 4, my: 4 }}>
          <GroupedTransactionsTable transactions={groupedTransactions} />
        </Box>
      </Box>
    </ThemeProvider>
  );
}