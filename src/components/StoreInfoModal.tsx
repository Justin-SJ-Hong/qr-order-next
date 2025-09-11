"use client";

import CloseIcon from "@mui/icons-material/Close";
import ArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import {
    Box,
    Button,
    Dialog,
    FormControl,
    IconButton,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import React from "react";

interface StoreInfoModalProps {
    open: boolean;
    onClose: () => void;
}

export const StoreInfoModal: React.FC<StoreInfoModalProps> = ({ open, onClose }) => {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            maxWidth="sm"
            fullWidth
            PaperProps={{
                sx: {
                    borderRadius: 2,
                    maxHeight: "45%",
                    maxWidth: "25%",
                    overflow: "hidden", // Hide scrollbar
                },
            }}
            sx={{
                zIndex: 1500, // Higher than drawer (1400)
                "& .MuiDialog-paper": {
                    overflow: "hidden", // Hide scrollbar
                },
            }}
        >
            <Box
                sx={{
                display: "flex",
                flexDirection: "column",
                bgcolor: "white",
                minHeight: "100vh",
                overflow: "hidden", // Hide scrollbar
                }}
            >
                <Box
                    sx={{
                        px: 3,
                        py: 2.5,
                        bgcolor: "white",
                        borderBottom: 1,
                        borderColor: "grey.300",
                    }}
                >
                    <Stack
                        direction="row"
                        justifyContent="space-between"
                        alignItems="center"
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                fontWeight: 600,
                                color: "grey.700",
                            }}
                        >
                            매장 정보
                        </Typography>

                        <IconButton size="small" onClick={onClose}>
                            <CloseIcon />
                        </IconButton>
                    </Stack>
                </Box>

                                 <Box sx={{ px: 2.5, py: 2.5, flex: 1, overflow: "hidden" }}>
                     <Stack spacing={3}>
                        <Stack spacing={1.5}>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                color: "grey.600",
                                fontWeight: 500,
                                }}
                            >
                                매장 이름
                            </Typography>
                            <TextField
                                placeholder="매장이름"
                                variant="outlined"
                                fullWidth
                                sx={{
                                "& .MuiOutlinedInput-root": {
                                    height: 48,
                                    "& input": {
                                    color: "grey.400",
                                    },
                                },
                                }}
                            />
                        </Stack>

                        <Stack spacing={1.5}>
                            <Typography
                                variant="subtitle2"
                                sx={{
                                color: "grey.600",
                                fontWeight: 500,
                                }}
                            >
                                업종
                            </Typography>
                            <FormControl fullWidth>
                                <Select
                                    displayEmpty
                                    value=""
                                    sx={{
                                        height: 48,
                                        "& .MuiSelect-select": {
                                        color: "grey.400",
                                        },
                                    }}
                                    IconComponent={ArrowDownIcon}
                                >
                                    <MenuItem value="" disabled>
                                        업종
                                    </MenuItem>
                                </Select>
                            </FormControl>
                        </Stack>

                        {/* Save Button */}
                        <Box sx={{ display: "flex", justifyContent: "flex-end", pt: 2 }}>
                            <Button
                                variant="contained"
                                sx={{
                                    width: 120,
                                    height: 40,
                                    bgcolor: "primary.main",
                                    borderRadius: 1,
                                    textTransform: "none",
                                    fontSize: "14px",
                                    fontWeight: 500,
                                }}
                            >
                                저장
                            </Button>
                        </Box>
                    </Stack>
                </Box>
            </Box>
        </Dialog>
    );
};

export default StoreInfoModal;
