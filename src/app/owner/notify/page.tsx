"use client";

import {
    Box,
    Button,
    Paper,
    Stack,
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableRow,
    Typography,
} from "@mui/material";
import React, { useState } from "react";

const filterButtons = [
    { id: "all", label: "전체" },
    { id: "announcements", label: "공지사항" },
    { id: "updates", label: "업데이트" },
];

const tableHeaders = [
    { id: "category", label: "카테고리", width: 120 },
    { id: "title", label: "제목", flex: 1 },
    { id: "date", label: "등록일", width: 120 },
];

const notificationData = [
    {
        id: 1,
        category: "업데이트",
        title: "공지사항 내용입니다.",
        date: "2025.01.01",
    },
];

export default function NotifyPage() {
    const [selectedFilter, setSelectedFilter] = useState("all");

    const handleFilterClick = (filterId: string) => {
        setSelectedFilter(filterId);
    };

    return (
        <Box sx={{ p: 3,minHeight: "100vh", minWidth: "100vw" }}>
            <Stack spacing={2.5}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 3 }}>
                    <Typography
                        variant="h4"
                        sx={{
                        color: "grey.800",
                        fontWeight: 600,
                        }}
                    >
                        알림
                    </Typography>
                </Box>

                <Stack direction="row" spacing={1}>
                    {filterButtons.map((button) => (
                        <Button
                            key={button.id}
                            variant={
                                selectedFilter === button.id ? "contained" : "outlined"
                            }
                            onClick={() => handleFilterClick(button.id)}
                            sx={{
                                height: 36,
                                px: 2,
                                py: 1,
                                borderRadius: 20,
                                fontSize: "14px",
                                fontWeight: 500,
                                color: selectedFilter === button.id ? "white" : "grey.700",
                                bgcolor:
                                selectedFilter === button.id ? "grey.200" : "transparent",
                                borderColor: "transparent",
                                boxShadow: "0 1px 2px rgba(0, 0, 0, 0.05)",
                                "&:hover": {
                                bgcolor:
                                    selectedFilter === button.id ? "grey.300" : "grey.50",
                                },
                            }}
                        >
                        {button.label}
                        </Button>
                    ))}
                </Stack>

                <Paper elevation={0} sx={{ width: "100%" }}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                {tableHeaders.map((header) => (
                                    <TableCell
                                        key={header.id}
                                        sx={{
                                        width: header.width || "auto",
                                        flex: header.flex || "none",
                                        height: 60,
                                        bgcolor: "grey.50",
                                        borderBottom: 1,
                                        borderColor: "grey.300",
                                        px: 1.5,
                                        py: 0,
                                        }}
                                    >
                                        <Typography
                                            variant="caption"
                                            sx={{
                                                color: "grey.500",
                                                fontWeight: 500,
                                            }}
                                        >
                                            {header.label}
                                        </Typography>
                                    </TableCell>
                                ))}
                            </TableRow>
                        </TableHead>
                        <TableBody>
                            {notificationData.map((row) => (
                                <TableRow key={row.id}>
                                    <TableCell
                                        sx={{
                                        width: 120,
                                        height: 68,
                                        borderBottom: 1,
                                        borderColor: "grey.300",
                                        px: 2,
                                        py: 1.5,
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "grey.700",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {row.category}
                                        </Typography>
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                        flex: 1,
                                        height: 68,
                                        borderBottom: 1,
                                        borderColor: "grey.300",
                                        px: 2,
                                        py: 1.5,
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "grey.700",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {row.title}
                                        </Typography>
                                    </TableCell>
                                    <TableCell
                                        sx={{
                                        width: 120,
                                        height: 68,
                                        borderBottom: 1,
                                        borderColor: "grey.300",
                                        px: 2,
                                        py: 1.5,
                                        }}
                                    >
                                        <Typography
                                            variant="body2"
                                            sx={{
                                                color: "grey.700",
                                                whiteSpace: "nowrap",
                                            }}
                                        >
                                            {row.date}
                                        </Typography>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </Paper>
            </Stack>
        </Box>
    );
}
