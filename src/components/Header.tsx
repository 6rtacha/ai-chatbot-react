import React from "react";
import {
  Stack,
  Link,
  Toolbar,
  Typography,
  Container,
  AppBar,
} from "@mui/material";
const pages = [
  { name: "Home", id: "home" },
  { name: "Chat", id: "chat" },
  { name: "Login", id: "login" },
];
const Header = () => {
  return (
    <AppBar>
      <Container>
        <Toolbar>
          <Stack
            direction="row"
            justifyContent="center"
            alignItems="center"
            width="100%"
          >
            <Stack direction="row" gap={3}>
              {pages.map((page) => (
                <Link
                  key={page.id}
                  sx={{
                    color: { xs: "primary", sm: "white" },
                  }}
                >
                  {page.name}
                </Link>
              ))}
            </Stack>
          </Stack>
        </Toolbar>
      </Container>
    </AppBar>
  );
};
export default Header;
