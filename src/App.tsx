import { AppShell } from "./widgets/layout/AppShell";
import { Agentation } from "agentation";

export default function App() {
  return (
    <>
      <AppShell />
      {import.meta.env.DEV && <Agentation />}
    </>
  );
}
