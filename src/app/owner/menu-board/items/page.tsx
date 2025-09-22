"use client";

import {
  Box,
  Button,
  Chip,
  Divider,
  IconButton,
  InputAdornment,
  Paper,
  Stack,
  Switch,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
  Menu,
  MenuItem,
} from "@mui/material";
import {
  Add as AddIcon,
  Search as SearchIcon,
  MoreVert as MoreVertIcon,
} from "@mui/icons-material";
import { useMemo, useState } from "react";
import MenuItemDialog from "@/components/MenuItemDialog";

type MenuItem = {
  id: string;
  name: string;
  price: string;
  isPopular?: boolean;
  soldOut: boolean;
  hidden: boolean;
};

const initialItems: MenuItem[] = [
  { id: "1", name: "메뉴명", price: "5,600원", isPopular: true, soldOut: false, hidden: false },
  { id: "2", name: "메뉴명", price: "5,600원", soldOut: false, hidden: false },
  { id: "3", name: "메뉴명", price: "5,600원", soldOut: true, hidden: false },
  { id: "4", name: "메뉴명", price: "5,600원", soldOut: false, hidden: true },
];

export default function MenuItemsPage() {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<MenuItem[]>(initialItems);
  const [tag, setTag] = useState<"all" | "onSale" | "soldOut" | "hidden">("all");
  const [addOpen, setAddOpen] = useState(false);
  const [newName, setNewName] = useState("");
  const [newPrice, setNewPrice] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [menuAnchorEl, setMenuAnchorEl] = useState<null | HTMLElement>(null);
  const [menuTargetId, setMenuTargetId] = useState<string | null>(null);
  const [editingId, setEditingId] = useState<string | null>(null);

  const filtered = useMemo(() => {
    const byQuery = items.filter(
      (i) => i.name.toLowerCase().includes(query.toLowerCase()) || i.price.includes(query)
    );
    switch (tag) {
      case "onSale":
        return byQuery.filter((i) => !i.soldOut && !i.hidden);
      case "soldOut":
        return byQuery.filter((i) => i.soldOut);
      case "hidden":
        return byQuery.filter((i) => i.hidden);
      default:
        return byQuery;
    }
  }, [items, query, tag]);

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", width: "100%", bgcolor: "#F9FAFB" }}>
      <Box sx={{ flex: 1, p: "28px 48px" }}>
        <Stack spacing={2.5}>
          {/* Header */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Stack direction="row" spacing={5} alignItems="center">
                <Typography sx={{ fontSize: 24, fontWeight: 700, color: "#374151" }}>
                    메뉴 관리
                </Typography>
                <TextField
                    placeholder="메뉴명으로 검색"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    sx={{ width: 274 }}
                    InputProps={{
                        startAdornment: (
                        <InputAdornment position="start">
                            <SearchIcon sx={{ color: "#9CA3AF" }} />
                        </InputAdornment>
                        ),
                    }}
                />
            </Stack>
            <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={() => {
                  setEditingId(null);
                  setNewName("");
                  setNewDescription("");
                  setNewPrice("");
                  setAddOpen(true);
                }}
                sx={{ bgcolor: "#226BEF", color: "white", textTransform: "none", height: 40, px: 1.5, "&:hover": { bgcolor: "#1D5BB8" } }}
            >
                메뉴 추가
            </Button>
          </Stack>

          {/* Tools */}
          

          {/* Tag filters */}
          <Stack direction="row" spacing={1.5}>
            <Button variant={tag === "all" ? "outlined" : "outlined"} onClick={() => setTag("all")} sx={{
              borderColor: tag === "all" ? "#226BEF" : "#E5E7EB",
              color: tag === "all" ? "#226BEF" : "#4B5563",
              textTransform: "none",
              height: 40,
              px: 1.75,
            }}>전체</Button>
            <Button variant="outlined" onClick={() => setTag("onSale")} sx={{
              borderColor: tag === "onSale" ? "#226BEF" : "#E5E7EB",
              color: tag === "onSale" ? "#226BEF" : "#4B5563",
              textTransform: "none",
              height: 40,
              px: 1.75,
            }}>판매중</Button>
            <Button variant="outlined" onClick={() => setTag("soldOut")} sx={{
              borderColor: tag === "soldOut" ? "#226BEF" : "#E5E7EB",
              color: tag === "soldOut" ? "#226BEF" : "#4B5563",
              textTransform: "none",
              height: 40,
              px: 1.75,
            }}>품절</Button>
            <Button variant="outlined" onClick={() => setTag("hidden")} sx={{
              borderColor: tag === "hidden" ? "#226BEF" : "#E5E7EB",
              color: tag === "hidden" ? "#226BEF" : "#4B5563",
              textTransform: "none",
              height: 40,
              px: 1.75,
            }}>숨김</Button>
          </Stack>

          {/* Table */}
          <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #E5E7EB" }}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell sx={{ bgcolor: "#F9FAFB", borderColor: "#E5E7EB", width: 68 }} />
                  <TableCell sx={{ bgcolor: "#F9FAFB", borderColor: "#E5E7EB" }}>
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#6B7280" }}>
                      메뉴 (총 {filtered.length}개)
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ bgcolor: "#F9FAFB", borderColor: "#E5E7EB", width: 120 }}>
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#6B7280" }}>
                      품절표시
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ bgcolor: "#F9FAFB", borderColor: "#E5E7EB", width: 120 }}>
                    <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#6B7280" }}>
                      숨기기
                    </Typography>
                  </TableCell>
                  <TableCell sx={{ bgcolor: "#F9FAFB", borderColor: "#E5E7EB", width: 80 }} />
                </TableRow>
              </TableHead>
              <TableBody>
                {filtered.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell sx={{ borderColor: "#E5E7EB" }}>
                      <Box sx={{ width: 36, height: 36, bgcolor: "#D9D9D9", borderRadius: 0.5 }} />
                    </TableCell>
                    <TableCell sx={{ borderColor: "#E5E7EB" }}>
                      <Stack spacing={0.5}>
                        <Stack direction="row" alignItems="center" spacing={1}>
                          {item.isPopular && (
                            <Chip
                              label="인기"
                              size="small"
                              sx={{
                                height: 16,
                                fontSize: 10,
                                fontWeight: 600,
                                bgcolor: "#E5E7EB",
                                color: "#6B7280",
                              }}
                            />
                          )}
                          <Typography sx={{ fontSize: 14, color: "#374151" }}>{item.name}</Typography>
                        </Stack>
                        <Typography sx={{ fontSize: 12, color: "#6B7280" }}>{item.price}</Typography>
                      </Stack>
                    </TableCell>
                    <TableCell sx={{ borderColor: "#E5E7EB" }}>
                      <Switch
                        size="small"
                        checked={item.soldOut}
                        onChange={(e) =>
                          setItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, soldOut: e.target.checked } : it)))
                        }
                      />
                    </TableCell>
                    <TableCell sx={{ borderColor: "#E5E7EB" }}>
                      <Switch
                        size="small"
                        checked={item.hidden}
                        onChange={(e) =>
                          setItems((prev) => prev.map((it) => (it.id === item.id ? { ...it, hidden: e.target.checked } : it)))
                        }
                      />
                    </TableCell>
                    <TableCell sx={{ borderColor: "#E5E7EB" }}>
                      <IconButton
                        sx={{ bgcolor: "#F3F4F6", "&:hover": { bgcolor: "#E5E7EB" } }}
                        onClick={(e) => {
                          setMenuAnchorEl(e.currentTarget);
                          setMenuTargetId(item.id);
                        }}
                      >
                        <MoreVertIcon sx={{ fontSize: 18, color: "#374151" }} />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Divider sx={{ borderColor: "#E5E7EB" }} />

          {/* Footer spacer */}
          <Box />
        </Stack>

        {/* 메뉴 추가/설정 다이얼로그 */}
        <MenuItemDialog
          open={addOpen}
          isEdit={Boolean(editingId)}
          name={newName}
          description={newDescription}
          price={newPrice}
          onChangeName={setNewName}
          onChangeDescription={setNewDescription}
          onChangePrice={setNewPrice}
          onClose={() => setAddOpen(false)}
          onSubmit={() => {
            if (!newName.trim()) return;
            if (editingId) {
              setItems((prev) =>
                prev.map((it) =>
                  it.id === editingId ? { ...it, name: newName.trim(), price: newPrice.trim() || "0원" } : it
                )
              );
            } else {
              const newItem: MenuItem = {
                id: String(Date.now()),
                name: newName.trim(),
                price: newPrice.trim() || "0원",
                isPopular: false,
                soldOut: false,
                hidden: false,
              };
              setItems((prev) => [newItem, ...prev]);
            }
            setAddOpen(false);
            setEditingId(null);
            setNewName("");
            setNewDescription("");
            setNewPrice("");
          }}
        />

        {/* 행 메뉴 (수정/삭제) */}
        <Menu
          anchorEl={menuAnchorEl}
          open={Boolean(menuAnchorEl)}
          onClose={() => setMenuAnchorEl(null)}
        >
          <MenuItem
            onClick={() => {
              if (!menuTargetId) return;
              const target = items.find((i) => i.id === menuTargetId);
              if (target) {
                setEditingId(target.id);
                setNewName(target.name);
                setNewPrice(target.price);
                setAddOpen(true);
              }
              setMenuAnchorEl(null);
            }}
          >
            수정
          </MenuItem>
          <MenuItem
            onClick={() => {
              if (!menuTargetId) return;
              setItems((prev) => prev.filter((i) => i.id !== menuTargetId));
              setMenuAnchorEl(null);
            }}
          >
            삭제
          </MenuItem>
        </Menu>
      </Box>
    </Box>
  );
}

// Modal JSX appended at the end of main Box above


