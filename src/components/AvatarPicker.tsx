"use client";

import React, { useState, useRef, useEffect } from 'react';
import { useRegisterStore } from '@/store/register';
import { useRouter } from 'next/navigation';
import { Box, Button, Avatar, Typography, IconButton } from '@mui/material';
import { PhotoCamera, Delete } from '@mui/icons-material';

interface AvatarUploadProps {
  // onAvatarChange: (file: File | null) => void;
  name?: string; // <- form field name
  currentAvatarUrl?: string;
}

export default function AvatarPicker({ 
  // onAvatarChange, 
  name = 'avatar',
  currentAvatarUrl 
}: AvatarUploadProps) {
  const [previewUrl, setPreviewUrl] = useState<string | null>(currentAvatarUrl || null);
  const { updateAvatar, removeAvatar } = useRegisterStore();
  const router = useRouter();

  useEffect(() => {
    setPreviewUrl(currentAvatarUrl || null);
  }, [currentAvatarUrl]);

  const fileInputRef = useRef<HTMLInputElement | null>(null)

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // 파일 타입 검증
    if (!file.type.startsWith('image/')) {
      alert('이미지 파일만 업로드 가능합니다.');
      e.target.value = ''
      return;
    }

    // 파일 크기 검증 (5MB 제한)
    if (file.size > 5 * 1024 * 1024) {
      alert('파일 크기는 5MB 이하여야 합니다.');
      e.target.value = ''
      return;
    }

    // 미리보기 URL 생성
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    try {
      await updateAvatar(file);
      router.refresh();
    } catch (err) {
      console.error('Avatar upload failed:', err);
      setPreviewUrl(currentAvatarUrl || null);
      e.currentTarget.value = '';
      alert('아바타 업로드에 실패했습니다. 다시 시도해 주세요.');
      return;
    }

    console.log("📁 File selected:", {
      name: file.name,
      size: file.size,
      type: file.type
    });
  };

  const handleRemoveAvatar = async () => {
    setPreviewUrl(null);
    // onAvatarChange(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '' // 실제 form input 리셋
    }
    try {
      await removeAvatar();
      setPreviewUrl(null);
      router.refresh();
    } catch (e) {
      // no-op UI here; errors can be surfaced by page-level toasts if desired
      console.error("Error removing avatar:", e);
    }
  };

  return (
    <Box display="flex" flexDirection="column" alignItems="center" gap={2}>
      <Avatar
        src={previewUrl || ''}
        sx={{ width: 100, height: 100, border: '2px solid #ddd' }}
      />
      
      <Box display="flex" gap={1}>
        <Button
          variant="outlined"
          component="label"
          startIcon={<PhotoCamera />}
          size="small"
        >
          아바타 선택
          <input
            ref={fileInputRef}
            type="file"
            hidden
            name={name}
            accept="image/jpeg,image/jpg,image/png,image/webp"
            onChange={handleFileChange}
          />
        </Button>
        
        {previewUrl && (
          <IconButton 
            color="error" 
            onClick={handleRemoveAvatar}
            title="아바타 제거"
            size="small"
          >
            <Delete />
          </IconButton>
        )}
      </Box>
      
      <Typography variant="caption" color="text.secondary">
        JPG, PNG 파일만 가능 (최대 5MB)
      </Typography>
    </Box>
  );
}