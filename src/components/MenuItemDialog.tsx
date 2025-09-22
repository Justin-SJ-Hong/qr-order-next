"use client";

import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
  Typography,
  IconButton,
  TextField,
  Button,
  Box
} from "@mui/material";
import { Close as CloseIcon, EditOutlined as EditOutlinedIcon } from "@mui/icons-material";
import { useState } from "react";

type Props = {
  open: boolean;
  isEdit: boolean;
  name: string;
  description: string;
  price: string;
  onChangeName: (v: string) => void;
  onChangeDescription: (v: string) => void;
  onChangePrice: (v: string) => void;
  onClose: () => void;
  onSubmit: () => void;
};

export default function MenuItemDialog({
  open,
  isEdit,
  name,
  description,
  price,
  onChangeName,
  onChangeDescription,
  onChangePrice,
  onClose,
  onSubmit,
}: Props) {
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0] || null;
    if (file) {
      const url = URL.createObjectURL(file);
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      PaperProps={{ sx: { width: 414, borderRadius: 3 } }}
    >
      <DialogTitle sx={{ p: "20px 21px", borderBottom: "1px solid #E5E7EB" }}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography sx={{ fontSize: 20, fontWeight: 600, color: "#374151" }}>{isEdit ? "메뉴 설정" : "메뉴 추가"}</Typography>
          <IconButton onClick={onClose}>
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ p: "20px" }}>
        <Stack spacing={2}>
          {/* Image uploader */}
          <Stack spacing={1}>
            <Stack direction="row" alignItems="center" spacing={1}>
              <Box sx={{ width: 100, height: 100, bgcolor: "#F3F4F6", borderRadius: 2, position: "relative", overflow: "hidden" }}>
                {imagePreview && (
                  <Box 
                    component="img" 
                    src={imagePreview} 
                    alt="preview" 
                    sx={{ width: "100%", height: "100%", objectFit: "cover" }} 
                  />
                )}
                <input
                  id="menu-item-image-input"
                  type="file"
                  accept="image/*"
                  style={{ display: "none" }}
                  onChange={handleImageChange}
                />
                <IconButton
                  onClick={() => {
                    const input = document.getElementById("menu-item-image-input") as HTMLInputElement | null;
                    input?.click();
                  }}
                  sx={{
                    position: "absolute",
                    top: "80%",
                    left: "80%",
                    transform: "translate(-50%, -50%)",
                    width: 32,
                    height: 32,
                    bgcolor: "#FFFFFF",
                    border: "1px solid #E5E7EB",
                    boxShadow: 1,
                    "&:hover": { bgcolor: "#F9FAFB" },
                  }}
                >
                  <EditOutlinedIcon sx={{ fontSize: 18, color: "#226BEF" }} />
                </IconButton>
              </Box>
            </Stack>
          </Stack>
          <TextField
            label="메뉴명"
            value={name}
            onChange={(e) => onChangeName(e.target.value)}
            InputLabelProps={{ shrink: true }}
          />
          <TextField
            label="구성 및 설명"
            value={description}
            onChange={(e) => onChangeDescription(e.target.value)}
            placeholder="메뉴에 대한 간단한 설명을 입력하세요"
            InputLabelProps={{ shrink: true }}
            multiline
            minRows={2}
          />
          <TextField
            label="가격"
            value={price}
            onChange={(e) => onChangePrice(e.target.value)}
            placeholder="5,600원"
            InputLabelProps={{ shrink: true }}
          />
        </Stack>
      </DialogContent>
      <DialogActions sx={{ p: "20px 21px", gap: 1.5, borderTop: "1px solid #F3F4F6" }}>
        <Button
          variant="contained"
          onClick={onClose}
          sx={{ bgcolor: "#F3F4F6", color: "#374151", textTransform: "none", height: 40, px: 1.5, boxShadow: "none", "&:hover": { bgcolor: "#E5E7EB" } }}
        >
          취소
        </Button>
        <Button
          variant="contained"
          onClick={onSubmit}
          sx={{ bgcolor: "#226BEF", color: "white", textTransform: "none", height: 40, px: 1.5, boxShadow: "none", "&:hover": { bgcolor: "#1D5BB8" } }}
        >
          {isEdit ? "수정" : "추가"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}


