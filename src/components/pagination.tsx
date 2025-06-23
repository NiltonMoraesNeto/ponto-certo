import { ChevronLeft, ChevronRight } from "lucide-react";
import {
  Box,
  IconButton,
  MenuItem,
  Select,
  SelectChangeEvent,
  Typography,
} from "@mui/material";

interface PaginationProps {
  page: number;
  totalPages: number;
  setPage: (value: React.SetStateAction<number>) => void;
  limit: number;
  setLimit: React.Dispatch<React.SetStateAction<number>>;
}

export function Pagination({
  page,
  totalPages,
  setPage,
  limit,
  setLimit,
}: PaginationProps) {
  const handleChange = (event: SelectChangeEvent) => {
    setLimit(Number(event.target.value));
  };
  return (
    <Box
      display="flex"
      justifyContent="flex-end"
      alignItems="center"
      mt={4}
      gap={1}
    >
      <Typography
        variant="body2"
        color="text.secondary"
        sx={{ mr: 2, fontFamily: "sans-serif" }}
      >
        {page} de {totalPages}
      </Typography>

      <IconButton
        onClick={() => setPage(page - 1)}
        disabled={page === 1}
        color="primary"
        sx={{
          borderRadius: 2,
          bgcolor: "grey.100",
          "&:disabled": {
            opacity: 0.5,
          },
        }}
      >
        <ChevronLeft />
      </IconButton>

      <IconButton
        onClick={() => setPage(page + 1)}
        disabled={page === totalPages}
        color="primary"
        sx={{
          borderRadius: 2,
          bgcolor: "grey.100",
          "&:disabled": {
            opacity: 0.5,
          },
        }}
      >
        <ChevronRight />
      </IconButton>
      <Select
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={limit.toString()}
        label="Items por página"
        onChange={handleChange}
      >
        <MenuItem value={10}>10</MenuItem>
        <MenuItem value={20}>20</MenuItem>
        <MenuItem value={50}>50</MenuItem>
        <MenuItem value={100}>100</MenuItem>
        <MenuItem value={200}>200</MenuItem>
      </Select>
    </Box>
  );
}
