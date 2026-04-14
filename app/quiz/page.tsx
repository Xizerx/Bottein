import type { Metadata } from "next";
import QuizPage from "@/components/QuizPage";

export const metadata: Metadata = {
  title: "Take the Quiz",
  description:
    "Answer 5 quick questions and get a protein formula built for your goals, lifestyle, and taste.",
};

export default function Page() {
  return <QuizPage />;
}
