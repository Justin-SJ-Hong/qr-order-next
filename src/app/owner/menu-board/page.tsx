"use client";

import {
  Box,
  Button,
  Chip,
  Stack,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Paper,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Checkbox,
} from "@mui/material";
import {
  DragIndicator as DragIndicatorIcon,
  Close as CloseIcon,
  Add as AddIcon,
  Check as CheckIcon,
  Search as SearchIcon,
  Delete as DeleteIcon,
} from "@mui/icons-material";
import { useState } from "react";

type MenuItem = {
  id: string;
  name: string;
  price: string;
  image?: string;
  isPopular?: boolean;
};

type Category = {
  id: string;
  name: string;
  items: MenuItem[];
};

const initialCategories: Category[] = [
  {
    id: "1",
    name: "추천메뉴",
    items: [
      { id: "1", name: "메뉴명", price: "5,600원", isPopular: true },
      { id: "2", name: "메뉴명", price: "5,600원" },
      { id: "3", name: "메뉴명", price: "5,600원" },
      { id: "4", name: "메뉴명", price: "5,600원" },
      { id: "5", name: "메뉴명", price: "5,600원" },
    ],
  },
  {
    id: "2",
    name: "나베세트",
    items: [],
  },
];

// Available menu items for adding to categories
const availableMenuItems: MenuItem[] = [
  { id: "menu1", name: "메뉴명", price: "5,600원" },
  { id: "menu2", name: "메뉴명", price: "5,600원" },
  { id: "menu3", name: "메뉴명", price: "5,600원" },
  { id: "menu4", name: "메뉴명", price: "5,600원" },
  { id: "menu5", name: "메뉴명", price: "5,600원" },
];

