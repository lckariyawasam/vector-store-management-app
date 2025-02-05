import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Toolbar from "@mui/material/Toolbar";
import { AppBar, Box, Stack, Tooltip, IconButton, Switch } from "@mui/material";
import { Brightness4, Brightness7 } from "@mui/icons-material"; // Add icons for dark and light theme

const Header = ({ theme, setTheme }) => {
  const handleThemeToggle = () => {
    setTheme.toggleColorMode((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <AppBar
      position="relative"
      sx={{
        zIndex: (theme) => theme.zIndex.drawer + 1,
        color: (theme) => (theme.palette.mode === "light" ? "#0d0d0d" : theme.palette.common.white),
        background: (theme) => (theme.palette.mode === "light" ? theme.palette.common.white : "#0d0d0d"),
        boxShadow: 1,
      }}
    >
      <Toolbar
        variant="dense"
        sx={{
          paddingY: 0.3,
          "&.MuiToolbar-root": {
            pl: 0.3,
          },
        }}
      >
        <img
          alt="wso2"
          style={{
            height: "45px",
            maxWidth: "100px",
          }}
          onClick={() => (window.location.href = "/")}
          src="https://wso2.cachefly.net/wso2/sites/images/brand/downloads/wso2-logo.svg"
        ></img>
        <Typography
          variant="h5"
          sx={{
            ml: 1,
            flexGrow: 1,
            fontWeight: 600,
          }}
        >
          Vector Store Creation and Management Application
        </Typography>

        <Box sx={{ flexGrow: 0 }}>
          <Stack flexDirection={"row"} alignItems={"center"} gap={2}>
            <Tooltip title="Switch Theme">
              <IconButton onClick={handleThemeToggle}>
                {theme === "light" ? <Brightness7 /> : <Brightness4 />}
              </IconButton>
            </Tooltip>
          </Stack>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Header;
