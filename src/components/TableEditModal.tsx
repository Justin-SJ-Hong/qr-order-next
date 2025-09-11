"use client";

import {
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Stack,
  Tab,
  Tabs,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import DeleteIcon from "@mui/icons-material/Delete";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import QrCodeIcon from "@mui/icons-material/QrCode";

interface TableEditModalProps {
  open: boolean;
  onClose: () => void;
}

const tabsData = [
  { label: "1층 홀", value: 0 },
  { label: "2층홀", value: 1 },
];

// 테이블 데이터 타입 정의
interface TableData {
  id: string;
  floor: string;
  isActive: boolean;
  orderItem?: string;
  quantity?: number;
  price?: string;
  time?: string;
  x: number;
  y: number;
  width: number;
  height: number;
}

// 샘플 테이블 데이터
const initialTables: TableData[] = [
  {
    id: "T-1",
    floor: "1층",
    isActive: true,
    orderItem: "나베세트",
    quantity: 1,
    price: "30,000원",
    time: "00:00",
    x: 0,
    y: 0,
    width: 190,
    height: 110,
  },
  {
    id: "T-2",
    floor: "1층",
    isActive: false,
    x: 0,
    y: 120,
    width: 190,
    height: 110,
  },
];

export default function TableEditModal({ open, onClose }: TableEditModalProps) {
  const [selectedTab, setSelectedTab] = useState(0);
  const [tables, setTables] = useState<TableData[]>(initialTables);
  const [selectedTable, setSelectedTable] = useState<TableData | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setSelectedTab(newValue);
  };

  const handleTableClick = (table: TableData) => {
    setSelectedTable(table);
    setIsEditing(true);
  };

  const handleAddTable = () => {
    const newTable: TableData = {
      id: `T-${tables.length + 1}`,
      floor: selectedTab === 0 ? "1층" : "2층",
      isActive: false,
      x: Math.random() * 800,
      y: Math.random() * 400,
      width: 190,
      height: 110,
    };
    setTables([...tables, newTable]);
  };

  const handleDeleteTable = () => {
    if (selectedTable) {
      setTables(tables.filter((table) => table.id !== selectedTable.id));
      setSelectedTable(null);
      setIsEditing(false);
    }
  };

  const handleDuplicateTable = () => {
    if (selectedTable) {
      const newTable: TableData = {
        ...selectedTable,
        id: `T-${tables.length + 1}`,
        x: selectedTable.x + 20,
        y: selectedTable.y + 20,
      };
      setTables([...tables, newTable]);
    }
  };

  const handleSave = () => {
    // 저장 로직 구현
    onClose();
  };

  const handleCancel = () => {
    setSelectedTable(null);
    setIsEditing(false);
    onClose();
  };

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={false}
      fullWidth
      PaperProps={{
        sx: {
          width: "100vw",
          height: "100vh",
          maxWidth: "100vw",
          maxHeight: "100vh",
          margin: 0,
          borderRadius: 0,
        },
      }}
    >
      <DialogContent sx={{ p: 0, height: "100vh", overflow: "hidden" }}>
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: "14px 20px",
              borderBottom: "1px solid #E5E7EB",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <IconButton onClick={onClose} size="small">
                <ArrowBackIcon />
              </IconButton>
              <Typography variant="h5" sx={{ fontWeight: 600 }}>
                테이블 편집
              </Typography>
            </Box>
            <Stack direction="row" spacing={1.5}>
              <Button
                variant="contained"
                onClick={handleCancel}
                sx={{
                  bgcolor: "white",
                  color: "black",
                  height: 40,
                  px: 2,
                  borderRadius: 1,
                  boxShadow: "none",
                  textTransform: "none",
                  border: "1px solid #E5E7EB",
                  "&:hover": {
                    bgcolor: "grey.50",
                    boxShadow: "none",
                  },
                }}
              >
                취소
              </Button>
              <Button
                variant="contained"
                onClick={handleSave}
                startIcon={<CheckIcon />}
                sx={{
                  bgcolor: "#226BEF",
                  color: "white",
                  height: 40,
                  px: 2,
                  borderRadius: 1,
                  boxShadow: "none",
                  textTransform: "none",
                  "&:hover": {
                    bgcolor: "#1E5BC6",
                    boxShadow: "none",
                  },
                }}
              >
                저장
              </Button>
            </Stack>
          </Box>

          {/* Content */}
          <Box sx={{ flex: 1, p: "28px 48px", bgcolor: "#F3F4F6" }}>
            <Stack spacing={2.5}>
              {/* Tabs and Add Button */}
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom: "1px solid #E5E7EB",
                  pb: 2,
                }}
              >
                <Tabs
                  value={selectedTab}
                  onChange={handleTabChange}
                  sx={{
                    "& .MuiTab-root": {
                      textTransform: "none",
                      minHeight: 48,
                      px: 1.5,
                      py: 1.5,
                    },
                    "& .Mui-selected": {
                      color: "#226BEF",
                      borderBottom: 2,
                      borderColor: "#226BEF",
                    },
                    "& .MuiTabs-indicator": {
                      display: "none",
                    },
                  }}
                >
                  {tabsData.map((tab) => (
                    <Tab
                      key={tab.value}
                      label={tab.label}
                      value={tab.value}
                      sx={{
                        color:
                          selectedTab === tab.value
                            ? "#226BEF"
                            : "#374151",
                        borderBottom: selectedTab === tab.value ? 2 : 0,
                        borderColor:
                          selectedTab === tab.value
                            ? "#226BEF"
                            : "transparent",
                      }}
                    />
                  ))}
                </Tabs>

                <Button
                  variant="contained"
                  startIcon={<AddIcon />}
                  onClick={handleAddTable}
                  sx={{
                    bgcolor: "white",
                    color: "black",
                    height: 40,
                    px: 2,
                    borderRadius: 1,
                    boxShadow: "none",
                    textTransform: "none",
                    border: "1px solid #E5E7EB",
                    "&:hover": {
                      bgcolor: "grey.50",
                      boxShadow: "none",
                    },
                  }}
                >
                  테이블 추가
                </Button>
              </Box>

              {/* Table Grid */}
              <Box
                sx={{
                  position: "relative",
                  width: "100%",
                  height: "500px",
                  bgcolor: "white",
                  borderRadius: 1,
                  overflow: "hidden",
                }}
              >
                {/* Grid Background */}
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundImage: `
                      linear-gradient(to right, #E4E6EA 1px, transparent 1px),
                      linear-gradient(to bottom, #E4E6EA 1px, transparent 1px)
                    `,
                    backgroundSize: "20px 20px",
                  }}
                />

                {/* Tables */}
                {tables
                  .filter((table) => table.floor === (selectedTab === 0 ? "1층" : "2층"))
                  .map((table) => (
                    <Box
                      key={table.id}
                      onClick={() => handleTableClick(table)}
                      sx={{
                        position: "absolute",
                        left: table.x,
                        top: table.y,
                        width: table.width,
                        height: table.height,
                        bgcolor: table.isActive ? "#226BEF" : "white",
                        border: table.isActive ? "none" : "2px solid #226BEF",
                        borderRadius: 1,
                        cursor: "pointer",
                        display: "flex",
                        flexDirection: "column",
                        p: 2,
                        "&:hover": {
                          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
                        },
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          color: table.isActive ? "white" : "#9CA3AF",
                          fontSize: "16px",
                        }}
                      >
                        {table.floor} {table.id}
                      </Typography>

                      {table.isActive && (
                        <>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "white",
                              fontSize: "16px",
                              mt: 1,
                            }}
                          >
                            {table.orderItem}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              color: "white",
                              fontSize: "16px",
                              position: "absolute",
                              top: 8,
                              right: 16,
                            }}
                          >
                            {table.time}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              color: "white",
                              fontSize: "16px",
                              position: "absolute",
                              top: 32,
                              right: 16,
                            }}
                          >
                            {table.quantity}
                          </Typography>

                          <Typography
                            variant="h6"
                            sx={{
                              color: "white",
                              fontSize: "16px",
                              fontWeight: 600,
                              position: "absolute",
                              bottom: 16,
                              right: 16,
                            }}
                          >
                            {table.price}
                          </Typography>
                        </>
                      )}
                    </Box>
                  ))}
              </Box>
            </Stack>
          </Box>

          {/* Table Edit Panel */}
          {isEditing && selectedTable && (
            <Box
              sx={{
                position: "absolute",
                right: 20,
                top: "50%",
                transform: "translateY(-50%)",
                width: 300,
                bgcolor: "white",
                borderRadius: 2,
                boxShadow: "0px 0px 8px rgba(0,0,0,0.15)",
                zIndex: 1000,
              }}
            >
              <Box sx={{ p: 2.5 }}>
                {/* Color Palette */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 2,
                  }}
                >
                  <Box sx={{ display: "flex", gap: 1 }}>
                    {["#226BEF", "#F78700", "#EF3322", "#AA0FD4"].map((color) => (
                      <Box
                        key={color}
                        sx={{
                          width: 33,
                          height: 33,
                          borderRadius: "50%",
                          bgcolor: color,
                          cursor: "pointer",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                        }}
                      >
                        {color === "#226BEF" && (
                          <CheckIcon sx={{ color: "white", fontSize: 16 }} />
                        )}
                      </Box>
                    ))}
                  </Box>
                </Box>

                {/* Table Info */}
                <Box sx={{ mb: 2 }}>
                  <TextField
                    fullWidth
                    value={`${selectedTable.floor} ${selectedTable.id}`}
                    variant="outlined"
                    size="small"
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: 48,
                      },
                    }}
                  />
                </Box>

                <Button
                  fullWidth
                  variant="contained"
                  startIcon={<QrCodeIcon />}
                  sx={{
                    bgcolor: "#F3F4F6",
                    color: "#374151",
                    height: 40,
                    mb: 2,
                    textTransform: "none",
                    "&:hover": {
                      bgcolor: "#E5E7EB",
                    },
                  }}
                >
                  QR 다운로드
                </Button>

                {/* Action Buttons */}
                <Box
                  sx={{
                    borderTop: "1px solid #E5E7EB",
                    pt: 2.5,
                    display: "flex",
                    gap: 1.5,
                  }}
                >
                  <Button
                    variant="contained"
                    startIcon={<DeleteIcon />}
                    onClick={handleDeleteTable}
                    sx={{
                      bgcolor: "#FFE6E2",
                      color: "#E72B23",
                      height: 40,
                      flex: 1,
                      textTransform: "none",
                      "&:hover": {
                        bgcolor: "#FFD6D2",
                      },
                    }}
                  >
                    삭제
                  </Button>
                  <Button
                    variant="contained"
                    startIcon={<ContentCopyIcon />}
                    onClick={handleDuplicateTable}
                    sx={{
                      bgcolor: "#E9F0FD",
                      color: "#226BEF",
                      height: 40,
                      flex: 1,
                      textTransform: "none",
                      "&:hover": {
                        bgcolor: "#D6E3FC",
                      },
                    }}
                  >
                    복제
                  </Button>
                </Box>
              </Box>
            </Box>
          )}
        </Box>
      </DialogContent>
    </Dialog>
  );
}
