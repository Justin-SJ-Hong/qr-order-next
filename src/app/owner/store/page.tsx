"use client";

import React, { useState, useEffect } from "react";
import {
  Box,
  Paper,
  Stack,
  Typography,
  TextField,
  Button,
  Divider,
} from "@mui/material";
import AvatarPicker from "@/components/AvatarPicker";
import { supabaseBrowser } from "@/lib/supabase/client";
import { useRegisterStore } from "@/store/register";

export default function StorePage() {
  const { hydrateFromServer } = useRegisterStore.getState()

  useEffect(() => {
    (async () => {
      const { data: { user } } = await supabaseBrowser.auth.getUser()
      if (!user) return
      const { data: profile } = await supabaseBrowser
        .from('profile')
        .select('id,name,email,avatar_path')
        .eq('id', user.id)
        .single()
      const base = `${process.env.NEXT_PUBLIC_SUPABASE_URL}/storage/v1/object/public/avatars/`
      const avatar_url = profile?.avatar_path ? `${base}${profile.avatar_path}` : undefined
      hydrateFromServer({
        id: user.id,
        name: profile?.name ?? (user.email?.split('@')[0] ?? 'User'),
        email: profile?.email ?? (user.email ?? ''),
        ...(avatar_url ? { avatar_url } : {}),
      })
    })()
  }, [hydrateFromServer])

  const {
    user,
    updateProfile,
    changePassword,
    deleteAccount,
    loading,
  } = useRegisterStore();

  const [name, setName] = useState<string>(user?.name || "");
  const [role] = useState<string>("OWNER");
  const [newPassword, setNewPassword] = useState<string>("");

  const onSaveProfile = async () => {
    await updateProfile({ name, role: role as "OWNER" | "MANAGER" });
  };

  const onChangePassword = async () => {
    if (!newPassword) return;
    await changePassword(newPassword);
    setNewPassword("");
  };

  const onDelete = async () => {
    if (!confirm("정말 탈퇴하시겠습니까? 이 작업은 되돌릴 수 없습니다."))
      return;
    await deleteAccount();
  };

  return (
    <Box sx={{ maxWidth: 640, mx: "auto", py: 4 }}>
      <Paper sx={{ p: 3 }}>
        <Typography variant="h5" fontWeight="bold" gutterBottom>
          내 프로필 설정
        </Typography>

        <Stack spacing={3}>
          <Stack direction="row" spacing={2} alignItems="center">
            {/* <Avatar src={user?.avatar_url || ""} sx={{ width: 72, height: 72 }} component="img" /> */}
            <Box>
              <Typography variant="body2" color="text.secondary">
                아바타 변경
              </Typography>
              <AvatarPicker name="avatar" currentAvatarUrl={user?.avatar_url || ""} />
            </Box>
          </Stack>

          <Divider />

          <Stack spacing={2}>
            <Typography variant="subtitle1">기본 정보</Typography>
            <TextField
              label="이름"
              value={name}
              onChange={(e) => setName(e.target.value)}
              fullWidth
            />
            <Button
              variant="contained"
              onClick={onSaveProfile}
              disabled={loading}
            >
              정보 저장
            </Button>
          </Stack>

          <Divider />

          <Stack spacing={2}>
            <Typography variant="subtitle1">비밀번호 변경</Typography>
            <TextField
              type="password"
              label="새 비밀번호"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              fullWidth
            />
            <Button
              variant="contained"
              onClick={onChangePassword}
              disabled={loading || !newPassword}
            >
              비밀번호 변경
            </Button>
          </Stack>

          <Divider />

          <Stack spacing={1}>
            <Typography variant="subtitle1" color="error">
              계정 탈퇴
            </Typography>
            <Button
              color="error"
              variant="outlined"
              onClick={onDelete}
              disabled={loading}
            >
              탈퇴하기
            </Button>
          </Stack>
        </Stack>
      </Paper>
    </Box>
  );
}
