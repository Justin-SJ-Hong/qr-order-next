"use client";

import AddIcon from "@mui/icons-material/Add";
import CheckIcon from "@mui/icons-material/Check";
import CloseIcon from "@mui/icons-material/Close";
import DeleteIcon from "@mui/icons-material/Delete";
import {
  Box,
  Button,
  Dialog,
  IconButton,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import React from "react";

interface SpaceEditModalProps {
  open: boolean;
  onClose: () => void;
}

const spaceData = [
  { id: 1, name: "2층 홀" },
  { id: 2, name: "1층 홀" },
];

export const SpaceEditModal: React.FC<SpaceEditModalProps> = ({ open, onClose }) => {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 2,
          maxHeight: "90vh",
          minHeight: "400px",
          overflow: "hidden",
        },
      }}
      sx={{
        zIndex: 1500,
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          bgcolor: "white",
          height: "100%",
          maxHeight: "90vh",
        }}
      >
        <Box
          sx={{
            px: 3,
            py: 2.5,
            borderBottom: 1,
            borderColor: "grey.300",
          }}
        >
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" sx={{ fontWeight: 600, color: "grey.800" }}>
              공간 편집
            </Typography>
            <IconButton size="small" onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Stack>
        </Box>

        <Box sx={{ p: 2.5, flex: 1 }}>
          <Stack spacing={3}>
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
            >
              <Typography variant="subtitle2" sx={{ color: "grey.600", flex: 1 }}>
                공간 목록
              </Typography>
              <Button
                variant="outlined"
                size="small"
                startIcon={<AddIcon sx={{ fontSize: 12 }} />}
                sx={{
                  height: 32,
                  px: 1.5,
                  borderColor: "grey.300",
                  color: "grey.700",
                  fontSize: "0.875rem",
                }}
              >
                추가
              </Button>
            </Stack>

            <Stack spacing={2}>
              {spaceData.map((space) => (
                <Stack
                  key={space.id}
                  direction="row"
                  spacing={1}
                  alignItems="center"
                >
                  <Paper
                    variant="outlined"
                    sx={{
                      flex: 1,
                      px: 2,
                      py: 1.5,
                      height: 48,
                      display: "flex",
                      alignItems: "center",
                      borderColor: "grey.300",
                    }}
                  >
                    <Typography variant="body1" sx={{ color: "grey.500" }}>
                      {space.name}
                    </Typography>
                  </Paper>
                  <IconButton
                    sx={{
                      width: 48,
                      height: 48,
                      bgcolor: "grey.100",
                      borderRadius: 1,
                      "&:hover": {
                        bgcolor: "grey.200",
                      },
                    }}
                  >
                    <DeleteIcon sx={{ fontSize: 16 }} />
                  </IconButton>
                </Stack>
              ))}
            </Stack>
          </Stack>
        </Box>

        <Box
          sx={{
            px: 3,
            py: 2.5,
            borderTop: 1,
            borderColor: "grey.300",
            display: "flex",
            justifyContent: "flex-end",
            flexShrink: 0,
            mt: "auto",
          }}
        >
          <Stack direction="row" spacing={1.5}>
            <Button
              variant="contained"
              onClick={onClose}
              sx={{
                height: 40,
                px: 1.5,
                bgcolor: "grey.100",
                color: "grey.700",
                "&:hover": {
                  bgcolor: "grey.200",
                },
                boxShadow: "none",
              }}
            >
              취소
            </Button>
            <Button
              variant="contained"
              startIcon={<CheckIcon sx={{ fontSize: 16 }} />}
              sx={{
                width: 120,
                height: 40,
                px: 1.5,
                bgcolor: "primary.main",
                color: "white",
                "&:hover": {
                  bgcolor: "primary.dark",
                },
              }}
            >
              저장
            </Button>
          </Stack>
        </Box>
      </Box>
    </Dialog>
  );
};

export default SpaceEditModal;
