import { Suspense } from "react";
import FailClient from "../components/Fail";

export default function FailPage() {
  return (
    <Suspense>
      <FailClient />
    </Suspense>
  );
}
