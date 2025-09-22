"use client";

import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  TextField,
  Typography,
  Avatar,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SearchIcon from "@mui/icons-material/Search";
import { useMemo, useState } from "react";

export type MenuOption = {
  id: string;
  name: string;
  price: number; // raw price number
  imageUrl?: string;
};

type Props = {
  open: boolean;
  title?: string;
  options?: MenuOption[];
  onClose: () => void;
  onSelect: (option: MenuOption) => void;
};

export default function MenuSelectDialog({ open, title = "메뉴 선택", options, onClose, onSelect }: Props) {
  const [query, setQuery] = useState("");

  const items = useMemo<MenuOption[]>(
    () =>
      options ?? [
        { id: "1", name: "모츠나베", price: 31000 },
        { id: "2", name: "모츠나베+꼬치 6종 세트", price: 29000 },
        { id: "3", name: "쿠시카츠세트(튀김꼬치)", price: 25700 },
      ],
    [options]
  );

  const filtered = useMemo(
    () => items.filter((i) => i.name.toLowerCase().includes(query.trim().toLowerCase())),
    [items, query]
  );

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth PaperProps={{ sx: { borderRadius: 2 } }}>
      <DialogTitle sx={{ p: 2.5, borderBottom: "1px solid #E5E7EB" }}>
        <Stack direction="row" alignItems="center" justifyContent="space-between">
          <Typography sx={{ fontSize: 18, fontWeight: 600, color: "#374151" }}>{title}</Typography>
          <IconButton onClick={onClose} size="small">
            <CloseIcon />
          </IconButton>
        </Stack>
      </DialogTitle>
      <DialogContent sx={{ p: 2.5 }}>
        <TextField
          autoFocus
          placeholder="메뉴명을 검색하세요"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          fullWidth
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon sx={{ color: "#9CA3AF" }} />
              </InputAdornment>
            ),
          }}
        />
        <List sx={{ mt: 1 }}>
          {filtered.map((item) => (
            <ListItem
              key={item.id}
              divider
              secondaryAction={
                <Button
                  size="small"
                  variant="contained"
                  onClick={() => onSelect(item)}
                  sx={{ textTransform: "none", bgcolor: "#226BEF", "&:hover": { bgcolor: "#1D5BB8" } }}
                >
                  선택
                </Button>
              }
            >
              <ListItemAvatar>
                <Avatar
                  variant="rounded"
                  sx={{ width: 40, height: 40, bgcolor: "#E5E7EB" }}
                  src={item.imageUrl ?? ""}
                />
              </ListItemAvatar>
              <ListItemText
                primary={
                  <Typography sx={{ fontSize: 14, color: "#111827" }}>{item.name}</Typography>
                }
                secondary={
                  <Typography sx={{ fontSize: 12, color: "#6B7280" }}>{item.price.toLocaleString()}원</Typography>
                }
              />
            </ListItem>
          ))}
          {filtered.length === 0 && (
            <Box sx={{ py: 4, textAlign: "center", color: "#6B7280" }}>검색 결과가 없습니다.</Box>
          )}
        </List>
      </DialogContent>
      <DialogActions sx={{ p: 2.5, borderTop: "1px solid #F3F4F6" }}>
        <Button onClick={onClose} variant="outlined" sx={{ textTransform: "none", borderColor: "#E5E7EB", color: "#374151" }}>
          닫기
        </Button>
      </DialogActions>
    </Dialog>
  );
}