export default function MenuBoardPage() {
  const [categories, setCategories] = useState(initialCategories);
  const [selectedCategoryId, setSelectedCategoryId] = useState("1");
  const [activeTab, setActiveTab] = useState("edit");
  const [addMenuModalOpen, setAddMenuModalOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMenuItems, setSelectedMenuItems] = useState<string[]>([]);
  const [staffCallItems, setStaffCallItems] = useState(["숟가락", "젓가락"]);

  const selectedCategory = categories.find((cat) => cat.id === selectedCategoryId);

  const handleCategoryNameChange = (categoryId: string, newName: string) => {
    setCategories((prev) =>
      prev.map((cat) => (cat.id === categoryId ? { ...cat, name: newName } : cat))
    );
  };

  const handleRemoveCategory = (categoryId: string) => {
    setCategories((prev) => {
      const filtered = prev.filter((cat) => cat.id !== categoryId);
      if (selectedCategoryId === categoryId && filtered.length > 0 && filtered[0]) {
        setSelectedCategoryId(filtered[0].id);
      }
      return filtered;
    });
  };

  const handleRemoveItem = (categoryId: string, itemId: string) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, items: cat.items.filter((item) => item.id !== itemId) } : cat
      )
    );
  };

  const handleMenuItemToggle = (itemId: string) => {
    setSelectedMenuItems((prev) =>
      prev.includes(itemId)
        ? prev.filter((id) => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleAddSelectedItems = () => {
    if (!selectedCategory) return;
    
    const itemsToAdd = availableMenuItems.filter((item) => selectedMenuItems.includes(item.id));
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === selectedCategoryId
          ? { ...cat, items: [...cat.items, ...itemsToAdd] }
          : cat
      )
    );
    
    setSelectedMenuItems([]);
    setAddMenuModalOpen(false);
  };

  const filteredMenuItems = availableMenuItems.filter((item) =>
    item.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleAddStaffCallItem = () => {
    const newItem = `새 항목 ${staffCallItems.length + 1}`;
    setStaffCallItems([...staffCallItems, newItem]);
  };

  const handleRemoveStaffCallItem = (index: number) => {
    setStaffCallItems(staffCallItems.filter((_, i) => i !== index));
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh", width: "100%", bgcolor: "#F9FAFB" }}>
      {/* Main Content (sidebar moved to layout.tsx) */}
      <Box sx={{ flex: 1, p: "28px 48px" }}>
        {/* Header */}
        <Stack spacing={2.5}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography sx={{ fontSize: 24, fontWeight: 700, color: "#374151" }}>
              메뉴판 편집
            </Typography>
            <Stack direction="row" spacing={1.5}>
              <Button
                variant="contained"
                sx={{
                  bgcolor: "#F3F4F6",
                  color: "#374151",
                  textTransform: "none",
                  height: 40,
                  px: 2,
                  "&:hover": { bgcolor: "#E5E7EB" },
                }}
              >
                미리보기
              </Button>
              <Button
                variant="contained"
                startIcon={<CheckIcon />}
                sx={{
                  bgcolor: "#226BEF",
                  color: "white",
                  textTransform: "none",
                  height: 40,
                  px: 1.5,
                  "&:hover": { bgcolor: "#1D5BB8" },
                }}
              >
                적용하기
              </Button>
            </Stack>
          </Stack>

          {/* Tabs */}
          <Stack direction="row" spacing={5}>
            <Box
              sx={{
                pb: 1.5,
                borderBottom: activeTab === "edit" ? "2px solid #226BEF" : "2px solid transparent",
                cursor: "pointer",
              }}
              onClick={() => setActiveTab("edit")}
            >
              <Typography sx={{ 
                fontSize: 16, 
                fontWeight: activeTab === "edit" ? 600 : 400, 
                color: activeTab === "edit" ? "#226BEF" : "#374151" 
              }}>
                메뉴판 편집
              </Typography>
            </Box>
            <Box
              sx={{
                pb: 1.5,
                borderBottom: activeTab === "staff" ? "2px solid #226BEF" : "2px solid transparent",
                cursor: "pointer",
              }}
              onClick={() => setActiveTab("staff")}
            >
              <Typography sx={{ 
                fontSize: 16, 
                fontWeight: activeTab === "staff" ? 600 : 400, 
                color: activeTab === "staff" ? "#226BEF" : "#374151" 
              }}>
                직원 호출
              </Typography>
            </Box>
          </Stack>

          {/* Content */}
          {activeTab === "edit" ? (
            <Box sx={{ display: "flex", gap: 2.5, flex: 1 }}>
              {/* Categories Sidebar */}
              <Box
                sx={{
                  width: 300,
                  borderRight: "1px solid #E5E7EB",
                  pr: 2.5,
                  pb: 2.5,
                }}
              >
                <Stack spacing={1.5}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#4B5563" }}>
                      카테고리
                    </Typography>
                    <Button
                      variant="outlined"
                      size="small"
                      startIcon={<AddIcon />}
                      sx={{
                        borderColor: "#E5E7EB",
                        color: "#374151",
                        textTransform: "none",
                        height: 32,
                        px: 1.5,
                        "&:hover": { borderColor: "#D1D5DB" },
                      }}
                    >
                      추가
                    </Button>
                  </Stack>

                  <Stack spacing={1}>
                    {categories.map((category) => (
                      <Box
                        key={category.id}
                        sx={{
                          p: 1.5,
                          borderRadius: 1,
                          cursor: "pointer",
                          bgcolor: selectedCategoryId === category.id ? "#E9F0FD" : "transparent",
                          border: selectedCategoryId === category.id ? "1px solid #226BEF" : "1px solid transparent",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                        onClick={() => setSelectedCategoryId(category.id)}
                      >
                        <Stack direction="row" alignItems="center" spacing={1}>
                          <DragIndicatorIcon sx={{ fontSize: 20, color: "#226BEF" }} />
                          <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#226BEF" }}>
                            {category.name}
                          </Typography>
                        </Stack>
                        <IconButton size="small" onClick={() => handleRemoveCategory(category.id)}>
                          <CloseIcon sx={{ fontSize: 20, color: "#9CA3AF" }} />
                        </IconButton>
                      </Box>
                    ))}
                  </Stack>
                </Stack>
              </Box>

              {/* Category Details */}
              <Box sx={{ flex: 1, pl: 2.5, pb: 2.5 }}>
                <Stack spacing={3.5}>
                  {/* Category Name */}
                  <Stack spacing={1.5}>
                    <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#4B5563" }}>
                      카테고리명
                    </Typography>
                    <TextField
                      value={selectedCategory?.name || ""}
                      onChange={(e) => selectedCategory && handleCategoryNameChange(selectedCategory.id, e.target.value)}
                      variant="outlined"
                      InputProps={{
                        endAdornment: (
                          <InputAdornment position="end">
                            <IconButton size="small">
                              <CloseIcon sx={{ fontSize: 20, color: "#D1D5DB" }} />
                            </IconButton>
                          </InputAdornment>
                        ),
                      }}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: 2,
                          "& fieldset": { borderColor: "#E5E7EB" },
                          "&:hover fieldset": { borderColor: "#D1D5DB" },
                          "&.Mui-focused fieldset": { borderColor: "#226BEF" },
                        },
                      }}
                    />
                  </Stack>

                  {/* Connected Menu Items */}
                  <Stack spacing={1.5}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center">
                      <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#4B5563" }}>
                        연결된 메뉴 {selectedCategory?.items.length || 0}개
                      </Typography>
                      <Button
                        variant="outlined"
                        size="small"
                        startIcon={<AddIcon />}
                        onClick={() => setAddMenuModalOpen(true)}
                        sx={{
                          borderColor: "#E5E7EB",
                          color: "#374151",
                          textTransform: "none",
                          height: 32,
                          px: 1.5,
                          "&:hover": { borderColor: "#D1D5DB" },
                        }}
                      >
                        추가
                      </Button>
                    </Stack>

                    {/* Menu Items Table */}
                    <TableContainer component={Paper} elevation={0} sx={{ border: "1px solid #E5E7EB" }}>
                      <Table>
                        <TableBody>
                          {selectedCategory?.items.map((item) => (
                            <TableRow key={item.id} sx={{ "&:last-child td, &:last-child th": { border: 0 } }}>
                              <TableCell sx={{ width: 52, borderColor: "#E5E7EB" }}>
                                <DragIndicatorIcon sx={{ fontSize: 20, color: "#6B7280" }} />
                              </TableCell>
                              <TableCell sx={{ borderColor: "#E5E7EB" }}>
                                <Stack direction="row" alignItems="center" spacing={1}>
                                  <Box
                                    sx={{
                                      width: 36,
                                      height: 36,
                                      bgcolor: "#D9D9D9",
                                      borderRadius: 0.5,
                                    }}
                                  />
                                  <Stack>
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
                                      <Typography sx={{ fontSize: 14, color: "#374151" }}>
                                        {item.name}
                                      </Typography>
                                    </Stack>
                                    <Typography sx={{ fontSize: 12, color: "#6B7280" }}>
                                      {item.price}
                                    </Typography>
                                  </Stack>
                                </Stack>
                              </TableCell>
                              <TableCell sx={{ width: 52, borderColor: "#E5E7EB" }}>
                                <IconButton size="small" onClick={() => selectedCategory && handleRemoveItem(selectedCategory.id, item.id)}>
                                  <CloseIcon sx={{ fontSize: 20, color: "#9CA3AF" }} />
                                </IconButton>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Stack>
                </Stack>
              </Box>
            </Box>
          ) : (
            /* Staff Call Content */
            <Box sx={{ flex: 1, pb: 2.5 }}>
              <Stack spacing={3}>
                {/* Call List Header */}
                <Stack direction="row" justifyContent="space-between" alignItems="center">
                  <Typography sx={{ fontSize: 14, fontWeight: 600, color: "#4B5563" }}>
                    호출 목록
                  </Typography>
                  <Button
                    variant="outlined"
                    size="small"
                    startIcon={<AddIcon />}
                    onClick={handleAddStaffCallItem}
                    sx={{
                      borderColor: "#E5E7EB",
                      color: "#374151",
                      textTransform: "none",
                      height: 32,
                      px: 1.5,
                      "&:hover": { borderColor: "#D1D5DB" },
                    }}
                  >
                    추가
                  </Button>
                </Stack>

                {/* Staff Call Items */}
                <Stack spacing={1.5}>
                  {staffCallItems.map((item, index) => (
                    <Stack key={index} direction="row" spacing={1}>
                      <TextField
                        value={item}
                        onChange={(e) => {
                          const newItems = [...staffCallItems];
                          newItems[index] = e.target.value;
                          setStaffCallItems(newItems);
                        }}
                        variant="outlined"
                        sx={{
                          flex: 1,
                          "& .MuiOutlinedInput-root": {
                            height: 48,
                            "& fieldset": { borderColor: "#E5E7EB" },
                            "&:hover fieldset": { borderColor: "#D1D5DB" },
                            "&.Mui-focused fieldset": { borderColor: "#226BEF" },
                          },
                        }}
                      />
                      <IconButton
                        onClick={() => handleRemoveStaffCallItem(index)}
                        sx={{
                          width: 48,
                          height: 48,
                          bgcolor: "#F3F4F6",
                          "&:hover": { bgcolor: "#E5E7EB" },
                        }}
                      >
                        <DeleteIcon sx={{ fontSize: 20, color: "#6B7280" }} />
                      </IconButton>
                    </Stack>
                  ))}
                </Stack>
              </Stack>
            </Box>
          )}
        </Stack>
      </Box>

      {/* Add Menu Modal */}
      <Dialog
        open={addMenuModalOpen}
        onClose={() => setAddMenuModalOpen(false)}
        maxWidth={false}
        PaperProps={{
          sx: {
            width: 414,
            borderRadius: 3,
            overflow: "hidden"
          }
        }}
      >
        <DialogTitle sx={{ p: "20px 21px", borderBottom: "1px solid #E5E7EB" }}>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography sx={{ fontSize: 20, fontWeight: 600, color: "#374151" }}>
              메뉴 불러오기
            </Typography>
            <IconButton onClick={() => setAddMenuModalOpen(false)}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </DialogTitle>

        <DialogContent sx={{ p: "20px" }}>
          <Stack spacing={3}>
            {/* Search and Add Button */}
            <Stack direction="row" spacing={1.5}>
              <TextField
                placeholder="메뉴명으로 검색"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                sx={{ flex: 1 }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchIcon sx={{ color: "#9CA3AF" }} />
                    </InputAdornment>
                  ),
                }}
              />
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                sx={{
                  bgcolor: "#E9F0FD",
                  color: "#226BEF",
                  textTransform: "none",
                  height: 40,
                  px: 1.5,
                  "&:hover": { bgcolor: "#D6E5FD" },
                }}
              >
                새 메뉴 추가
              </Button>
            </Stack>

            {/* Menu Items Table */}
            <Box sx={{ border: "1px solid #E5E7EB", borderRadius: 1 }}>
              {/* Table Header */}
              <Stack direction="row" sx={{ bgcolor: "#F9FAFB", borderBottom: "1px solid #E5E7EB" }}>
                <Box sx={{ flex: 1, p: "0px 12px", height: 60, display: "flex", alignItems: "center" }}>
                  <Typography sx={{ fontSize: 12, fontWeight: 600, color: "#6B7280" }}>
                    메뉴
                  </Typography>
                </Box>
                <Box sx={{ width: 52, height: 60, display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <Checkbox
                    size="small"
                    sx={{ color: "#D1D5DB" }}
                  />
                </Box>
              </Stack>

              {/* Table Body */}
              <Stack>
                {filteredMenuItems.map((item) => (
                  <Stack key={item.id} direction="row" sx={{ borderBottom: "1px solid #E5E7EB" }}>
                    <Box sx={{ flex: 1, p: "12px 16px", height: 68, display: "flex", alignItems: "center", gap: 1.5 }}>
                      <Box
                        sx={{
                          width: 36,
                          height: 36,
                          bgcolor: "#D9D9D9",
                          borderRadius: 0.5,
                        }}
                      />
                      <Stack>
                        <Typography sx={{ fontSize: 14, color: "#374151" }}>
                          {item.name}
                        </Typography>
                        <Typography sx={{ fontSize: 12, color: "#6B7280" }}>
                          {item.price}
                        </Typography>
                      </Stack>
                    </Box>
                    <Box sx={{ width: 52, height: 68, display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Checkbox
                        size="small"
                        checked={selectedMenuItems.includes(item.id)}
                        onChange={() => handleMenuItemToggle(item.id)}
                        sx={{ color: "#D1D5DB" }}
                      />
                    </Box>
                  </Stack>
                ))}
              </Stack>
            </Box>
          </Stack>
        </DialogContent>

        <DialogActions sx={{ p: "20px 21px", gap: 1.5, borderTop: "1px solid #E5E7EB" }}>
          <Button
            variant="contained"
            onClick={() => setAddMenuModalOpen(false)}
            sx={{
              bgcolor: "#F3F4F6",
              color: "#374151",
              textTransform: "none",
              height: 40,
              px: 1.5,
              "&:hover": { bgcolor: "#E5E7EB" },
            }}
          >
            취소
          </Button>
          <Button
            variant="contained"
            onClick={handleAddSelectedItems}
            disabled={selectedMenuItems.length === 0}
            sx={{
              bgcolor: "#226BEF",
              color: "white",
              textTransform: "none",
              height: 40,
              px: 1.5,
              "&:hover": { bgcolor: "#1D5BB8" },
              "&:disabled": { bgcolor: "#E5E7EB", color: "#9CA3AF" },
            }}
          >
            불러오기
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
