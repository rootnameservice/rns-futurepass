"use client";

import { Grid, styled } from "@mui/material";

import Commit from "./components/commit";
import styles from "./page.module.css";

const Container = styled(Grid)(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

export default function Home() {
  return (
    <main className={styles.main}>
      <Container>
        <Commit />
      </Container>
    </main>
  );
}
