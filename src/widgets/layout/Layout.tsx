import { Box, CssBaseline } from "@mui/material";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CssBaseline />
      <Box
        sx={{ display: "flex", flexDirection: "column", minHeight: "100vh" }}
      >
        <Box component="main" sx={{ flexGrow: 1 }}>
          {children}
        </Box>
      </Box>
    </>
  );
}
